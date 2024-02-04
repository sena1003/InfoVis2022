import pandas as pd
from sklearn.manifold import MDS
from sklearn.preprocessing import StandardScaler

# データの読み込み
data = pd.read_csv('redwinequality.csv')

# 説明変数と目的変数の分割
X = data[['fixed_acidity', 'volatile_acidity', 'citric_acid', 'residual_sugar', 'chlorides', 'free_sulfur_dioxide', 'total_sulfur_dioxide', 'density', 'pH', 'sulphates', 'alcohol']]
y = data['quality']

# データの標準化
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# MDSで次元削減
mds = MDS(n_components=2)
X_mds = mds.fit_transform(X_scaled)

# 圧縮したデータをDataFrameに結合
result_df = pd.DataFrame(X_mds, columns=['MDS1', 'MDS2'])
result_df['quality'] = y

# 結果をCSVファイルに書き込み
result_df.to_csv('mds_wine_data.csv', index=False)
