from typing import Optional
from fastapi import FastAPI
import uvicorn

from backend.indexers import store_data_old
from backend.retrievers.retrieve_data_by_field import retrieve_data_by_field

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/field/{field}")
def get_data(
    field: str,
    latitude: float,
    longitude: float
):
    # Process the field value as before
    if field == "history":
        field = "Història i memòria"
    elif field == "art":
        field = "Arts visuals"
    elif field == "science":
        field = "Ciència"
    else:
        raise NotImplementedError("Field not implemented")
    
    # You can now use `limit` and `sort` in your logic
    result = retrieve_data_by_field(field, latitude, longitude)

    return result

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

@app.post("/items/")
def create_item(item: dict):
    return {"item_name": item["name"], "item_price": item["price"]}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
