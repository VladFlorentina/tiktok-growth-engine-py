"""
UGC Bridge router — creator directory for brand-creator matching.
"""
from fastapi import APIRouter, HTTPException, Query
from models.schemas import CreatorProfileCreate, CreatorProfile
from datetime import datetime, timezone
from typing import List
import uuid

router = APIRouter(prefix="/ugc", tags=["UGC Bridge"])

# In-memory store for demo; replace with Supabase calls
_demo_creators: List[CreatorProfile] = [
    CreatorProfile(id="c1", name="Alex Popescu", niche="fitness", platform="tiktok", follower_count=45000, avg_views=12000, rate_per_video=150.0, contact_email="alex@example.com", bio="Fitness coach creating daily workout content", created_at=datetime.now(timezone.utc)),
    CreatorProfile(id="c2", name="Maria Ionescu", niche="beauty", platform="instagram", follower_count=82000, avg_views=25000, rate_per_video=300.0, contact_email="maria@example.com", bio="Beauty and skincare micro-influencer", created_at=datetime.now(timezone.utc)),
    CreatorProfile(id="c3", name="Dan Mihai", niche="food", platform="tiktok", follower_count=31000, avg_views=9500, rate_per_video=120.0, contact_email="dan@example.com", bio="Home chef creating quick recipe videos", created_at=datetime.now(timezone.utc)),
]


@router.get("/creators", response_model=List[CreatorProfile])
async def list_creators(
    niche: str = Query(default="all"),
    platform: str = Query(default="all"),
    max_rate: float = Query(default=10000.0),
):
    """Browse creator profiles. Filter by niche, platform, and budget."""
    creators = _demo_creators
    if niche != "all":
        creators = [c for c in creators if c.niche.lower() == niche.lower()]
    if platform != "all":
        creators = [c for c in creators if c.platform.lower() == platform.lower()]
    creators = [c for c in creators if c.rate_per_video <= max_rate]
    return creators


@router.post("/creators", response_model=CreatorProfile)
async def create_creator_profile(data: CreatorProfileCreate):
    """Register as a creator in the UGC directory."""
    profile = CreatorProfile(
        id=str(uuid.uuid4()),
        created_at=datetime.now(timezone.utc),
        **data.model_dump(),
    )
    _demo_creators.append(profile)
    return profile


@router.get("/creators/{creator_id}", response_model=CreatorProfile)
async def get_creator(creator_id: str):
    for c in _demo_creators:
        if c.id == creator_id:
            return c
    raise HTTPException(status_code=404, detail="Creator not found")
