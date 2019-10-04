    // BONUS: Build the Gauge Chart
function buildGauge(sample) {
    let gaugeURL = `/metadata/${sample}`;

    d3.json(gaugeURL).then(function(results){
        let WFREQ = results.WFREQ;
    
    let traceGAUGE = [{
        domain: { x: [-1, 1], y: [-1, 1] },
        value: WFREQ,
        title: { text: "Wash Frequency" },
        type: "indicator",
        mode: "gauge+number+delta",
        //   delta: { reference: 380 },
        gauge: {
            axis: { range: [null, 9] },
            steps: [
            { range: [0, 1], color: "lightgray" },
            { range: [1, 2], color: "gray" },
            { range: [2, 3], color: "lightgray" },
            { range: [3, 4], color: "gray" },
            { range: [4, 5], color: "lightgray" },
            { range: [5, 6], color: "gray" },
            { range: [6, 7], color: "lightgray" },
            { range: [7, 8], color: "gray" },
            { range: [8, 9], color: "lightgray" }

            ],
            threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: 6.5
            }
        }
        }
    ];
    
    var layout = { width: 50, height: 50, margin: { t: 0, b: 0 } };
    Plotly.newPlot("gauge", traceGAUGE);
    });
}