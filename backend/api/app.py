from typing import Optional
from fastapi import FastAPI
import uvicorn

from backend.indexers import store_data
from backend.retrievers import retrieve_route

app = FastAPI()

@app.get("/get_day/{day}")
def get_data(
    day: str,
    museus: Optional[int] = None,
    arquitectura: Optional[int] = None,
    latitud: Optional[float] = None,
    longitud: Optional[float] = None
):
    return {
        "day": day,
        "museus": museus,
        "arquitectura": arquitectura,
        "latitud": latitud,
        "longitud": longitud
    }

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

@app.post("/items/")
def create_item(item: dict):
    return {"item_name": item["name"], "item_price": item["price"]}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
