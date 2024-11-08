import re
import time
import weaviate
import weaviate.classes as wvc
from weaviate.classes.config import Property, DataType
from weaviate.classes.data import GeoCoordinate

from backend.indexers.activities import request_today_activities
from backend.indexers.museums import request_today_museum_events
from backend.indexers.nature import request_today_nature_events
from backend.indexers.tourismus import request_today_tourismus
from backend.indexers.semantics import request_sentence_embeddings


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
        client = weaviate.connect_to_local()

        client.collections.delete(COLLECTION_NAME)

        client.collections.create(
            COLLECTION_NAME,
            properties=[
                Property(name="title", data_type=DataType.TEXT),
                Property(name="description", data_type=DataType.TEXT),
                Property(name="hour_info", data_type=DataType.TEXT),
                Property(name="start_hour", data_type=DataType.TEXT),
                Property(name="start_date", data_type=DataType.TEXT),
                Property(name="end_date", data_type=DataType.TEXT),
                Property(name="location", data_type=DataType.GEO_COORDINATES),
                Property(name="category", data_type=DataType.TEXT),
            ],
            vectorizer_config=wvc.config.Configure.Vectorizer.none()
        )

        test_collection = client.collections.get(COLLECTION_NAME)

        # Index today activities
        activities = request_today_activities()

        def insert_activity(activity, i):
            try:
                sentence_embedding = request_sentence_embeddings(activity.get("descripcio", ""))
                test_collection.data.insert(
                    properties={
                        "title": activity.get("denominaci", ""),
                        "description": activity.get("descripcio", ""),
                        "hour_info": activity.get("horari", ""),
                        "start_hour": extract_start_hour(activity.get("horari", "")),
                        "end_hour": extract_end_hour(activity.get("horari", "")),
                        "start_date": activity.get("data_inici", ""),
                        "end_date": activity.get("data_fi", ""),
                        "location": GeoCoordinate(
                            latitude=float(activity.get("latitud", 0)),
                            longitude=float(activity.get("longitud", 0))
                        ),
                        "category": "activity"
                    },
                    vector=sentence_embedding
                )
            except Exception as e:
                print(f"Error inserting activity {i}: {e}")
            print(f"Activity {i} inserted")

        for i, activity in enumerate(activities):
            insert_activity(activity, i)

        # Index events
        events = {
            "museums": request_today_museum_events(),
            "tourismus": request_today_tourismus(),
            "nature": request_today_nature_events()
        }

        def insert_event(event, category, i):
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

                sentence_embedding = request_sentence_embeddings(event.get("descripcio", ""))
                test_collection.data.insert(
                    properties={
                        "title": event.get("titol", ""),
                        "description": event.get("descripcio", ""),
                        "hour_info": event.get("observacions_horari", ""),
                        "start_hour": extract_start_hour(event.get("observacions_horari", "")),
                        "end_hour": extract_end_hour(event.get("observacions_horari", "")),
                        "start_date": event.get("data_inici", ""),
                        "end_date": event.get("data_fi", ""),
                        "location": GeoCoordinate(latitude=latitude, longitude=longitude),
                        "category": category
                    },
                    vector=sentence_embedding
                )
            except Exception as e:
                print(f"Error inserting event {i} for category '{category}': {e}")
            print(f"Event {i} for category '{category}' inserted")


        for category, event_list in events.items():
            for i, event in enumerate(event_list):
                insert_event(event, category, i)


        print("Time to index all data:", time.time() - start_time)
    finally:
        client.close()


if __name__ == "__main__":
    main()
