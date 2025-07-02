from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import httpx
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Telegram Configuration
TELEGRAM_BOT_TOKEN = "7983043105:AAGyFmxc3PqDfqlD7lUyPz9iGlAm2O3ANoU"
TELEGRAM_CHAT_ID = "673253772"

# Define Models
class RepairRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    contact: str
    device_brand: str
    device_model: str
    problem_description: str
    estimated_price: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class RepairRequestCreate(BaseModel):
    name: str
    contact: str
    device_brand: str
    device_model: str
    problem_description: str
    estimated_price: Optional[str] = None

class DiagnosticRequest(BaseModel):
    problem_description: str

class DiagnosticResponse(BaseModel):
    category: str
    description: str
    recommendation: str

class PriceEstimate(BaseModel):
    brand: str
    model: str
    problem: str

class PriceEstimateResponse(BaseModel):
    estimated_price: str
    description: str

# Rule-based AI Helper
def diagnose_problem(problem_description: str) -> DiagnosticResponse:
    """Simple rule-based diagnostic system"""
    problem_lower = problem_description.lower()
    
    # Screen issues
    if any(word in problem_lower for word in ['экран', 'дисплей', 'разбит', 'треснул', 'не работает экран', 'черный экран']):
        return DiagnosticResponse(
            category="Проблемы с экраном",
            description="Похоже, проблема связана с дисплеем или сенсором",
            recommendation="Необходима замена экрана или диагностика сенсорного модуля"
        )
    
    # Battery issues
    elif any(word in problem_lower for word in ['батарея', 'аккумулятор', 'быстро разряжается', 'не заряжается', 'зарядка']):
        return DiagnosticResponse(
            category="Проблемы с батареей",
            description="Проблема связана с аккумулятором или зарядкой",
            recommendation="Диагностика системы питания, возможна замена батареи"
        )
    
    # Audio issues
    elif any(word in problem_lower for word in ['звук', 'динамик', 'микрофон', 'не слышно', 'тихо']):
        return DiagnosticResponse(
            category="Проблемы со звуком",
            description="Неисправность аудиосистемы",
            recommendation="Проверка динамиков, микрофона или аудиоконтроллера"
        )
    
    # Water damage
    elif any(word in problem_lower for word in ['вода', 'намочил', 'упал в воду', 'влага']):
        return DiagnosticResponse(
            category="Повреждение жидкостью",
            description="Устройство подверглось воздействию жидкости",
            recommendation="Срочная диагностика и очистка от влаги"
        )
    
    # Software issues
    elif any(word in problem_lower for word in ['программа', 'приложение', 'тормозит', 'зависает', 'не включается']):
        return DiagnosticResponse(
            category="Программные проблемы",
            description="Возможны проблемы с ПО или системой",
            recommendation="Диагностика ПО, возможна переустановка системы"
        )
    
    # Default response
    else:
        return DiagnosticResponse(
            category="Общая диагностика",
            description="Требуется детальная диагностика для точного определения проблемы",
            recommendation="Принесите устройство для профессиональной диагностики"
        )

# Price estimation function
def estimate_repair_price(brand: str, model: str, problem: str) -> PriceEstimateResponse:
    """Simple price estimation based on brand and problem type"""
    base_prices = {
        "Apple": {"экран": 8000, "батарея": 3500, "звук": 2500, "вода": 5000, "программа": 1500},
        "Samsung": {"экран": 6000, "батарея": 2500, "звук": 2000, "вода": 4000, "программа": 1200},
        "Xiaomi": {"экран": 4000, "батарея": 2000, "звук": 1500, "вода": 3000, "программа": 1000},
        "Huawei": {"экран": 5000, "батарея": 2200, "звук": 1800, "вода": 3500, "программа": 1100},
        "Другие": {"экран": 3500, "батарея": 1800, "звук": 1500, "вода": 2500, "программа": 900}
    }
    
    problem_lower = problem.lower()
    problem_type = "программа"  # default
    
    if "экран" in problem_lower or "дисплей" in problem_lower:
        problem_type = "экран"
    elif "батарея" in problem_lower or "аккумулятор" in problem_lower:
        problem_type = "батарея"
    elif "звук" in problem_lower or "динамик" in problem_lower:
        problem_type = "звук"
    elif "вода" in problem_lower:
        problem_type = "вода"
    
    brand_key = brand if brand in base_prices else "Другие"
    price = base_prices[brand_key][problem_type]
    
    return PriceEstimateResponse(
        estimated_price=f"от {price:,} ₽".replace(",", " "),
        description=f"Ориентировочная стоимость ремонта {problem_type} для {brand} {model}"
    )

# Telegram notification function
async def send_telegram_notification(repair_request: RepairRequest):
    """Send notification to Telegram"""
    try:
        message = f"""🔧 Новая заявка FixNet:

👤 Имя: {repair_request.name}
📞 Контакт: {repair_request.contact}
📱 Устройство: {repair_request.device_brand} {repair_request.device_model}
🔍 Проблема: {repair_request.problem_description}
💰 Ориентировочная цена: {repair_request.estimated_price or 'не указана'}

⏰ Время: {repair_request.timestamp.strftime('%d.%m.%Y %H:%M')}
🆔 ID заявки: {repair_request.id}"""

        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        data = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": message
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data)
            if response.status_code != 200:
                logging.error(f"Failed to send telegram message: {response.text}")
    except Exception as e:
        logging.error(f"Error sending telegram notification: {e}")

# API Routes
@api_router.get("/")
async def root():
    return {"message": "FixNet API v1.0"}

@api_router.post("/diagnostic", response_model=DiagnosticResponse)
async def diagnose_device_problem(request: DiagnosticRequest):
    """AI-powered diagnostic assistant"""
    return diagnose_problem(request.problem_description)

@api_router.post("/price-estimate", response_model=PriceEstimateResponse)
async def get_price_estimate(request: PriceEstimate):
    """Get repair price estimate"""
    return estimate_repair_price(request.brand, request.model, request.problem)

@api_router.post("/repair-request", response_model=RepairRequest)
async def create_repair_request(request: RepairRequestCreate):
    """Create new repair request and send to Telegram"""
    repair_request = RepairRequest(**request.dict())
    
    # Save to database
    await db.repair_requests.insert_one(repair_request.dict())
    
    # Send Telegram notification
    asyncio.create_task(send_telegram_notification(repair_request))
    
    return repair_request

@api_router.get("/repair-requests", response_model=List[RepairRequest])
async def get_repair_requests():
    """Get all repair requests"""
    requests = await db.repair_requests.find().to_list(1000)
    return [RepairRequest(**req) for req in requests]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()