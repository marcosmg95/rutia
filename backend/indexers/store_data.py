import re
import time
import weaviate
import weaviate.classes as wvc
from weaviate.classes.config import Property, DataType
from weaviate.classes.data import GeoCoordinate
from pathlib import Path

from backend.indexers.activities import request_today_activities
from backend.indexers.museums import request_today_museum_events
from backend.indexers.nature import request_today_nature_events
from backend.indexers.tourismus import request_today_tourismus
from backend.indexers.semantics import request_sentence_embeddings
import json


COLLECTION_NAME = "Events"


def extract_start_hour(text):
    start_hours = []
    time_pattern = re.compile(r'\b(\d{1,2}(?:\.\d{2})?)\s?h\b')

    match = time_pattern.search(text)  # Find the first match only
    if match:
        start_hours.append(match.group(1))  # Add the first matched time to the list
    else:
        return None

    return start_hours[0]


def extract_end_hour(text):
    # match = re.search(r"(\d{1,2}\.\d{2})", text)
    # if match:
    #     return match.group(1).replace('.', ':')
    return text


def is_float(element: any) -> bool:
    #If you expect None to be passed:
    if element is None: 
        return False
    try:
        float(element)
        return True
    except ValueError:
        return False


def main():
    try:
        start_time = time.time()
        client = weaviate.connect_to_local(port=9000)

        client.collections.delete(COLLECTION_NAME)

        client.collections.create(
            COLLECTION_NAME,
            properties=[
                Property(name="field", data_type=DataType.TEXT),
                Property(name="title", data_type=DataType.TEXT),
                Property(name="location", data_type=DataType.GEO_COORDINATES),
            ],
            vectorizer_config=wvc.config.Configure.Vectorizer.none()
        )

        test_collection = client.collections.get(COLLECTION_NAME)

        def insert_location(location, i):
            try:
                if location.get("Latitud") == "" or location.get("Longitud") == "":
                    return
                
                test_collection.data.insert(
                    properties={
                        "field": location.get("Ambit", ""),
                        "title": location.get("Nom_Equipament", ""),
                        "location": GeoCoordinate(
                            latitude=float(location.get("Latitud", 0)),
                            longitude=float(location.get("Longitud", 0))
                        )
                    },
                )
            except Exception as e:
                print(f"Error inserting activity {i}: {e}")
            print(f"Activity {i} inserted")

        # Load data/museums_and_culture.json
        with open(
            Path.cwd() / "backend/data/museums_and_culture.json",
            "r",
            encoding="utf-8"
        ) as file:
            museums_and_culture = json.load(file)

        for i, location in enumerate(museums_and_culture):
            insert_location(location, i)

        print("Time to index all data:", time.time() - start_time)
    finally:
        client.close()


if __name__ == "__main__":
    main()
