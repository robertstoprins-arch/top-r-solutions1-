"""
Base class and shared data structures for all supplier scrapers.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
class PriceResult:
    supplier: str
    item_description: str
    price_per_unit: float | None = None
    total_price: float | None = None
    currency: str = "GBP"
    unit: str = "units"
    availability: str = "unknown"   # "in stock" | "limited" | "out of stock" | "unknown"
    delivery_days: str = "unknown"  # "next day" | "2-3 days" | "3-5 days" | "unknown"
    product_name: str = ""
    product_url: str = ""
    error: str | None = None


class BaseSupplierScraper(ABC):
    SUPPLIER_NAME: str = ""
    BASE_URL: str = ""

    @abstractmethod
    async def get_price(
        self,
        page,
        item: str,
        quantity: float,
        unit: str,
        postcode: str,
    ) -> PriceResult:
        """
        Search the supplier site for `item` and return a PriceResult.
        Never raises — errors are captured in PriceResult.error.
        """
        ...

    def _error(self, item: str, msg: str) -> PriceResult:
        return PriceResult(
            supplier=self.SUPPLIER_NAME,
            item_description=item,
            error=msg,
        )
