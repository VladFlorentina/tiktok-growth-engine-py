"""
Viral Script Engine router — generates full scene-by-scene video scripts.
"""
from fastapi import APIRouter
from models.schemas import ScriptGenerateRequest, ScriptGenerateResponse
import services.ai_service as ai

router = APIRouter(prefix="/scripts", tags=["Script Engine"])


@router.post("/generate", response_model=ScriptGenerateResponse)
async def generate_script(request: ScriptGenerateRequest):
    """
    Generate a full TikTok/Instagram script with scene-by-scene filming instructions.
    Supports 15s, 30s, 45s, and 60s formats.
    """
    return ai.generate_script(
        topic=request.topic,
        niche=request.niche,
        duration_seconds=request.duration_seconds,
        platform=request.platform,
        tone=request.tone,
        hook=request.hook,
        cta=request.cta,
        language=request.language,
    )
