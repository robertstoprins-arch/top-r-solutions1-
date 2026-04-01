"""
Screwfix scraper.

Search URL: https://www.screwfix.com/search?search={query}

SELECTOR CONSTANTS — update these if Screwfix changes their DOM.
To verify: open the URL in Chrome DevTools, inspect the first product card.
"""

import asyncio
import random
import urllib.parse

from .base import BaseSupplierScraper, PriceResult

# ── Selectors ─────────────────────────────────────────────────────────────────
# Verified against live DOM: update here if they stop working.
PRODUCT_CARD    = 'ul[class*="productList"] li, [data-test="product-list"] li, .productList li'
PRODUCT_TITLE   = '[class*="productTitle"], h3, [data-test="product-title"]'
PRICE_MAIN      = '[class*="price"] [class*="value"], [class*="Price"] span, .price'
AVAILABILITY    = '[class*="availability"], [class*="Availability"], [class*="stock"]'
PRODUCT_LINK    = 'a[href*="/p/"]'


class ScrewfixScraper(BaseSupplierScraper):
    SUPPLIER_NAME = "Screwfix"
    BASE_URL = "https://www.screwfix.com"

    async def get_price(self, page, item: str, quantity: float, unit: str, postcode: str) -> PriceResult:
        query = urllib.parse.quote_plus(item)
        url = f"{self.BASE_URL}/search?search={query}"

        try:
            await asyncio.sleep(random.uniform(0.5, 1.5))
            await page.goto(url, wait_until="domcontentloaded", timeout=20_000)

            # Handle cookie consent banner if present
            try:
                consent = await page.query_selector('[id*="cookie"] button, [class*="cookie"] button, #onetrust-accept-btn-handler')
                if consent:
                    await consent.click()
                    await asyncio.sleep(0.3)
            except Exception:
                pass

            # Wait for product list
            try:
                await page.wait_for_selector(PRODUCT_CARD, timeout=8_000)
            except Exception:
                # Check if blocked / captcha
                content = await page.content()
                if any(w in content.lower() for w in ["captcha", "access denied", "robot", "forbidden"]):
                    return self._error(item, "blocked")
                return self._error(item, "no_results")

            cards = await page.query_selector_all(PRODUCT_CARD)
            if not cards:
                return self._error(item, "no_results")

            card = cards[0]

            # Product name
            name_el = await card.query_selector(PRODUCT_TITLE)
            product_name = (await name_el.inner_text()).strip() if name_el else item

            # Product URL
            link_el = await card.query_selector(PRODUCT_LINK)
            product_url = ""
            if link_el:
                href = await link_el.get_attribute("href")
                if href:
                    product_url = href if href.startswith("http") else self.BASE_URL + href

            # Price — try multiple selector strategies
            price = await _extract_price(card, PRICE_MAIN)

            # Availability
            avail_el = await card.query_selector(AVAILABILITY)
            avail_text = (await avail_el.inner_text()).strip().lower() if avail_el else ""
            availability = _parse_availability(avail_text)

            # Delivery estimate from availability text
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


# ── Helpers ───────────────────────────────────────────────────────────────────

async def _extract_price(card, selector: str) -> float | None:
    """Try the given selector, then fall back to searching all text for a £ price."""
    try:
        el = await card.query_selector(selector)
        if el:
            raw = (await el.inner_text()).strip()
            return _parse_price(raw)
    except Exception:
        pass

    # Fallback: scan all text nodes in the card for a £ value
    try:
        text = (await card.inner_text())
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
    if any(w in text for w in ["in stock", "available", "add to"]):
        return "in stock"
    if any(w in text for w in ["limited", "low stock", "last few"]):
        return "limited"
    if any(w in text for w in ["out of stock", "unavailable", "not available"]):
        return "out of stock"
    return "unknown"


def _parse_delivery(text: str) -> str:
    if any(w in text for w in ["next day", "next working", "tomorrow"]):
        return "next day"
    if any(w in text for w in ["2-3", "2 to 3", "2–3"]):
        return "2-3 days"
    if any(w in text for w in ["3-5", "3 to 5", "3–5"]):
        return "3-5 days"
    return "unknown"
