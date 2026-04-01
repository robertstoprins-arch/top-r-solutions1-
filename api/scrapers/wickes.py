"""
Wickes scraper.

Search URL: https://www.wickes.co.uk/search#q={query}&t=All

SELECTOR CONSTANTS — update these if Wickes changes their DOM.
To verify: open the URL in Chrome DevTools, inspect the first product card.
"""

import asyncio
import random
import urllib.parse

from .base import BaseSupplierScraper, PriceResult

# ── Selectors ─────────────────────────────────────────────────────────────────
PRODUCT_CARD  = '[class*="product-card"], [class*="ProductCard"], [class*="product-tile"], .product-item, [data-component*="product"]'
PRODUCT_TITLE = '[class*="product-title"], [class*="ProductTitle"], [class*="name"], h3, h2'
PRICE_MAIN    = '[class*="price"], [class*="Price"], [data-price], [itemprop="price"]'
AVAILABILITY  = '[class*="availability"], [class*="stock"], [class*="delivery"]'
PRODUCT_LINK  = 'a[href*="/product"], a[href*="/p/"]'


class WickesScraper(BaseSupplierScraper):
    SUPPLIER_NAME = "Wickes"
    BASE_URL = "https://www.wickes.co.uk"

    async def get_price(self, page, item: str, quantity: float, unit: str, postcode: str) -> PriceResult:
        query = urllib.parse.quote_plus(item)
        # Wickes uses a hash-based search URL
        url = f"{self.BASE_URL}/search#q={query}&t=All"

        try:
            await asyncio.sleep(random.uniform(0.5, 1.5))
            await page.goto(url, wait_until="networkidle", timeout=25_000)

            # Handle cookie consent
            try:
                consent = await page.query_selector(
                    '#onetrust-accept-btn-handler, [class*="cookie"] button, [aria-label*="cookie"] button'
                )
                if consent:
                    await consent.click()
                    await asyncio.sleep(0.5)
            except Exception:
                pass

            # Wickes uses heavy JS — wait a bit longer
            await asyncio.sleep(1.0)

            try:
                await page.wait_for_selector(PRODUCT_CARD, timeout=10_000)
            except Exception:
                content = await page.content()
                if any(w in content.lower() for w in ["captcha", "access denied", "robot"]):
                    return self._error(item, "blocked")
                return self._error(item, "no_results")

            cards = await page.query_selector_all(PRODUCT_CARD)
            if not cards:
                return self._error(item, "no_results")

            card = cards[0]

            name_el = await card.query_selector(PRODUCT_TITLE)
            product_name = (await name_el.inner_text()).strip() if name_el else item

            link_el = await card.query_selector(PRODUCT_LINK)
            if not link_el:
                link_el = await card.query_selector("a[href]")
            product_url = ""
            if link_el:
                href = await link_el.get_attribute("href")
                if href:
                    product_url = href if href.startswith("http") else self.BASE_URL + href

            price = await _extract_price(card, PRICE_MAIN)

            avail_el = await card.query_selector(AVAILABILITY)
            avail_text = (await avail_el.inner_text()).strip().lower() if avail_el else ""
            availability = _parse_availability(avail_text)
            delivery = _parse_delivery(avail_text)

            total = round(price * quantity, 2) if price is not None else None

            return PriceResult(
                supplier=self.SUPPLIER_NAME,
                item_description=item,
                price_per_unit=price,
                total_price=total,
                unit=unit,
                availability=availability,
                delivery_days=delivery,
                product_name=product_name,
                product_url=product_url,
            )

        except asyncio.TimeoutError:
            return self._error(item, "timeout")
        except Exception as e:
            return self._error(item, str(e)[:120])


async def _extract_price(card, selector: str) -> float | None:
    try:
        el = await card.query_selector(selector)
        if el:
            raw = (await el.inner_text()).strip()
            return _parse_price(raw)
    except Exception:
        pass
    try:
        text = await card.inner_text()
        return _parse_price(text)
    except Exception:
        return None


def _parse_price(text: str) -> float | None:
    import re
    match = re.search(r"£\s*([\d,]+\.?\d*)", text)
    if match:
        return float(match.group(1).replace(",", ""))
    return None


def _parse_availability(text: str) -> str:
    if any(w in text for w in ["in stock", "available", "add to basket", "add to trolley"]):
        return "in stock"
    if any(w in text for w in ["limited", "low stock"]):
        return "limited"
    if any(w in text for w in ["out of stock", "unavailable"]):
        return "out of stock"
    return "unknown"


def _parse_delivery(text: str) -> str:
    if any(w in text for w in ["next day", "next working day"]):
        return "next day"
    if any(w in text for w in ["2-3", "2 to 3"]):
        return "2-3 days"
    if any(w in text for w in ["3-5", "3 to 5"]):
        return "3-5 days"
    return "unknown"
