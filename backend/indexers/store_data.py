import re
import time
from datetime import datetime
import weaviate
import weaviate.classes as wvc
from weaviate.classes.config import Property, DataType
from weaviate.classes.data import GeoCoordinate
from pathlib import Path
from bs4 import BeautifulSoup

from backend.indexers.activities import request_today_activities
from backend.indexers.nature import request_today_nature_events
from backend.indexers.tourismus import request_today_tourismus
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


def parse_date(date: str):
    # Parse the string into a datetime object
    dt = datetime.fromisoformat(date)

    # Convert to RFC 3339 format with UTC (Z)
    formatted = dt.strftime('%Y-%m-%dT%H:%M:%SZ')
    return formatted


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
                Property(name="description", data_type=DataType.TEXT),
                Property(name="date_start", data_type=DataType.DATE),
                Property(name="date_end", data_type=DataType.DATE),
                Property(name="location", data_type=DataType.GEO_COORDINATES),
                Property(name="code", data_type=DataType.INT),
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
                        "description": location.get("Descripcio", ""),
                        "location": GeoCoordinate(
                            latitude=float(location.get("Latitud", 0)),
                            longitude=float(location.get("Longitud", 0))
                        ),
                        "code": i,
                        "date_start": parse_date("1337-11-03"),
                        "date_end": parse_date("1337-11-03"),
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


        def insert_diputation(location, i):
            try:
                if location.get("Latitud") == "" or location.get("Longitud") == "":
                    return
                
                test_collection.data.insert(
                    properties={
                        "field": "Història i memòria",
                        "title": location.get("titol", ""),
                        "description": location.get("descripcio", ""),
                        "location": GeoCoordinate(
                            latitude=float(location.get("latitud", 0)),
                            longitude=float(location.get("longitud", 0))
                        ),
                        "code": i,
                        "date_start": parse_date("1337-11-03"),
                        "date_end": parse_date("1337-11-03")
                    },
                )
            except Exception as e:
                print(f"Error inserting activity {i}: {e}")
            print(f"Activity {i} inserted")

        # Load data/museums_and_culture.json
        with open(
            Path.cwd() / "backend/data/patrimoni_diputacio.json",
            "r",
            encoding="utf-8"
        ) as file:
            patrimoni_diputacio = json.load(file)

        for i, location in enumerate(patrimoni_diputacio):
            insert_diputation(location, i)


        def insert_event(event, i):
            try:
                if event.get("Latitud") == "" or event.get("Longitud") == "":
                    return
                
                if event.get("data_inici") == "" or event.get("data_fi") == "":
                    return
                else:
                    start_date = parse_date(event.get("data_inici"))
                    end_date = parse_date(event.get("data_fi"))
                
                test_collection.data.insert(
                    properties={
                        "field": "Events",
                        "title": event.get("denominaci", ""),
                        "description": event.get("descripcio", ""),
                        "location": GeoCoordinate(
                            latitude=float(event.get("latitud", 0)),
                            longitude=float(event.get("longitud", 0))
                        ),
                        "date_start": start_date,
                        "date_end": end_date,
                        "code": i
                    },
                )
            except Exception as e:
                print(f"Error inserting activity {i}: {e}")

            print(f"Activity {i} inserted")

        # Load events
        events = request_today_activities()
        
        for i, event in enumerate(events):
            insert_event(event, i)

        
        def insert_touristic_event(event, i):
            try:
                localization = event.get("grup_adreca", {}).get("localitzacio", "").split(",")
                if (
                    len(localization) > 1 and
                    is_float(localization[0]) and
                    is_float(localization[1])
                ):
                    latitude = float(localization[0]) 
                    longitude = float(localization[1])
                else:
                    latitude = 0
                    longitude = 0
                    
                if event.get("Latitud") == "" or event.get("Longitud") == "":
                    return
                
                if event.get("data_inici") == "" or event.get("data_fi") == "":
                    return
                else:
                    start_date = parse_date(event.get("data_inici"))
                    end_date = parse_date(event.get("data_fi"))
                
                description = event.get("descripcio", "")
                soup = BeautifulSoup(description, "html.parser")
                description = soup.get_text()
                            
                test_collection.data.insert(
                    properties={
                        "field": "Events",
                        "title": event.get("titol", ""),
                        "description": event.get("descripcio", ""),
                        "location": GeoCoordinate(
                            latitude=latitude,
                            longitude=longitude
                        ),
                        "date_start": start_date,
                        "date_end": end_date,
                        "code": i
                    },
                )
            except Exception as e:
                print(f"Error inserting activity {i}: {e}")

            print(f"Activity {i} inserted")

        tourismus = request_today_tourismus()

        for i, event in enumerate(tourismus):
            insert_touristic_event(event, i)

        def insert_nature_event(event, i):
            try:
                localization = event.get("grup_adreca", {}).get("localitzacio", "").split(",")
                if (
                    len(localization) > 1 and
                    is_float(localization[0]) and
                    is_float(localization[1])
                ):
                    latitude = float(localization[0]) 
                    longitude = float(localization[1])
                else:
                    latitude = 0
                    longitude = 0
                    
                if event.get("Latitud") == "" or event.get("Longitud") == "":
                    return
                
                if event.get("data_inici") == "" or event.get("data_fi") == "":
                    return
                else:
                    start_date = parse_date(event.get("data_inici"))
                    end_date = parse_date(event.get("data_fi"))
                
                description = event.get("descripcio", "")
                soup = BeautifulSoup(description, "html.parser")
                description = soup.get_text()
                
                test_collection.data.insert(
                    properties={
                        "field": "Events",
                        "title": event.get("titol", ""),
                        "description": description,
                        "location": GeoCoordinate(
                            latitude=latitude,
                            longitude=longitude
                        ),
                        "date_start": start_date,
                        "date_end": end_date,
                        "code": i
                    },
                )
            except Exception as e:
                print(f"Error inserting activity {i}: {e}")

            print(f"Activity {i} inserted")

        nature_events = request_today_nature_events()

        for i, event in enumerate(nature_events):
            insert_nature_event(event, i)

        print("Time to index all data:", time.time() - start_time)
    finally:
        client.close()


if __name__ == "__main__":
    main()
