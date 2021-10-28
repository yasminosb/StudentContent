import csv
datafile = open('nl_data.csv', 'r')
datareader = csv.reader(datafile, delimiter=',')
data = []
for row in datareader:
    data.append(row)

columns = data[0]

f = open("faculties.csv", "w")


fac_column = 5
set = set()
for i in range(1, len(data)):
        print(data[i][fac_column])
        set.add(data[i][fac_column])
faculties = list(set)
f.write(",".join(faculties))
f.close()
