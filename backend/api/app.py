from typing import Dict, Any
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pathlib import Path

from backend.retrievers.retrieve_data_by_field import retrieve_data_by_field
from backend.llms.customization import generate_customization
from backend.llms.whisper import get_text_from_audio

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
    events: int = 0,
    date: str = None,
):
    field_map = {
        "history": "Història i memòria",
        "art": "Arts visuals",
        "science": "Ciència",
        "events": "Events",
    }

    selected_fields = []

    if history:
        selected_fields.append(field_map["history"])
    if art:
        selected_fields.append(field_map["art"])
    if science:
        selected_fields.append(field_map["science"])
    if events:
        selected_fields.append(field_map["events"])
    
    if not selected_fields:
        raise HTTPException(status_code=400, detail="No valid fields provided")

    # Assuming `retrieve_data_by_field` can handle a list of fields
    result = retrieve_data_by_field(
        selected_fields,
        latitude,
        longitude,
        date
    )

    return result


@app.post("/customization")
def customization(data: Dict[str, Any]):
    # Validate that `data` contains the `context` and `locations` keys
    if "context" not in data or "locations" not in data:
        raise HTTPException(status_code=400, detail="Request body must include 'context' and 'locations' keys.")
    
    context = data["context"]
    locations = data["locations"]

    # Further validation on `locations`
    if not isinstance(locations, list):
        raise HTTPException(status_code=400, detail="'locations' must be a list of location data.")

    # Process the data, possibly passing it to another function
    result = generate_customization(context, locations)
    return result


@app.post("/upload_audio")
async def upload_audio(file: UploadFile = File(...)):
    text = get_text_from_audio(file.file.read())
    return {"text": text}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=9600)
