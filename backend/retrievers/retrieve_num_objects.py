import weaviate

COLLECTION_NAME = "Events"

try:
    client = weaviate.connect_to_local()
    client.connect()
    collection = client.collections.get(COLLECTION_NAME)
    count = 0
    for item in collection.iterator():
        count += 1
        if count > 100000:
            break
    print("Num objects in vector database:", count)
finally:
    client.close()
