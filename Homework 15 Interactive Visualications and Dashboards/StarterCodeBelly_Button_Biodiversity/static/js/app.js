function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
 d3.json(`/metadata/${sample}`).then((holder)=>{
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata").html("");
    // Use `.html("") to clear any existing metadata
    
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(holder).forEach(([key, value])=>{
      panel.append("${key} ${value}");
    })
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
 })

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((holder)=>{
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: holder.otu_ids,
      y: holder.sample_values,
      mode: 'markers',
      text: holder.otu_labels,
      marker:{
        size: holder.sample_values}
    };

    var data = [trace1];

    var layout = {
      title: "'Bubble' Chart",
        };
       
    Plotly.plot("bubble", data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var trace2 = {
      labels: holder.otu_ids.slice(0,10),
      value: holder.sample_values.slice(0,10),
      //mode: 'markers',
      hover: holder.otu_labels.slice(0,10),
      //marker:{
        //size: holder.sample_values}
      type: 'pie'
    };

    var data2 = [trace2];

    var layout = {
      title: "'Pie' Chart",
        };
       
    Plotly.plot("pie", data2, layout);
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
