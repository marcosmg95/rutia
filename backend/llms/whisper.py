import requests
from pathlib import Path
import os
from dotenv import load_dotenv


# Load environment variables
load_dotenv()


HF_TOKEN = os.environ["HF_SALAMANDRA_TOKEN"]
BASE_URL = os.environ["BASE_URL"]

API_URL = "https://ddb95svxi9vs16zy.us-east-1.aws.endpoints.huggingface.cloud"
headers = {
   "Accept": "application/json",
   "Authorization": f"Bearer {HF_TOKEN}",
   "Content-Type": "audio/wav",
}


def get_text_from_audio(audio_data):
   response = requests.post(API_URL, headers=headers, data=audio_data)
   return response.json()
