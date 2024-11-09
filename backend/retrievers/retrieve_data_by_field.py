import weaviate
from weaviate.classes.data import GeoCoordinate
from weaviate.classes.query import Filter, GeoCoordinate
from datetime import datetime, timezone


def retrieve_data_by_field(fields: list, latitude: float = None, longitude: float = None, date: str = None):
    COLLECTION_NAME = "Events"

    client = weaviate.connect_to_local(port=9000)

    test_collection = client.collections.get(COLLECTION_NAME)

    field_filter = None
    for field in fields:
        if field_filter is None:
            field_filter = Filter.by_property("field").equal(field)
        else:
            field_filter |= Filter.by_property("field").equal(field)

    if date and date != "":
        date_filter = True
        # Parse the string into a datetime object
        dt = datetime.strptime(date, '%Y-%m-%d')

        # Convert to RFC 3339 format with UTC (Z)
        formatted = dt.strftime('%Y-%m-%dT%H:%M:%SZ')
        formatted = datetime.strptime(formatted, '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc)
        date_start_filter = Filter.by_property("date_start").equal(
            formatted
        )
        # date_end_filter = Filter.by_property("date_end").less_or_equal(
        #     formatted
        # )

        #  # Parse the string into a datetime object
        dt = datetime.strptime("1337-11-03", '%Y-%m-%d')

        # Convert to RFC 3339 format with UTC (Z)
        formatted = dt.strftime('%Y-%m-%dT%H:%M:%SZ')
        formatted = datetime.strptime(formatted, '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc)
        date_start_filter |= Filter.by_property("date_start").equal(formatted)
    else:
        date_filter = None

    if latitude and longitude:
        # Combine the field filter with the location filter
        geo_filter = Filter.by_property("location").within_geo_range(
            coordinate=GeoCoordinate(
                latitude=latitude,
                longitude=longitude
            ),
            distance=5000  # In meters
        )
    else:
        geo_filter = None


    if field_filter and date_filter and geo_filter:
        filters = field_filter & date_start_filter & geo_filter
    elif field_filter and date_filter:
        filters = field_filter & date_start_filter
    elif field_filter and geo_filter:
        filters = field_filter & geo_filter
    elif date_filter and geo_filter:
        filters = date_start_filter & geo_filter
    elif field_filter:
        filters = field_filter
    elif date_filter:
        filters = date_start_filter
    elif geo_filter:
        filters = geo_filter
    else:
        filters = None

    # Combine the field filter with the location filter
    near_activities = test_collection.query.fetch_objects(
        filters=filters,
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
            "code": o.properties['code'],
            "start_date": o.properties['date_start'],
            "end_date": o.properties['date_end'],
        })

    client.close()

    return result


if __name__ == "__main__":
    retrieve_data_by_field("Història i memòria", 41.40252955, 2.188065206)