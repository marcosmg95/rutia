import time
import re
import json
from openai import OpenAI
from pydantic_core import from_json

import requests
import os
from dotenv import load_dotenv
from transformers import AutoTokenizer
from concurrent.futures import ThreadPoolExecutor, as_completed
import random


# Load environment variables
load_dotenv()

HF_TOKEN = os.environ["HF_SALAMANDRA_TOKEN"]
BASE_URL = os.environ["BASE_URL"]
MAX_LOCATIONS = 5

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
    "From the following list of places, choose the MAX_LOCATIONS locations "
    "that match the context the most. And generate a JSON object for them"
)


def extract_json(text):
    json_match = re.search(r'({[\s\S]*})', text)
    if json_match:
        json_str = json_match.group(1)
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            return None
    return None


def generate_response(content):
    client = OpenAI(
       base_url=BASE_URL + "/v1/",
       api_key=HF_TOKEN
    )

    messages = [{"role": "system", "content": system_prompt}]
    messages.append({"role": "user", "content": content})
    chat_completion = client.chat.completions.create(
        model="tgi",
        messages=messages,
        max_tokens=2000,
    )

    response = chat_completion.choices[0].message.content
    return response


def generate_customization(context: str, locations: list) -> str:
    random.shuffle(locations)
    content = f"Context: {context}" + json.dumps(locations, indent=2)
    best_generated_json = {"locations": []}
    num_parallel_requests = 50
    
    with ThreadPoolExecutor(max_workers=num_parallel_requests) as executor:
        futures = [executor.submit(generate_response, content) for _ in range(num_parallel_requests)]
        
        for future in as_completed(futures):
            response = future.result()
            generated_json = extract_json(response)
            
            if generated_json and "locations" in generated_json:
                if len(generated_json["locations"]) == MAX_LOCATIONS:
                    false_location = True
                    for location in generated_json["locations"]:
                        if "title" in location:
                            if location["title"] in [loc["title"] for loc in locations]:
                                false_location = False
                                break
                    if not false_location:
                        best_generated_json = generated_json
                        break
                elif best_generated_json["locations"] != MAX_LOCATIONS:
                    best_generated_json = generated_json

    try:
        for location in best_generated_json.get("locations", []):
            if "title" not in location and isinstance(location, str):
                location = {"title": location}
            elif "title" in location:
                location = {"title": location["title"]}
        
        if len(best_generated_json["locations"]) > MAX_LOCATIONS:
            best_generated_json["locations"] = best_generated_json["locations"][:MAX_LOCATIONS]
            
    except Exception as e:
        best_generated_json = {}

    return best_generated_json
