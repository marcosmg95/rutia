import requests
import os


def request_today_activities():
    url = "https://analisi.transparenciacatalunya.cat/resource/rhpv-yr4f.json"

    # Get a hardcoded date or a specific date from an environment variable
    # date = os.getenv("DATE", "2024-11-03")

    # params = {
    #     "$where": f"data_inici >= '{date}' AND data_fi <= '{date}'",
    # }

    # activities = requests.get(url, params=params, timeout=120).json()
    activities = requests.get(url, timeout=120).json()
    return activities
