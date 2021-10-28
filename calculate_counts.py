import csv
import json
# read csv data
datafile = open('nl_data.csv', 'r')
datareader = csv.reader(datafile, delimiter=',')
data = []
for row in datareader:
    data.append(row)

columns = data[0]

# read faculties data
datafile = open('faculties.csv', 'r')
datareader = csv.reader(datafile, delimiter=',')
for row in datareader:
    faculties = row

faculties.append("UGent")

with open("question_counts.json", "w") as f:
    # result data = {"Zelfmoord_gedachten_" : {  "Wetenschappen" :  {1: #aantal, 2: #aantal, ... } ,
    #                                            "Letteren en Wijsbegeerte" : {1: #aantal, 2: #aantal, ... } ,
    #                                           ...
    #                                           }
    #                "andere vraag": []
    #               }

    result_data = {}
    for question in columns:
        result_data[question] = {}
        for fac in faculties:
            result_data[question][fac] = {}

    skip_columns = ["rowid", "", "mwb"]
    fac_column = 5
    for i in range(1, len(data)):
        for j in range(1, len(data[i])):
            if columns[j] not in skip_columns:
                question = columns[j]
                answer = data[i][j]
                # add to UGent count
                fac = "UGent"
                if answer in result_data[question][fac]:
                    result_data[question][fac][answer] += 1
                else:
                    result_data[question][fac][answer] = 1
                # add to faculty count
                fac = data[i][fac_column]
                if answer in result_data[question][fac]:
                    result_data[question][fac][answer] += 1
                else:
                    result_data[question][fac][answer] = 1
    json.dump(result_data, f)
