import requests
from bs4 import BeautifulSoup

url = "https://flagpedia.net/index"
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")

lines = []
elements = soup.find_all("li")
for element in elements:
    ctry = element.get_text(strip=True)
    img_tag = element.find("img")
    flag_url = None
    if img_tag and 'src' in img_tag.attrs:
        s = f"https://flagpedia.net/{img_tag['src']}"
        flag_url = s.replace("h80", "w580")
    if flag_url:
        lines.append(f"{flag_url},{ctry.lower()}")

with open("flaglinks.txt", "w") as f:
    for line in lines:
        f.write(line + "\n")



