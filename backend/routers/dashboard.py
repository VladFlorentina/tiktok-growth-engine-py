from fastapi import APIRouter
from database import get_db

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
async def get_dashboard_stats():
    """Returns live usage and aggregation metrics from the database."""
    supabase = get_db()
    
    # We query the count of available trends
    trends_resp = supabase.table("trend_data").select("id", count="exact").execute()
    trends_count = trends_resp.count if hasattr(trends_resp, "count") else len(trends_resp.data)
    
    # We query the count of scripts generated (history)
    scripts_resp = supabase.table("scripts").select("id", count="exact").execute()
    scripts_count = scripts_resp.count if hasattr(scripts_resp, "count") else len(scripts_resp.data)

    # We query the count of hooks generated (history)
    hooks_resp = supabase.table("hook_variants").select("id", count="exact").execute()
    hooks_count = hooks_resp.count if hasattr(hooks_resp, "count") else len(hooks_resp.data)

    return {
        "trends_tracked": trends_count,
        "scripts_generated": scripts_count,
        "hooks_created": hooks_count,
        "recent_activity": [
            {"time": "Today", "action": "Daily Trend Scraper", "topic": f"Refreshed {trends_count} trends globally", "color": "#30d158"},
        ]
    }
