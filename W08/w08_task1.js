var data = [
      {label:'Apple', value:100},
      {label:'Banana', value:200},
      {label:'Cookie', value:50},
      {label:'Doughnut', value:120},
      {label:'Egg', value:80}
  ];
  d3.csv("https://sena1003.github.io/InfoVis2022/W08/data.csv")
  .then( data => {
      data.forEach( d => { d.label = +d.label; d.value = +d.value; });

      var config = {
          parent: '#drawing_region',
          width: 256,
          height: 128,
          margin: {top:10, right:10, bottom:20, left:60}
      };

      const scatter_plot = new ScatterPlot( config, data );
      scatter_plot.update();
  })
  .catch( error => {
      console.log( error );
  });
  
  class BarChart{

      constructor( config, data ) {
          this.config = {
              parent: config.parent,
              width: config.width || 256,
              height: config.height || 128,
              margin: config.margin || {top:10, right:10, bottom:20, left:60}
          }
          this.data = data;
          this.init();
      }
      init(){
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

            self.yscale = d3.scaleBand()
            .range( [0,self.inner_height] )
            .paddingInner(0.1);

            self.xaxis = d3.axisBottom( self.xscale )
            .ticks(5)
            .tickSizeOuter(0);

            self.xaxis_group = chart.append('g')
            .attr('transform', `translate(0, ${inner_height})`)

            self.yaxis = d3.axisLeft( self.yscale )
            .ticks(5);

            self.yaxis_group = chart.append('g')
            .attr('transform', `translate(0,0)`);

      }
      update() {
            let self = this;
    
            const xmin = 0;
            const xmax = d3.max( self.data, d => d.value );
            self.xscale.domain( [xmin, xmax] );
    
            self.yscale.domain( self.data.map(d => d.label) ).paddingInner(0.1);
    
            self.render();
        }
      render(){
            let self = this;
            self.chart.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", d => self.yscale(d.label))
            .attr("width", d => self.xscale(d.value))
            .attr("height", yscale.bandwidth());
      }
}
 