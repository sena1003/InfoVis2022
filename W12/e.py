import csv

# 元のCSVファイル名と新しいCSVファイル名
input_file = 'winered.csv'
output_file = 'redwinequality.csv'

# CSVファイルを読み込み、新しい区切り文字で書き出す
with open(input_file, 'r', encoding='utf-8') as infile, open(output_file, 'w', encoding='utf-8', newline='') as outfile:
    # CSVリーダーを作成し、区切り文字を';'から','に変更
    reader = csv.reader(infile, delimiter=';')
    # CSVライターを作成し、区切り文字を','に指定
    writer = csv.writer(outfile, delimiter=',')
    
    # 行ごとに読み込み、新しいファイルに書き込む
    for row in reader:
        writer.writerow(row)

print(f'区切り文字を変更しました。新しいファイル: {output_file}')
