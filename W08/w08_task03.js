var Data = [
    { label: 'Apple', value: 100 },
    { label: 'Banana', value: 200 },
    { label: 'Cookie', value: 50 },
    { label: 'Doughnut', value: 120 },
    { label: 'Egg', value: 80 }
];

var Config = {
    parent: '#drawing_region',
    width: 256,
    height: 256,
    margin: { top: 128, right: 128, bottom: 128, left: 128 }
};

class PieChart {
    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 128, right: 128, bottom: 128, left: 128 }
        };
        this.data = data;
        this.init();
    }

    init() {
        let self = this;
        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.width / 2}, ${self.config.height / 2})`); 

        self.colorScale = d3.scaleOrdinal(d3.schemeCategory10); 
    }

    update() {
        let self = this;

        const pie = d3.pie().value(d => d.value);
        const arcs = pie(self.data);

        self.chart.selectAll("path")
            .data(arcs)
            .join("path")
            .attr("d", d3.arc()
                .innerRadius(0)
                .outerRadius(Math.min(self.config.width, self.config.height) / 2)
            )
            .attr("fill", (d, i) => self.colorScale(i));

        self.chart.selectAll("text")
            .data(arcs)
            .join("text")
            .attr("transform", d => `translate(${d3.arc().innerRadius(0).outerRadius(Math.min(self.config.width, self.config.height) / 2).centroid(d)})`)
            .attr("text-anchor", "middle")
            .text(d => d.data.label);

    }
}

const pie_chart = new PieChart(Config, Data);
pie_chart.update();
