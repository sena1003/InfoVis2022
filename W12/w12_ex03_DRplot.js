class DimensionalityReduction {
    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 10, right: 10, bottom: 30, left: 30 },
            title: config.title || '',
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || '',
            cscale: config.cscale
        };
        this.data = data;
        this.reducedData = [];
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        // 2次元までの次元削減（PCAを使用）
        self.reducedData = self.performDimensionalityReduction();

        // スケールの設定
        self.xscale = d3.scaleLinear()
            .domain([d3.min(self.reducedData, d => d[0]), d3.max(self.reducedData, d => d[0])])
            .range([0, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .domain([d3.min(self.reducedData, d => d[1]), d3.max(self.reducedData, d => d[1])])
            .range([self.inner_height, 0]);

        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(5)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(5)
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');

        const title_space = 20;
        self.svg.append('text')
            .style('font-size', '16px')
            .attr('x', self.config.width / 2)
            .attr('y', title_space)
            .attr('text-anchor', 'middle')
            .text(self.config.title);

        const xlabel_space = 30;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('x', self.config.width / 2)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .attr('text-anchor', 'middle')
            .text(self.config.xlabel);

        self.render();
    }

    performDimensionalityReduction() {
        const features = ['sepal_length', 'sepal_width', 'petal_length', 'petal_width'];
    
        // データを特徴量の配列に変換
        const dataArray = this.data.map(d => features.map(feature => d[feature]));
    
        // PCAを使用した次元削減
        const pca = new ML.PCA(dataArray);
    
        // 2次元までのデータを返す
        const reducedData = pca.predict(dataArray, { nComponents: 2 });
    
        return reducedData.map(d => [d[0], d[1]]);
    }
    
    update() {
        // 更新処理が必要な場合に記述
        // たとえば、データが変更された場合に次元削減を再実行して描画を更新するなど
        this.reducedData = this.performDimensionalityReduction();
        this.render();
    }

    render() {
        let self = this;

        // 描画処理が必要な場合に記述
        // 散布図の描画など
        self.chart.selectAll('circle')
            .data(self.reducedData)
            .enter()
            .append('circle')
            .attr('cx', d => self.xscale(d[0]))
            .attr('cy', d => self.yscale(d[1]))
            .attr('r', 5)
            .attr('fill', 'steelblue');

        // 軸の描画
        self.xaxis_group.call(self.xaxis);
        self.yaxis_group.call(self.yaxis);
    }
}
