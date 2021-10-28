import csv
datafile = open('test_corr.csv', 'r')
datareader = csv.reader(datafile, delimiter=';')
data = []
for row in datareader:
    data.append(row)

columns = data[0]

f = open("heatmap_data.csv", "w")

f.write("column_x\tcolumn_y\tcorrelation\trow\tcolumn\n")
for i in range(1, len(data)):
    for j in range(1, i + 1):
        print(data[i][0] + "\t" + columns[j] + "\t" +
              data[i][j] + "\t" + str(i) + "\t" + str(j) + "\n")
        # x , y , value , row , column
        f.write(data[i][0] + "\t" + columns[j] + "\t" +
                data[i][j] + "\t" + str(i) + "\t" + str(j) + "\n")

f.close()
