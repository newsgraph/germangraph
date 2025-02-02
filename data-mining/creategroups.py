import pandas as pd
import time

start_time = time.time()


df = pd.read_excel("germ2.xlsx")
data_list = df.iloc[:, 0].tolist()

"print(data_list)"

result = []

for i in range(len(data_list)):
    newlist = []
    newlist.append(data_list[i])
    for j in range(i + 1, len(data_list)):
      if data_list[i] in data_list[j]:
        newlist.append(data_list[j])
        j += 1
    if len(newlist)>1:
       result.append(newlist)

print(result)

with open("my_list.txt", "w") as file:
    for inner_list in result:
        line = " ".join(str(item) for item in inner_list)
        file.write(line + "\n")


end_time = time.time()
runtime = end_time - start_time

print(f"Runtime: {runtime:.4f} seconds for {len(data_list)} words")
