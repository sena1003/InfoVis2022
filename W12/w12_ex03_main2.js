let input_data;
let scatter_plot;
let bar_chart;
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

        const pie_chart_config = {
            parent: '#drawing_region_piechart',
            width: 400,
            height: 400,
            margin: { top: 10, right: 10, bottom: 10, left: 10 },
            title: 'Pie Chart',
            cscale: color_scale
        };

        // PieChartクラスのインスタンスを作成
        const pie_chart = new PieChart(pie_chart_config, data);

        // データをkeyとvalueの形に変換
        const pie_data = d3.nest()
            .key(d => d.species)
            .rollup(values => values.length)
            .entries(data);

        // インスタンスをアップデート
        pie_chart.data = pie_data;
        pie_chart.update();
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
