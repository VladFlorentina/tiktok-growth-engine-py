from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Google AI Studio (Gemini)
    gemini_api_key: str = ""

    # Supabase
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""

    # App
    secret_key: str = "change-me-in-production"
    frontend_url: str = "http://localhost:3000"
    environment: str = "development"

    # Demo mode (no Gemini key required, returns mock data)
    demo_mode: bool = True

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
