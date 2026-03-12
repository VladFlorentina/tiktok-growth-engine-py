"""
AI Service — powered by Google Gemini (google-generativeai).
Falls back to rich mock data when DEMO_MODE=true or no API key is set.
"""
import json
import re
from datetime import datetime, timezone
from typing import Any

import google.generativeai as genai

from config import get_settings
from models.schemas import (
    HookVariant,
    HookGenerateResponse,
    ScriptScene,
    ScriptGenerateResponse,
    CompetitorInsight,
    CompetitorAnalyzeResponse,
)

settings = get_settings()

if settings.gemini_api_key:
    genai.configure(api_key=settings.gemini_api_key)
    _model = genai.GenerativeModel("gemini-2.5-flash")
else:
    _model = None


def _use_demo() -> bool:
    return settings.demo_mode or _model is None


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _parse_json(text: str) -> Any:
    """Extract JSON from Gemini response which may wrap it in markdown code fences."""
    text = text.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]+?)```", text)
    if match:
        text = match.group(1).strip()
    return json.loads(text)



def generate_hooks(topic: str, niche: str, tone: str, platform: str, count: int, language: str = "en") -> HookGenerateResponse:
    if _use_demo():
        return _mock_hooks(topic, count)

    lang_instruction = "Romanian" if language == "ro" else "English"

    prompt = f"""
You are an expert viral content creator specializing in {platform} content for the {niche} niche.

Generate {count} ultra-high-retention opening hooks for a video about: "{topic}"
Tone: {tone}

VERY IMPORTANT: You must write all your responses (the hooks and the explanations) entirely in {lang_instruction}.

Rules:
- Each hook must stop the scroll in the first 2 seconds
- Maximum 15 words per hook
- Mix different styles: curiosity gap, shocking stat, bold claim, relatable pain, story teaser

Return ONLY valid JSON in this exact format:
{{
  "variants": [
    {{
      "id": 1,
      "hook": "The exact hook text here",
      "style": "curiosity_gap",
      "why_it_works": "Brief explanation of psychological trigger"
    }}
  ]
}}
"""
    response = _model.generate_content(prompt)
    data = _parse_json(response.text)
    return HookGenerateResponse(
        topic=topic,
        variants=[HookVariant(**v) for v in data["variants"]],
        generated_at=_now(),
    )


def _mock_hooks(topic: str, count: int) -> HookGenerateResponse:
    mock_hooks = [
        HookVariant(id=1, hook=f"Nobody talks about this {topic} secret... until now", style="curiosity_gap", why_it_works="Creates mystery and implies exclusive knowledge"),
        HookVariant(id=2, hook=f"I made $0 doing {topic} for 30 days. Here's what happened", style="story_teaser", why_it_works="Real numbers + time frame = credibility and commitment"),
        HookVariant(id=3, hook=f"Stop doing {topic} wrong. Do THIS instead", style="bold_claim", why_it_works="Implies viewer is making a mistake — triggers ego and curiosity"),
        HookVariant(id=4, hook=f"97% of people fail at {topic} because of one mistake", style="shocking_stat", why_it_works="Stats feel authoritative; '97%' implies most people fail"),
        HookVariant(id=5, hook=f"POV: You finally cracked the {topic} code", style="relatable_pov", why_it_works="POV format is native to TikTok; feels personal and aspirational"),
    ]
    return HookGenerateResponse(
        topic=topic,
        variants=mock_hooks[:count],
        generated_at=_now(),
    )



def generate_script(
    topic: str, niche: str, duration_seconds: int,
    platform: str, tone: str, hook: str | None, cta: str, language: str = "en"
) -> ScriptGenerateResponse:
    if _use_demo():
        return _mock_script(topic, duration_seconds, hook, cta)

    hook_instruction = f'Use this specific hook: "{hook}"' if hook else "Generate the best hook for this topic"
    scenes_count = max(2, duration_seconds // 10)
    lang_instruction = "Romanian" if language == "ro" else "English"

    prompt = f"""
You are an expert {platform} content strategist for the {niche} niche.

Create a complete, scene-by-scene video script for: "{topic}"
Duration: {duration_seconds} seconds | Tone: {tone} | CTA: "{cta}"
{hook_instruction}

VERY IMPORTANT: You must write all your responses (title, hook, scenes, cta, tips) entirely in {lang_instruction}. Use natural {lang_instruction} internet slang where appropriate.

Return ONLY valid JSON:
{{
  "title": "Catchy video title",
  "hook": "Opening hook line",
  "scenes": [
    {{
      "scene_number": 1,
      "duration_seconds": 5,
      "visual_description": "What the camera shows",
      "spoken_text": "Exact words to say",
      "on_screen_text": "Optional text overlay"
    }}
  ],
  "cta": "Call to action line",
  "filming_tips": ["tip1", "tip2", "tip3"]
}}
Generate exactly {scenes_count} scenes totalling {duration_seconds} seconds.
"""
    response = _model.generate_content(prompt)
    data = _parse_json(response.text)
    return ScriptGenerateResponse(
        title=data["title"],
        platform=platform,
        total_duration=duration_seconds,
        hook=data["hook"],
        scenes=[ScriptScene(**s) for s in data["scenes"]],
        cta=data["cta"],
        filming_tips=data.get("filming_tips", []),
        generated_at=_now(),
    )


def _mock_script(topic: str, duration: int, hook: str | None, cta: str) -> ScriptGenerateResponse:
    scenes = [
        ScriptScene(scene_number=1, duration_seconds=3, visual_description="Close-up face, direct eye contact to camera", spoken_text=hook or f"No body tells you this about {topic}...", on_screen_text="Watch till end"),
        ScriptScene(scene_number=2, duration_seconds=duration // 3, visual_description="Screen recording or B-roll related to the topic", spoken_text=f"Here's the truth about {topic} that changed everything for me. Most people are doing it completely wrong.", on_screen_text=f"The {topic} method"),
        ScriptScene(scene_number=3, duration_seconds=duration // 3, visual_description="Results or transformation visual", spoken_text="When I switched to this approach, everything changed. The key is to focus on consistency over perfection.", on_screen_text="Key insight"),
        ScriptScene(scene_number=4, duration_seconds=duration - (3 + 2*(duration//3)), visual_description="Back to face, energetic delivery", spoken_text=cta, on_screen_text="Follow for more"),
    ]
    return ScriptGenerateResponse(
        title=f"The {topic} Secret Nobody Talks About",
        platform="tiktok",
        total_duration=duration,
        hook=hook or f"Nobody tells you this about {topic}...",
        scenes=scenes,
        cta=cta,
        filming_tips=["Film in vertical 9:16 format", "Use natural lighting facing a window", "Keep energy high — smile and move!"],
        generated_at=_now(),
    )



def analyze_competitor(extracted_data: dict | None, video_url: str, niche: str, platform: str, language: str = "en") -> CompetitorAnalyzeResponse:
    if _use_demo():
        return _mock_competitor()

    lang_instruction = "Romanian" if language == "ro" else "English"

    prompt = f"""
You are a viral content strategist. Analyze this {platform} video from the {niche} niche:

URL: {video_url}
Metadata extracted about this video:
{json.dumps(extracted_data, indent=2) if extracted_data else "No specific metadata found. Focus on general niche strategy."}

Provide a deep analysis of why it performed well and what creators can steal.

VERY IMPORTANT: You must write all your responses and explanations entirely in {lang_instruction}.

Return ONLY valid JSON:
{{
  "overall_score": 85,
  "hook_analysis": "Analysis of the opening hook",
  "pacing_analysis": "Analysis of the video pacing and structure",
  "cta_analysis": "Analysis of the call to action",
  "insights": [
    {{
      "strength": "What they did well",
      "why_it_worked": "Psychological or algorithmic reason",
      "steal_this": "Exactly how to replicate this"
    }}
  ],
  "recommended_actions": ["Action 1", "Action 2", "Action 3"]
}}
"""
    response = _model.generate_content(prompt)
    data = _parse_json(response.text)
    return CompetitorAnalyzeResponse(
        overall_score=data["overall_score"],
        insights=[CompetitorInsight(**i) for i in data["insights"]],
        hook_analysis=data["hook_analysis"],
        pacing_analysis=data["pacing_analysis"],
        cta_analysis=data["cta_analysis"],
        recommended_actions=data["recommended_actions"],
        generated_at=_now(),
    )


def _mock_competitor() -> CompetitorAnalyzeResponse:
    return CompetitorAnalyzeResponse(
        overall_score=87,
        insights=[
            CompetitorInsight(strength="Pattern interrupt in first 1.5 seconds", why_it_worked="The algorithm rewards watch time; a pattern interrupt prevents scrolling", steal_this="Start every video with an unexpected visual or sound before speaking"),
            CompetitorInsight(strength="Used a trending audio track", why_it_worked="TikTok pushes content using trending sounds to the For You Page", steal_this="Check TikTok Creative Center weekly and use trending sounds even if loosely related"),
            CompetitorInsight(strength="Text overlay matched spoken words", why_it_worked="60% of TikTok users watch without sound; captions increase retention by 40%", steal_this="Always add auto-captions and key phrases as text overlays"),
        ],
        hook_analysis="The hook creates a curiosity gap in under 2 seconds by implying the viewer is missing critical information.",
        pacing_analysis="Quick cuts every 2-3 seconds maintain attention; the video never stays on one shot longer than needed.",
        cta_analysis="Strong CTA placed at 90% mark when retention is still high. Asks for one specific action only.",
        recommended_actions=[
            "Test a pattern-interrupt opening in your next 3 videos",
            "Add captions/text overlays to all content",
            "Use TikTok Creative Center to find trending sounds in your niche",
        ],
        generated_at=_now(),
    )
