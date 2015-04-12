/*global MultiLevelPieChart */

function drawchart( tree ) {
    var chart = new MultiLevelPieChart();
    chart.tooltip.textFormat = '{label} {value}\n'+
        '{percent}%';
    var rootSector = chart.root;
    chart.root.value = tree.size;
    chart.root.label = tree.name;

    var addSector = function( baseSector, baseTree ){
        for (var i = 0, l = baseTree.children.length; i < l; i ++) {
            var v = baseTree.children[i];
            if( !v.isFile ){
                var sector = chart.createSector({label: v.name, value: v.size });
                var subSector = baseSector.appendChild( sector );
                addSector( subSector, v );
            }
        }
    };

    addSector( rootSector, tree );


    chart.draw('contenedor');
    global.chart = chart;
}



