import requests
import os


def request_today_nature_events():
    # Get a hardcoded date or a specific date from an environment variable
    date = os.getenv("DATE", "2024-11-03")
    
    url = f"https://do.diba.cat/api/dataset/actesparcs/camp-data_inici-like/{date}/camp-data_fi-like/{date}"
    nature_events = requests.get(url, timeout=120).json()
    return nature_events["elements"]


if __name__ == "__main__":
    nature_events = request_today_nature_events()

    print("Nature events retrieved")