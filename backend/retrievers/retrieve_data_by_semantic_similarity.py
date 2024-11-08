import weaviate
import weaviate.classes as wvc
from weaviate.classes.data import GeoCoordinate
from weaviate.classes.query import Filter, GeoCoordinate
from backend.indexers.semantics import request_sentence_embeddings


def retrieve_data_by_semantic_similarity(sentence: str):
    COLLECTION_NAME = "Events"

    try:
        client = weaviate.connect_to_local()

        test_collection = client.collections.get(COLLECTION_NAME)

        query_vector = request_sentence_embeddings(
            sentence
        )

        near_activities = test_collection.query.near_vector(
            near_vector=query_vector,
            limit=2,
            return_metadata=wvc.query.MetadataQuery(certainty=True),
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
            )
        )

        for o in near_activities.objects:
            print("="*50)
            print(f"Title: {o.properties['title']}")
            print(f"Description: {o.properties['description']}")
            print(f"Hour: {o.properties['hour']}")

        print("Found activities near Barcelona")
    finally:
        client.close()


if __name__ == "__main__":
    retrieve_data_by_semantic_similarity("Flamenc")