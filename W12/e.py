import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# 圧縮したデータを読み込む
compressed_data = pd.read_csv('compressed_wine_data.csv')

# 散布図をプロット
plt.figure(figsize=(10, 8))
sns.scatterplot(x='PC1', y='PC2', hue='quality', data=compressed_data, palette='viridis', s=60)

# 軸ラベルとタイトルを追加
plt.xlabel('Principal Component 1')
plt.ylabel('Principal Component 2')
plt.title('Wine Quality - PCA Scatter Plot')

# 色の説明を追加
plt.legend(title='Quality', loc='upper right')

# グリッドを表示
plt.grid(True)

# プロットを表示
plt.show()
