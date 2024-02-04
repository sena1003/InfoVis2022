class PieChart {
    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 },
            title: config.title || 'Pie Chart',
            cscale: config.cscale
        };
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.radius = Math.min(self.config.width, self.config.height) / 2;

        self.svg = d3.select(self.config.parent)
            .append('svg')
            .attr('width', self.config.width)
            .attr('height', self.config.height)
            .append('g')
            .attr('transform', `translate(${self.config.width / 2}, ${self.config.height / 2})`);

        self.title = self.svg.append('text')
            .attr('x', 0)
            .attr('y', -self.radius - 20)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .text(self.config.title);
    }

    update() {
        let self = this;

        let pie = d3.pie()
            .value(d => d.value);

        let arcs = pie(self.data);

        let arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(self.radius);

        self.svg.selectAll('path')
            .data(arcs)
            .join('path')
            .attr('d', arcGenerator)
            .attr('fill', d => self.config.cscale(d.data.key))
            .attr('stroke', 'white')
            .style('stroke-width', '2px');

        self.title.text(self.config.title);
    }
}
