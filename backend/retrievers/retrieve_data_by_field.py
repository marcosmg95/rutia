import weaviate
from weaviate.classes.data import GeoCoordinate
from weaviate.classes.query import Filter, GeoCoordinate
from datetime import datetime, timezone


def retrieve_data_by_field(fields: list, latitude: float, longitude: float, date: str = None):
    COLLECTION_NAME = "Events"

    client = weaviate.connect_to_local(port=9000)

    test_collection = client.collections.get(COLLECTION_NAME)

    field_filter = None
    for field in fields:
        if field_filter is None:
            field_filter = Filter.by_property("field").equal(field)
        else:
            field_filter |= Filter.by_property("field").equal(field)

    if date:
        # Parse the string into a datetime object
        dt = datetime.strptime(date, '%Y-%m-%d')

        # Convert to RFC 3339 format with UTC (Z)
        formatted = dt.strftime('%Y-%m-%dT%H:%M:%SZ')
        formatted = datetime.strptime(formatted, '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc)
        date_filter = Filter.by_property("date_start").greater_or_equal(
            formatted
        )
        date_filter &= Filter.by_property("date_end").less_or_equal(
            formatted
        )
    else:
        date_filter = None

    # Combine the field filter with the location filter
    near_activities = test_collection.query.fetch_objects(
        filters=(
            field_filter &
            date_filter &
            Filter.by_property("location").within_geo_range(
                coordinate=GeoCoordinate(
                    latitude=latitude,
                    longitude=longitude
                ),
                distance=500000000000000000000000 # In meters
            )
        ),
        limit=10
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
            "location": o.properties['location'],
            "description": o.properties['description'],
            "code": o.properties['code']
        })

    client.close()

    return result

if __name__ == "__main__":
    retrieve_data_by_field("Història i memòria", 41.40252955, 2.188065206)