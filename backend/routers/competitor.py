"""
Competitor Analysis router — AI-powered breakdown of why competitor videos went viral.
"""
from fastapi import APIRouter
from models.schemas import CompetitorAnalyzeRequest, CompetitorAnalyzeResponse
import services.ai_service as ai
import services.extractor_service as extractor

router = APIRouter(prefix="/competitor", tags=["Competitor Analysis"])


@router.post("/analyze", response_model=CompetitorAnalyzeResponse)
async def analyze_competitor(request: CompetitorAnalyzeRequest):
    """
    Analyze a competitor video (via URL) and extract viral strategies.
    Returns a score, insights, and recommended actions.
    """
    # 1. Extract data via yt-dlp
    extracted_data = extractor.extract_video_data(request.video_url)
    
    # 2. Analyze with Gemini
    return ai.analyze_competitor(
        extracted_data=extracted_data,
        video_url=request.video_url,
        niche=request.competitor_niche,
        platform=request.platform,
        language=request.language,
    )
