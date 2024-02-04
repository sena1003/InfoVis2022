d3.csv("sena1003.github.io/InfoVis2022/W12/redwinequality.csv")
    .then( data => {
        data.forEach( d => {
            d.fixed_acidity = +d.fixed_acidity;
            d.volatile_acidity = +d.volatile_acidity;
        });

        const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );
        color_scale.domain(['4','5','6','7']);

        var config = {
            parent: '#drawing_region',
            width: 400,
            height: 300,
            margin: {top:10, right:10, bottom:50, left:50},
            title: 'Iris Flower Data',
            xlabel: 'fixed_acidity [cm]',
            ylabel: 'volatile_acidity [cm]',
            cscale: color_scale
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });
