// csvファイルにlabelとvalueを書いても
// グラフに表示されないので
// データをベタ書きしました
var data = [
      {label:'Apple', value:160},
      {label:'Banana', value:200},
      {label:'Cookie', value:5},
      {label:'Doughnut', value:120},
      {label:'Egg', value:20}
];
const originalData = [...data];

var config = {
          parent: '#drawing_region',
          width: 256,
          height: 128,
          margin: {top:10, right:10, bottom:20, left:60}
};

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

            self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`)

            self.yaxis = d3.axisLeft( self.yscale )
            .ticks(5);

            self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0,0)`);

            d3.select('#reverse')
            .on('click', () => {
                self.data.reverse();
                self.update();
            });

            d3.select('#sortAscending')
            .on('click', () => {
                self.data.sort((a, b) => a.value - b.value);
                self.update();
            });

            d3.select('#sortDescending')
            .on('click', () => {
                self.data.sort((a, b) => b.value - a.value);
                self.update();
            });


            // 最初のデータ順序に戻す
            d3.select('#reset')
            .on('click', () => {
                self.data = [...originalData]; 
                self.update();
            });

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
            self.chart.selectAll("rect").remove();
            self.chart.selectAll("rect")
            .data(self.data)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", d => self.yscale(d.label))
            .attr("width", d => self.xscale(d.value))
            .attr("height", self.yscale.bandwidth());
            self.xaxis_group
            .call( self.xaxis );
            self.yaxis_group
            .call( self.yaxis );

            
      }
}
const bar_chart = new BarChart( config, data );
      bar_chart.update();
 