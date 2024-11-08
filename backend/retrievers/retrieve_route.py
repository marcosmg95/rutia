import re
from datetime import datetime, timedelta
import weaviate
from weaviate.classes.data import GeoCoordinate
from weaviate.classes.query import MetadataQuery, Filter

from backend.indexers.semantics import request_sentence_embeddings

COLLECTION_NAME = "Events"
USER_MESSAGE = "Activitat per a nens"


def generate_non_overlapping_route(events):
    route = []

    valid_events = []
    
    # Regular expression to match valid hour formats
    valid_hour_pattern = re.compile(r"^\d{1,2}(\.\d{1,2})?$")
    
    # Filter out events with incorrect 'Start hour' format
    for event in events:
        if event["start_hour"] and valid_hour_pattern.match(event["start_hour"]):
            valid_events.append(event)

    valid_events = sorted(valid_events, key=lambda e: datetime.strptime(e["start_hour"], "%H.%M" if '.' in e["start_hour"] else "%H"))

    for event in valid_events:
        if not route:
            route.append(event)
        else:
            # Get the last event in the route
            last_event = route[-1]
            # Parse the start hours as datetime objects
            last_event_start = datetime.strptime(last_event["start_hour"], "%H.%M" if '.' in last_event["start_hour"] else "%H")
            current_event_start = datetime.strptime(event["start_hour"], "%H.%M" if '.' in event["start_hour"] else "%H")
            
            # Calculate time difference in hours
            time_difference = (current_event_start - last_event_start).total_seconds() / 3600
            
            # Only add the event if it starts more than 2 hours after the last event in the route
            if time_difference > 2:
                route.append(event)

    return route


try:
    client = weaviate.connect_to_local()

    test_collection = client.collections.get(COLLECTION_NAME)

    near_activities_ranked = test_collection.query.near_vector(
        near_vector=request_sentence_embeddings(USER_MESSAGE),
        filters=(
            Filter
            .by_property("location")
            .within_geo_range(
                coordinate=GeoCoordinate(
                    latitude=41.3874,
                    longitude=2.1686
                ),
                distance=10000  # In meters
            )
        ),
        limit=20,
        return_metadata=MetadataQuery(distance=True),
    )

    # Print found near activities
    for o in near_activities_ranked.objects:
        print("="*50)
        print(f"Title: {o.properties.get('title')}")
        # print(f"Description: {o.properties.get('description')}")
        # print(f"Hour: {o.properties.get('hour_info')}")
        print(f"Start hour: {o.properties.get('start_hour')}")

    events = [o.properties for o in near_activities_ranked.objects]

    route = generate_non_overlapping_route(events)

    for i, event in enumerate(route):
        print(f"Event {i}: {event['title']}, starts at {event['start_hour']}")

    print("Found activities near Barcelona")
finally:
    client.close()
