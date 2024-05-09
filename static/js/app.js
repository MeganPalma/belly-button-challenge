/// THIS CODE WORKS

// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const sampleMetadata = metadata.find((item) => item.id === parseInt(sample));

    // Use d3 to select the panel with id of `#sample-metadata`
    const metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");

    // Loop through each key-value pair from the metadata JSON object
    Object.entries(sampleMetadata).forEach(([key, value]) => {
    // tags for each key-value in the filtered metadata.
    metadataPanel.append("p").text(`${key}: ${value}`);
    });
  }).catch((error) => {
    console.error("Error fetching data:", error);
  });
}

// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const sampleData = samples.find((item) => item.id === sample);

    // Get the otu_ids, otu_labels, and sample_values
    const otuIds = sampleData.otu_ids;
    const otuLabels = sampleData.otu_labels;
    const sampleValues = sampleData.sample_values;

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks


    const barData = [{
      x: sampleValues.slice(0, 10).reverse(),
      y: otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      text: otuLabels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];

    const barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU ID' }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);

    // Build a Bubble Chart
    const bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth'
      }
    }];

    const bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' }
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

  }).catch((error) => {
    console.error("Error fetching data:", error);
  });
}

// Function to run on page load
function init() {
  // Populate dropdown with sample names
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((name) => {
      dropdown.append("option").text(name).property("value", name);
    });
    
    // Get the first sample from the list
    const firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
