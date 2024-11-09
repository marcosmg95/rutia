from typing import Dict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from backend.indexers import store_data_old
from backend.retrievers.retrieve_data_by_field import retrieve_data_by_field

app = FastAPI()


origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/field")
def get_data(
    latitude: float,
    longitude: float,
    history: int = 0,
    art: int = 0,
    science: int = 0,
):
    field_map = {
        "history": "Història i memòria",
        "art": "Arts visuals",
        "science": "Ciència"
    }

    selected_fields = []

    if history:
        selected_fields.append(field_map["history"])
    if art:
        selected_fields.append(field_map["art"])
    if science:
        selected_fields.append(field_map["science"])
    
    if not selected_fields:
        raise HTTPException(status_code=400, detail="No valid fields provided")

    # Assuming `retrieve_data_by_field` can handle a list of fields
    result = retrieve_data_by_field(selected_fields, latitude, longitude)

    return result


@app.get()


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=9600)
