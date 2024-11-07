import weaviate
from weaviate.classes.data import GeoCoordinate
from weaviate.classes.query import Filter, GeoCoordinate

COLLECTION_NAME = "Events"

try:
    client = weaviate.connect_to_local()

    test_collection = client.collections.get(COLLECTION_NAME)

    near_activities = test_collection.query.fetch_objects(
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
    )

    for o in near_activities.objects:
        print("="*50)
        print(f"Title: {o.properties['title']}")
        print(f"Description: {o.properties['description']}")
        print(f"Hour: {o.properties['hour']}")

    print("Found activities near Barcelona")
finally:
    client.close()
