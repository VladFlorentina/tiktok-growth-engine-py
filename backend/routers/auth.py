"""
Auth router — wraps Supabase Auth for sign-up, login, logout.
"""
from fastapi import APIRouter, HTTPException
from models.schemas import UserCreate, UserLogin, UserResponse
from database import get_supabase

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=UserResponse)
async def signup(data: UserCreate):
    try:
        sb = get_supabase()
        res = sb.auth.sign_up({
            "email": data.email,
            "password": data.password,
            "options": {"data": {"full_name": data.full_name or ""}},
        })
        user = res.user
        if not user:
            raise HTTPException(status_code=400, detail="Sign-up failed. Check your email.")
        return UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.user_metadata.get("full_name"),
            plan="free",
            created_at=user.created_at,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
async def login(data: UserLogin):
    try:
        sb = get_supabase()
        res = sb.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password,
        })
        session = res.session
        user = res.user
        return {
            "access_token": session.access_token,
            "token_type": "bearer",
            "user": UserResponse(
                id=user.id,
                email=user.email,
                full_name=user.user_metadata.get("full_name"),
                plan="free",
                created_at=user.created_at,
            ),
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")


@router.post("/logout")
async def logout():
    try:
        get_supabase().auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
