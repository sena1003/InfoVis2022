class LinearPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || '',
            cscale: config.cscale
        }
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
            .tickSize(5)
            .tickPadding(5);
    
        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(5)
            .tickSize(5)
            .tickPadding(5);
    
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);
    
        self.yaxis_group = self.chart.append('g');
    
        const xlabel_space = 40;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('x', self.config.margin.left + self.inner_width / 2)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .attr('text-anchor', 'middle')
            .text('Sepal Length');
    
        const ylabel_space = 45;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -self.config.margin.top - self.inner_height / 2)
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text('Sepal Width');
    }
    
    update() {
        let self = this;
    
        self.xvalue = d => d.sepal_length;
        self.yvalue = d => d.sepal_width;
    
        const xmin = d3.min(self.data, self.xvalue);
        const xmax = d3.max(self.data, self.xvalue);
        self.xscale.domain([xmin, xmax]);
    
        const ymin = d3.min(self.data, self.yvalue);
        const ymax = d3.max(self.data, self.yvalue);
        self.yscale.domain([ymax, ymin]);
    
        self.render();
    }
    
    render() {
        let self = this;
    
        let line = d3.line()
            .x(d => self.xscale(self.xvalue(d)))
            .y(d => self.yscale(self.yvalue(d)));
    
        self.chart.selectAll("path")
            .data([self.data])
            .join('path')
            .attr('d', line)
            .attr('fill', 'none')
            .attr('stroke', self.config.cscale(self.cvalue))
            .attr('stroke-width', 2);
    
        self.xaxis_group.call(self.xaxis);
        self.yaxis_group.call(self.yaxis);
    }
}    