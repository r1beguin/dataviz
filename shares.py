import requests
import bs4
import re
import pandas

url= 'https://en.wikipedia.org/wiki/Electric_car_use_by_country#Annual_sales'

response = requests.get(url)

soup = bs4.BeautifulSoup(response.text, 'html.parser')
table = soup.find_all("table")
year = table[5].find_all("th", {"data-sort-type": "number"})
results = table[5].find("tr", {"style" : "background:#f0f0ff;font-weight:bold;"})
data= results.find_all("td")

y = []
for item in year:
	y.append(re.search('^[0-9]{4}', item.text).group(0))
d = []
for item in data:
	if (re.search('^[0-9]*.[0-9]*', item.text).group(0) != 'G'):
		d.append(re.search('^[0-9]*.[0-9]*', item.text).group(0))

tab = pandas.DataFrame()
columnYear = pandas.DataFrame(y, columns = ["year"])
columnData = pandas.DataFrame(d, columns = ["value"])
tab = pandas.concat([columnYear, columnData], axis=1)

tab.to_json('./market.json', orient= 'records')
