from sentence_transformers import SentenceTransformer, util



def request_sentence_embeddings(sentence) -> list:
    model = SentenceTransformer(
        "projecte-aina/ST-NLI-ca_paraphrase-multilingual-mpnet-base"
    )

    embeddings = model.encode(sentence).tolist()
    return embeddings

if __name__ == "__main__":
    embeddings = request_sentence_embeddings("This is an example sentence")
    print(embeddings)

