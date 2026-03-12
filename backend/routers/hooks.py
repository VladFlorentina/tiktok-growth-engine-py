"""
Hook Generator router — generates viral TikTok/Instagram opening hooks via Gemini.
"""
from fastapi import APIRouter
from models.schemas import HookGenerateRequest, HookGenerateResponse
import services.ai_service as ai

router = APIRouter(prefix="/hooks", tags=["Hook Generator"])


@router.post("/generate", response_model=HookGenerateResponse)
async def generate_hooks(request: HookGenerateRequest):
    """
    Generate 1-10 high-retention hook variants for a given topic.
    Uses Gemini AI when API key is set, otherwise returns rich mock data.
    """
    return ai.generate_hooks(
        topic=request.topic,
        niche=request.niche,
        tone=request.tone,
        platform=request.platform,
        count=request.count,
        language=request.language,
    )
