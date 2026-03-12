"""
Pydantic schemas for all API resources.
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ─── Auth ───────────────────────────────────────────────────
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    plan: str = "free"
    created_at: Optional[datetime] = None


# ─── Hooks ──────────────────────────────────────────────────
class HookGenerateRequest(BaseModel):
    topic: str
    niche: str
    tone: str = "energetic"
    platform: str = "tiktok"
    count: int = 5
    language: str = "en"


class HookVariant(BaseModel):
    id: int
    hook: str
    style: str
    why_it_works: str


class HookGenerateResponse(BaseModel):
    topic: str
    variants: List[HookVariant]
    generated_at: datetime


# ─── Scripts ────────────────────────────────────────────────
class ScriptGenerateRequest(BaseModel):
    topic: str
    niche: str
    duration_seconds: int = 30
    platform: str = "tiktok"
    tone: str = "energetic"
    hook: Optional[str] = None
    cta: str = "Follow for more"
    language: str = "en"


class ScriptScene(BaseModel):
    scene_number: int
    duration_seconds: int
    visual_description: str
    spoken_text: str
    on_screen_text: Optional[str] = None


class ScriptGenerateResponse(BaseModel):
    title: str
    platform: str
    total_duration: int
    hook: str
    scenes: List[ScriptScene]
    cta: str
    filming_tips: List[str]
    generated_at: datetime


# ─── Trends ─────────────────────────────────────────────────
class TrendData(BaseModel):
    id: Optional[str] = None
    name: str
    category: str
    platform: str
    viral_score: int
    growth_rate: str
    description: str
    best_niches: List[str]
    region: str = "global"
    fetched_at: Optional[datetime] = None


# ─── Competitor Analysis ─────────────────────────────────────
class CompetitorAnalyzeRequest(BaseModel):
    video_url: str
    competitor_niche: str
    platform: str = "tiktok"
    language: str = "en"


class CompetitorInsight(BaseModel):
    strength: str
    why_it_worked: str
    steal_this: str


class CompetitorAnalyzeResponse(BaseModel):
    overall_score: int
    insights: List[CompetitorInsight]
    hook_analysis: str
    pacing_analysis: str
    cta_analysis: str
    recommended_actions: List[str]
    generated_at: datetime


# ─── UGC / Creator Profiles ─────────────────────────────────
class CreatorProfileCreate(BaseModel):
    name: str
    niche: str
    platform: str
    follower_count: int
    avg_views: int
    rate_per_video: float
    contact_email: EmailStr
    region: str = "global"
    portfolio_url: Optional[str] = None
    bio: Optional[str] = None


class CreatorProfile(CreatorProfileCreate):
    id: str
    created_at: datetime
