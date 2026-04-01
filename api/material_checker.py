"""
Material Price Checker — async orchestrator.

Spins up a single Playwright browser context and fans out all
(item × supplier) searches concurrently, then collates results
into per-item rows with one column per supplier.

Called by the FastAPI route in server.py:
    from material_checker import check_prices
"""

import asyncio
import random
from dataclasses import asdict

from playwright.async_api import async_playwright

from scrapers.base import PriceResult
from scrapers.screwfix import ScrewfixScraper
from scrapers.toolstation import ToolstationScraper
from scrapers.travis_perkins import TravisPerkinsScraper
from scrapers.wickes import WickesScraper

SCRAPERS = [ScrewfixScraper, ToolstationScraper, TravisPerkinsScraper, WickesScraper]
MAX_CONCURRENT = 8   # semaphore limit — keeps memory reasonable


async def check_prices(items: list[dict], postcode: str) -> list[dict]:
    """
    items: [{ description, quantity, unit }, ...]
    Returns a list of MaterialRow dicts, one per item.
    """
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
                "--disable-dev-shm-usage",
            ],
        )
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1280, "height": 800},
            locale="en-GB",
            timezone_id="Europe/London",
            extra_http_headers={"Accept-Language": "en-GB,en;q=0.9"},
        )
        # Mask navigator.webdriver to avoid basic bot detection
        await context.add_init_script(
            "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
        )

        sem = asyncio.Semaphore(MAX_CONCURRENT)
        tasks = [
            _run_single(context, sem, ScraperClass(), item, postcode)
            for item in items
            for ScraperClass in SCRAPERS
        ]
        flat_results: list[PriceResult] = await asyncio.gather(*tasks, return_exceptions=False)
        await browser.close()

    return _collate(items, flat_results)


async def _run_single(context, sem: asyncio.Semaphore, scraper, item: dict, postcode: str) -> PriceResult:
    async with sem:
        page = await context.new_page()
        try:
            result = await asyncio.wait_for(
                scraper.get_price(
                    page,
                    item["description"],
                    item["quantity"],
                    item["unit"],
                    postcode,
                ),
                timeout=25.0,
            )
            return result
        except asyncio.TimeoutError:
            return PriceResult(
                supplier=scraper.SUPPLIER_NAME,
                item_description=item["description"],
                error="timeout",
            )
        except Exception as e:
            return PriceResult(
                supplier=scraper.SUPPLIER_NAME,
                item_description=item["description"],
                error=str(e)[:120],
            )
        finally:
            await page.close()


def _collate(items: list[dict], flat: list[PriceResult]) -> list[dict]:
    """
    Reshape flat [PriceResult] list into per-item rows:
    [
      {
        description, quantity, unit,
        results: {
          "Screwfix": { price_per_unit, total_price, availability, ... },
          "Toolstation": { ... },
          ...
        }
      },
      ...
    ]
    """
    supplier_names = [cls.SUPPLIER_NAME for cls in SCRAPERS]
    rows = []

    for item in items:
        desc = item["description"]
        supplier_results = {}
        for result in flat:
            if result.item_description == desc and result.supplier in supplier_names:
                d = asdict(result)
                # Remove redundant fields from the nested result
                d.pop("supplier", None)
                d.pop("item_description", None)
                d.pop("currency", None)
                supplier_results[result.supplier] = d

        # Ensure every supplier has an entry (even if missing from results)
        for name in supplier_names:
            if name not in supplier_results:
                supplier_results[name] = {
                    "price_per_unit": None,
                    "total_price": None,
                    "unit": item["unit"],
                    "availability": "unknown",
                    "delivery_days": "unknown",
                    "product_name": "",
                    "product_url": "",
                    "error": "missing",
                }

        rows.append({
            "description": desc,
            "quantity": item["quantity"],
            "unit": item["unit"],
            "results": supplier_results,
        })

    return rows
