import requests 
import bs4

url = 'https://ev-database.org/#sort:path~type~order=.rank~number~desc|range-slider-range:prev~next=0~1200|range-slider-acceleration:prev~next=2~23|range-slider-topspeed:prev~next=110~450|range-slider-battery:prev~next=10~200|range-slider-eff:prev~next=100~300|range-slider-fastcharge:prev~next=0~1500|paging:currentPage=0|paging:number=all'

response = requests.get(url)

soup = bs4.BeautifulSoup(response.text, 'html.parser')
div = soup.find_all("div", {"class": "data-wrapper"})

f = open("data.json", "a");
f.write("[\n");


for item in div:
	f.write("{\n")
	f.write(" \"model\" : \"" + item.find("a", {"class": "title"}).text + "\", \n ")
	f.write(" \"range\" : \"" + item.find("span", {"class": "erange_real"}).text + "\", \n ")
	f.write(" \"acceleration\" : \"" + item.find("span", {"class": "acceleration"}).text + "\", \n ")
	f.write("},\n")

f.write("]")


