import asyncio
import logging
from services.trend_scraper import scrape_daily_trends

logging.basicConfig(level=logging.INFO)

async def main():
    print("Forcing manual run of the Daily Trend Scraper...")
    await scrape_daily_trends()
    print("Scraping complete. Check Supabase for new data.")

if __name__ == "__main__":
    asyncio.run(main())
