from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config import get_settings
from services.trend_scraper import start_scheduler

from routers import auth, hooks, scripts, trends, competitor, ugc, dashboard

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    yield
    pass

app = FastAPI(
    title="TikTok Growth Engine API",
    description="AI-powered marketing platform for TikTok & Instagram. Powered by Google Gemini.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router,       prefix="/api")
app.include_router(hooks.router,      prefix="/api")
app.include_router(scripts.router,    prefix="/api")
app.include_router(trends.router,     prefix="/api")
app.include_router(competitor.router, prefix="/api")
app.include_router(ugc.router,        prefix="/api")
app.include_router(dashboard.router,  prefix="/api")



@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "ok",
        "app": "TikTok Growth Engine API",
        "version": "1.0.0",
        "demo_mode": settings.demo_mode,
        "docs": "/docs",
    }


@app.get("/api/health", tags=["Health"])
async def health():
    return {"status": "healthy", "demo_mode": settings.demo_mode}
