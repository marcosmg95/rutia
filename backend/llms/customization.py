import re
import json
from openai import OpenAI
from pydantic_core import from_json

import requests
import os
from dotenv import load_dotenv
from transformers import AutoTokenizer


# Load environment variables
load_dotenv()


HF_TOKEN = os.environ["HF_SALAMANDRA_TOKEN"]
BASE_URL = os.environ["BASE_URL"]


# Define system prompt
system_prompt = (
    "You are an expert in generating JSON content. "
    "Please generate a JSON object with the following structure:\n"
    "{"
    "  \"context\": \"string\","
    "  \"locations\": ["
    "    {"
    "      \"title\": \"string\""
    "    }, ..."
    "  ]"
    "}"
    "From the following list of places, choose the 3 locations "
    "that match the context the most. And generate a JSON object for them"
)


def extract_json(text):
    """
    Extract JSON object from a text string.
    
    Args:
        text (str): Input text containing JSON
        
    Returns:
        dict: Parsed JSON object
    """
    # Find text between first { and last }
    json_match = re.search(r'({[\s\S]*})', text)
    if json_match:
        json_str = json_match.group(1)
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            return None
    return None


# Define the function to interact with the model API
def generate_response(content):
    client = OpenAI(
       base_url=BASE_URL + "/v1/",
       api_key=HF_TOKEN
    )


    messages = [{"role": "system", "content": system_prompt}]
    messages.append({"role": "user", "content": content})
    stream = False
    chat_completion = client.chat.completions.create(
        model="tgi",
        messages=messages,
        stream=stream,
        max_tokens=2000,
        # temperature=0.1,
        # top_p=0.95,
        # frequency_penalty=0.2,
    )

    response = chat_completion.choices[0].message.content

    return response


def generate_customization(context: str, locations: list) -> str:
    """
    Prepares content with context and locations for generating a structured JSON object.
    
    Args:
        context (str): The context string to include in the JSON.
        locations (list): A list of location dictionaries, each containing details like field, title, and coordinates.
    
    Returns:
        str: The generated JSON content or an error message.
    """
    # Prepare content with provided context and locations
    content = f"Context: {context}"

    content += json.dumps(locations, indent=2)
    
    best_generated_json = {}
    
    for _ in range(25):
        # Generate JSON based on specified structure
        response = generate_response(content)

        # Extract JSON from the generated response
        generated_json = extract_json(response)

        if generated_json is not None and "locations" in generated_json:
            if len(generated_json["locations"]) == 3:
                best_generated_json = generated_json
                break
            else:
                best_generated_json = generated_json
    
    try:
        for location in best_generated_json["locations"]:
            if "title" not in location and isinstance(location, str):
                location = {
                    "title": location
                }
            elif "title" in location:
                location = {
                    "title": location["title"]
                }
        if len(best_generated_json["locations"]) > 3:
            best_generated_json["locations"] = best_generated_json["locations"][:3]
            
    except Exception as e:
        best_generated_json = {}

    return best_generated_json
