import requests 
import bs4
import re

url = 'https://ev-database.org/#sort:path~type~order=.rank~number~desc|range-slider-range:prev~next=0~1200|range-slider-acceleration:prev~next=2~23|range-slider-topspeed:prev~next=110~450|range-slider-battery:prev~next=10~200|range-slider-eff:prev~next=100~300|range-slider-fastcharge:prev~next=0~1500|paging:currentPage=0|paging:number=all'

response = requests.get(url)

soup = bs4.BeautifulSoup(response.text, 'html.parser')
div = soup.find_all("div", {"class": "data-wrapper"})

f = open("train.json", "a");
f.write("[\n");


for item in div:
	f.write("{\n")
	f.write(" \"battery\" : \"" +  item.find("span", {"class": "battery"}).text + "\", \n ")
	f.write(" \"range\" : \"" + re.search('^[0-9]*', item.find("span", {"class": "erange_real"}).text).group(0) + "\" \n ")
	f.write("},\n")

f.write("]")


