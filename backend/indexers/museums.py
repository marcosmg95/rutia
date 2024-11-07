import requests
import os


def request_today_museum_events():
    # Get a hardcoded date or a specific date from an environment variable
    date = os.getenv("DATE", "2024-11-03")

    url = f"https://do.diba.cat/api/dataset/actesmuseus/camp-data_inici-like/{date}/camp-data_fi-like/{date}"
    musem_events = requests.get(url, timeout=120).json()
    return musem_events["elements"]


if __name__ == "__main__":
    musem_events = request_today_museum_events()

    print("Museum events retrieved")