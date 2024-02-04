class CorrelationMatrix {
    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 400,
            height: config.height || 400,
            margin: config.margin || { top: 50, right: 10, bottom: 10, left: 10 },
            title: config.title || 'Correlation Matrix',
        };
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .append('svg')
            .attr('width', self.config.width)
            .attr('height', self.config.height)
            .append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);
    
        self.title = self.svg.append('text')
            .attr('x', (self.config.width - self.config.margin.left - self.config.margin.right) / 2)
            .attr('y', -self.config.margin.top)
            .attr('text-anchor', 'middle')
            .style('font-size', '8px')
            .text(self.config.title);
    }

    update() {
        let self = this;

        const selectedVariables = ['fixed_acidity','volatile_acidity','citric_acid','residual_sugar'];
        const selectedData = self.data.map(d => {
            const entry = { quality: d.quality };
            selectedVariables.forEach(variable => {
                entry[variable] = +d[variable];
            });
            return entry;
        });

        const correlationMatrix = self.calculateCorrelationMatrix(selectedData);

        const correlations = Array.from(correlationMatrix, ([key, value]) => {
            return {
                quality: key,
                correlations: Array.from(value, ([variable, correlation]) => ({
                    variable: variable,
                    correlation: correlation ? correlation : 0
                }))
            };
        });

        self.drawCorrelationMatrix(correlations);
    }

    calculateCorrelationMatrix(data) {
        let self = this;
        const selectedVariables = ['fixed_acidity','volatile_acidity','citric_acid','residual_sugar'];
        const correlationMatrix = new Map();
        for (const variable1 of selectedVariables) {
            const correlations = new Map();
            for (const variable2 of selectedVariables) {
                const corr = self.calculateCorrelation(data, variable1, variable2);
                correlations.set(variable2, corr);
            }
            correlationMatrix.set(variable1, correlations);
        }
        return correlationMatrix;
    }

    calculateCorrelation(data, variable1, variable2) {
        const values1 = data.map(d => d[variable1]);
        const values2 = data.map(d => d[variable2]);

        const mean1 = d3.mean(values1);
        const mean2 = d3.mean(values2);

        const numerator = d3.sum(values1.map((d, i) => (d - mean1) * (values2[i] - mean2)));
        const denominator1 = Math.sqrt(d3.sum(values1.map(d => (d - mean1) ** 2)));
        const denominator2 = Math.sqrt(d3.sum(values2.map(d => (d - mean2) ** 2)));

        return numerator / (denominator1 * denominator2);
    }

    drawCorrelationMatrix(correlations) {
        let self = this;

        const gridSize = 30;
        const colors = d3.scaleLinear()
            .domain([-1, 0, 1])
            .range(['#d73027', '#fee08b', '#4575b4']);

        const qualityLabels = correlations.map(d => d.quality);
        const variableLabels = correlations[0].correlations.map(d => d.variable);

        const colorScale = d3.scaleSequential(colors).domain([-1, 1]);

        const heatmap = self.svg.selectAll(".heatmap")
            .data(correlations)
            .enter().append("g")
            .attr("class", "heatmap")
            .attr("transform", (d, i) => `translate(0,${i * gridSize})`);

        const rect = heatmap.selectAll("rect")
            .data(d => d.correlations)
            .enter().append("rect")
            .attr("x", (d, i) => i * gridSize)
            .attr("y", 0)
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", d => colorScale(d.correlation))
            .on('mouseover', function (event, d) {
                const tooltipText = `Correlation: ${d.correlation.toFixed(2)}`;
                d3.select(this).style('stroke', 'black').style('stroke-width', 2);
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                tooltip.html(tooltipText)
                    .style('left', (event.pageX + 5) + 'px')
                    .style('top', (event.pageY -18) + 'px');
            })
            .on('mouseout', function () {
                d3.select(this).style('stroke', 'none');
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        const qualityLabel = self.svg.selectAll(".qualityLabel")
            .data(qualityLabels)
            .enter().append("text")
            .text(d => d)
            .attr("x", 0)
            .attr("y", (d, i) => i * gridSize)
            .style("text-anchor", "end")
            .attr("transform", `translate(-6,${gridSize / 1.5})`)
            .style("font-size", "8px");

        const variableLabel = self.svg.selectAll(".variableLabel")
            .data(variableLabels)
            .enter().append("text")
            .text(d => d)
            .attr("x", (d, i) => i * gridSize)
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", `translate(${gridSize / 2}, -6) `)
            .style("font-size", "4px");
        
    }
}


