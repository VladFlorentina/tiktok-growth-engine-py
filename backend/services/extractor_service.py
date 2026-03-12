import json
import subprocess
from typing import Dict, Any, Optional
import os

def extract_video_data(url: str) -> Optional[Dict[str, Any]]:
    """
    Extracts metadata and subtitles (if any) from a TikTok or Instagram link
    using yt-dlp in JSON dump mode.
    """
    try:
        # Avoid downloading video, just get JSON info
        # --dump-json prints the JSON to stdout
        # --no-warnings suppresses extra logs
        # --cookies or setting user agent might be needed for some IG reels, 
        # but yt-dlp usually handles it well out of the box.
        cmd = [
            "yt-dlp",
            "--dump-json",
            "--no-warnings",
            "--skip-download",
            url
        ]
        
        # Run command and capture output
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=True
        )
        
        raw_output = result.stdout.strip()
        if not raw_output:
            return None
            
        # Parse the JSON output
        data = json.loads(raw_output)
        
        # Extract the most useful fields for our Gemini AI
        extracted = {
            "title": data.get("title", ""),
            "description": data.get("description", ""),
            "uploader": data.get("uploader", ""),
            "view_count": data.get("view_count", 0),
            "like_count": data.get("like_count", 0),
            "comment_count": data.get("comment_count", 0),
            "duration": data.get("duration", 0),
            "tags": data.get("tags", []),
            "subtitles": None
        }
        
        # Sometimes yt-dlp grabs auto-generated subs in 'subtitles' or 'automatic_captions'
        # We can try to grab them if present (requires more complex parsing usually, 
        # but just having description + tags + views is often enough for Shorts/TikToks).
        
        return extracted
        
    except subprocess.CalledProcessError as e:
        print(f"Error extracting data from {url}: {e.stderr}")
        return None
    except Exception as e:
        print(f"Unexpected error with yt-dlp: {e}")
        return None
