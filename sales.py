import requests 
import bs4
import re
import pandas as pd

url = 'https://en.wikipedia.org/wiki/Electric_car_use_by_country#Annual_sales'

response = requests.get(url)

soup = bs4.BeautifulSoup(response.text, 'html.parser')
table = soup.find_all("tbody")
year = table[5].find_all("th", {"data-sort-type": "number"})
results = table[5].find("tr", {"style": "background:#f0f0ff;font-weight:bold;"})
data = results.find_all("td")

f = open("sales.json", "a");


y = []
d= []
for item in year:
	y.append(re.search('^[0-9]{4}',item.text).group(0))
for item in data:
	if (re.search('^[0-9]*.[0-9]*', item.text).group(0) != 'G'):
		d.append(re.search('^[0-9]*.[0-9]*', item.text).group(0))


tab = pd.DataFrame()
columsYear = pd.DataFrame(y, columns = ["year"])
columsData = pd.DataFrame(d, columns = ["shares"])
tab = pd.concat([columsYear, columsData], axis=1)
print (tab)
tab.to_json('./sales.json', orient='records')



