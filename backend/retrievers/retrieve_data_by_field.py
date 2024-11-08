import weaviate
from weaviate.classes.data import GeoCoordinate
from weaviate.classes.query import Filter, GeoCoordinate, Sort


def retrieve_data_by_field(field: str, latitude: float, longitude: float):
    COLLECTION_NAME = "Events"

    client = weaviate.connect_to_local()

    test_collection = client.collections.get(COLLECTION_NAME)

    near_activities = test_collection.query.fetch_objects(
        filters=(
            Filter.by_property("field").equal(field) &
            Filter.by_property("location").within_geo_range(
                coordinate=GeoCoordinate(
                    latitude=latitude,
                    longitude=longitude
                ),
                distance=20000  # In meters
            )
        ),
        limit=3
    )

    # for o in near_activities.objects:
    #     print("="*50)
    #     print(f"Field: {o.properties['field']}")
    #     print(f"Title: {o.properties['title']}")
    #     print(f"Location: {o.properties['location']}")

    result = []
    for o in near_activities.objects:
        result.append({
            "field": o.properties['field'],
            "title": o.properties['title'],
            "location": o.properties['location']
        })

    client.close()

    return result

if __name__ == "__main__":
    retrieve_data_by_field("Història i memòria")