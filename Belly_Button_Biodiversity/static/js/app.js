let sampleNumber = ""

function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample
  let metaURL = `/metadata/${sample}`;
  d3.json(metaURL).then(function(results) {
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    d3.select("#sample-metadata").html("");
    d3.select("#sample-metadata").append("ul")
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(results).map(function([key, value]) {
      d3.select("ul").append("li").text(`${key.toUpperCase()}: ${value}`);
      // d3.selectAll("li").style({'list-style':'none', 'font-weight':"bold", 'font-size':'14px', 'padding':'16px 0px 0px 0px'});
          // could not get this to render in a single line per documentation
          // had to run a style line for each attribute I wanted on the "li" elements
      d3.selectAll("li").style("list-style", "none");
      d3.selectAll("li").style("font-weight", "bold");
      d3.selectAll("li").style("font-size", "14px");
      d3.selectAll("li").style("padding", "16px 0px 0px 0px");
      d3.select("ul").style("padding", "0px");
    });
  });
}

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let chartURL = `/samples/${sample}`;

  // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  d3.json(chartURL).then(function(results) {
    // create data slice for PIE
    let plotIDs10 = results.otu_ids.slice(0,10);
    let plotSampleValues10 = results.sample_values.slice(0,10);
    let plotLabels10 = results.otu_labels.slice(0,10);
    // pull data for BUBBLE
    let plotIDs = results.otu_ids;
    let plotSampleValues = results.sample_values;
    let plotLabels = results.otu_labels;

    // set data trace assignments for pie chart
    let tracePIE = [{
      labels: plotIDs10,
      values: plotSampleValues10,
      hovertext: plotLabels10,
      hoverinfo: "label+value+text",
      hovertemplate: "ID: %{label}<br>"+
                 "Count: %{value}<br>"+
                 "OTU: %{text}"+
                 "<extra></extra>",
      name: `Sample #${sample}`,
      type: "pie"
    }];
    // set layout for pie chart
    let layoutPIE = {
      margin: {l: "20px"},
      title: `Highest Microbe Concentrations: Sample #${sample}`,
      hoverlabel: {align: "left"}
    };
    // plot PIE
    Plotly.newPlot("pie", tracePIE, layoutPIE)

    // @TODO: Build a Bubble Chart using the sample data
    // set data trace assignments for bubble chart
    let traceBUBBLE = [{
      x: plotIDs,
      y: plotSampleValues,
      mode: 'markers',
      marker: {
        size: plotSampleValues,
        // sizeref: .9,
        color: plotSampleValues
      },
      hovertemplate: "ID: %{x}<br>"+
                     "Count: %{y}<br>"+
                     "OTU: %{text}"+
                     "<extra></extra>",
      text: plotLabels
    }];
    // set layout for bubble chart
    let layoutBUBBLE = {
      title: `Microbe Count by Operational Taxonomic Unit ID: Sample #${sample}`,
    };
    // plot BUBBLE
    Plotly.newPlot("bubble", traceBUBBLE, layoutBUBBLE);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
