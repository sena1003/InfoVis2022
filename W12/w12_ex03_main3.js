let input_data;
let scatter_plot;
let bar_chart;
let dimensionalityReduction;
let filter = [];

d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W12/iris.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => {
            d.sepal_length = +d.sepal_length;
            d.sepal_width = +d.sepal_width;
        });

        const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );
        color_scale.domain(['setosa','versicolor','virginica']);

        scatter_plot = new ScatterPlot( {
            parent: '#drawing_region_scatterplot',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Sepal length [cm]',
            ylabel: 'Sepal width [cm]',
            cscale: color_scale
        }, input_data );
        scatter_plot.update();

        bar_chart = new BarChart( {
            parent: '#drawing_region_barchart',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Species',
            cscale: color_scale
        }, input_data );
        bar_chart.update();


    const color_scale_dimensionality = d3.scaleOrdinal(d3.schemeCategory10);

    // DimensionalityReductionのインスタンスを生成
    const dimensionalityReduction = new DimensionalityReduction({
        parent: '#drawing_region_dimensionality',
        width: 400,
        height: 400,
        margin: { top: 20, right: 20, bottom: 40, left: 40 },
        title: 'Dimensionality Reduction of Iris Data',
        xlabel: 'Principal Component 1',
        ylabel: 'Principal Component 2',
        cscale: color_scale_dimensionality
    }, data);

    // 描画を更新
    dimensionalityReduction.update();

    })
    .catch( error => {
        console.log( error );
    });

function Filter() {
    if ( filter.length == 0 ) {
        scatter_plot.data = input_data;
    }
    else {
        scatter_plot.data = input_data.filter( d => filter.includes( d.species ) );
    }
    scatter_plot.update();
}
