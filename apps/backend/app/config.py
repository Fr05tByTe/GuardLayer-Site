from pydantic_settings import BaseSettings, SettingsConfigDict
class Settings(BaseSettings):
    supabase_url: str | None = None
    supabase_service_key: str | None = None
    request_timeout_seconds: float = 8.0
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')
settings = Settings()
