d3.csv("https://sena1003.github.io/InfoVis2022/W06/data.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:50, right:10, bottom:50, left:50}
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10}
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height, 0] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(6);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(6);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0,0)`);

        self.svg.append('text')
            .attr('x', self.config.width / 2)
            .attr('y', self.config.margin.top / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .text('Scatter Plot');
            
        self.svg.append('text')
            .attr('x', self.config.width / 2)
            .attr('y', self.config.height - self.config.margin.bottom+40)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .text('Xaxis');
            
        self.svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -self.config.height / 2)
            .attr('y', self.config.margin.left / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .text('Yaxis');
    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        self.xscale.domain( [xmin, xmax] );

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        self.yscale.domain( [ymin, ymax] );

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r )
            .on('mouseover', (e, d) => {
                // マウスオーバー時のイベント
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Position</div>(${d.x}, ${d.y})`);
                
            })
            .on('mousemove', (e) => {
                // マウス移動時のイベント
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding)+ 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', () => {
                // マウス離脱時のイベント
                d3.select('#tooltip')
                    .style('opacity', 0);
                
            });

        self.xaxis_group
            .call( self.xaxis );
        self.yaxis_group
            .call( self.yaxis );
    }
}
