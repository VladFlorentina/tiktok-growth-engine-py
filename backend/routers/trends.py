"""
Trend Radar router — returns trending sounds, hashtags, and formats.
Reads from Supabase. Falls back to rich mock data if DB is not connected.
"""
from datetime import datetime, timezone
from fastapi import APIRouter, Query
from models.schemas import TrendData
from typing import List

router = APIRouter(prefix="/trends", tags=["Trend Radar"])

# Rich mock trend data (used when Supabase is not yet configured)
MOCK_TRENDS: List[TrendData] = [
    TrendData(id="1", name="Espresso – Sabrina Carpenter", category="sound", platform="tiktok", viral_score=97, growth_rate="+420% this week", description="Upbeat pop sound dominating lifestyle, fashion, and food niches", best_niches=["fashion", "food", "lifestyle", "travel"], fetched_at=datetime.now(timezone.utc)),
    TrendData(id="2", name="#ThatGirl", category="hashtag", platform="tiktok", viral_score=93, growth_rate="+280% this week", description="Morning routine, wellness, and productivity content exploding", best_niches=["wellness", "fitness", "productivity", "beauty"], fetched_at=datetime.now(timezone.utc)),
    TrendData(id="3", name="POV storytelling format", category="format", platform="tiktok", viral_score=91, growth_rate="+190% this week", description="First-person POV narrative style getting massive push from the algorithm", best_niches=["dating", "business", "fitness", "education"], fetched_at=datetime.now(timezone.utc)),
    TrendData(id="4", name="Running up that Hill remix", category="sound", platform="instagram", viral_score=88, growth_rate="+310% this week", description="Emotional/transformation content using 80s-inspired remix", best_niches=["fitness", "motivation", "fashion", "travel"], fetched_at=datetime.now(timezone.utc)),
    TrendData(id="5", name="#SmallBusiness", category="hashtag", platform="tiktok", viral_score=85, growth_rate="+150% this week", description="Behind-the-scenes entrepreneur content performing extremely well", best_niches=["ecommerce", "food", "handmade", "services"], fetched_at=datetime.now(timezone.utc)),
    TrendData(id="6", name="Talking head + B-roll split", category="format", platform="tiktok", viral_score=82, growth_rate="+120% this week", description="Alternating between face-to-camera and B-roll keeps watch time high", best_niches=["education", "business", "cooking", "tech"], fetched_at=datetime.now(timezone.utc)),
    TrendData(id="7", name="#BookTok", category="hashtag", platform="tiktok", viral_score=79, growth_rate="+95% this week", description="Reading recommendations and book reviews driving millions of views", best_niches=["books", "education", "lifestyle", "self-help"], fetched_at=datetime.now(timezone.utc)),
    TrendData(id="8", name="Day in my life vlog style", category="format", platform="instagram", viral_score=76, growth_rate="+88% this week", description="Raw, unfiltered daily routine content outperforming polished content", best_niches=["lifestyle", "fitness", "entrepreneur", "student"], fetched_at=datetime.now(timezone.utc)),
]


@router.get("/", response_model=List[TrendData])
async def get_trends(
    platform: str = Query(default="all", description="Filter: tiktok | instagram | all"),
    category: str = Query(default="all", description="Filter: sound | hashtag | format | challenge | all"),
    region: str = Query(default="global", description="Filter by region (global, us, eu, etc)"),
    limit: int = Query(default=10, le=50),
):
    """Get current trending sounds, hashtags, and formats."""
    try:
        from database import get_supabase
        sb = get_supabase()
        query = sb.table("trend_data").select("*").order("viral_score", desc=True).limit(limit)
        if platform != "all":
            query = query.eq("platform", platform)
        if category != "all":
            query = query.eq("category", category)
        if region != "all":
            query = query.eq("region", region)
        result = query.execute()
        if result.data:
            return [TrendData(**row) for row in result.data]
    except Exception:
        pass  # Fall back to mock data

    # Apply filters to mock data
    filtered = MOCK_TRENDS
    if platform != "all":
        filtered = [t for t in filtered if t.platform == platform]
    if category != "all":
        filtered = [t for t in filtered if t.category == category]
    if region != "all":
        filtered = [t for t in filtered if getattr(t, 'region', 'global') == region]
    return filtered[:limit]


@router.get("/top", response_model=List[TrendData])
async def get_top_trends():
    """Get top 5 trends by viral score across all platforms."""
    sorted_trends = sorted(MOCK_TRENDS, key=lambda x: x.viral_score, reverse=True)
    return sorted_trends[:5]
