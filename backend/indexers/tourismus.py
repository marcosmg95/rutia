import os
import requests


def request_today_tourismus():
    # Get a hardcoded date or a specific date from an environment variable
    date = os.getenv("DATE", "2024-11-03")

    url = f"https://do.diba.cat/api/dataset/actesturisme_ca/camp-data_inici-like/{date}/camp-data_fi-like/{date}"
    tourismus_events = requests.get(url, timeout=120).json()
    return tourismus_events["elements"]


if __name__ == "__main__":
    tourismus_events = request_today_tourismus()

    print("Tourismus events retrieved")