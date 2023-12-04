var Data = [
    { x: 0, y: 100 },
    { x: 40, y: 5 },
    { x: 120, y: 80 },
    { x: 150, y: 30 },
    { x: 200, y: 50 }
];

var Config = {
    parent: '#drawing_region',
    width: 256,
    height: 128,
    margin: { top: 10, right: 10, bottom: 20, left: 60 }
};

class LineChart {
    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 128,
            margin: config.margin || { top: 10, right: 10, bottom: 20, left: 60 }
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
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .range([self.inner_height, 0]);

        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(5)
            .tickSizeOuter(0);
            
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(5);
            

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0,0)`);
    }

    update() {
        let self = this;

        const xmin = d3.min(self.data, d => d.x);
        const xmax = d3.max(self.data, d => d.x);
        self.xscale.domain([xmin, xmax]);

        const ymin = d3.min(self.data, d => d.y);
        const ymax = d3.max(self.data, d => d.y);
        self.yscale.domain([ymin, ymax]);

        self.render();
    }

    render() {
        let self = this;

        const line = d3.line()
            .x(d => self.xscale(d.x))
            .y(d => self.yscale(d.y));

        self.chart.selectAll("path")
            .data([self.data])
            .join("path")
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", "black");

        self.chart.selectAll("circle")
            .data(self.data)
            .join("circle")
            .attr("cx", d => self.xscale(d.x))
            .attr("cy", d => self.yscale(d.y))
            .attr("r", 4)  
            .attr("fill", "black");  

        self.xaxis_group.call(self.xaxis);
        self.yaxis_group.call(self.yaxis);
    }
}

const line_chart = new LineChart(Config, Data);
line_chart.update();
