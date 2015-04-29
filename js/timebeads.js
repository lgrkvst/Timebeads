// generate some sample data
var data = function() {
	var d = new Date(), i, seed = 24000, arr = [];
	for (i = 0; i < 365; i++) {
		var value = seed+Math.random() * 3000;
		arr.push({date: d, val: value.toFixed(2)});
		d.setDate(d.getDate()+1)
	}
	return arr;
}();

/* We also do a bit of data caching, calculating the minimum and maximum X and Y values we have. You probably wouldn’t want to do this in the wild (especially if your data was coming in dynamically) but for our purposes it’ll make the code a little easier to read.
*/

var minN = d3.min(data, function (d) { return d.date; }).getTime(),
    maxN = d3.max(data, function (d) { return d.date; }).getTime();
var minDate = new Date(minN - 8.64e7),
    maxDate = new Date(maxN + 8.64e7);
var yMin = d3.min(data, function(d) {return d.val; }),
	yMax = d3.max(data, function(d) {return d.val; });
	
/*
The next step is to build the main chart. We start by defining the area in which we’re going to show the chart.
*/ 

var margin = {top: 20, right: 20, bottom: 30, left: 35},
    width = 660 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
	
var plotChart = d3.select('#chart').classed('chart', true).append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var plotArea = plotChart.append('g')
    .attr('clip-path', 'url(#plotAreaClip)');

plotArea.append('clipPath')
    .attr('id', 'plotAreaClip')
    .append('rect')
    .attr({ width: width, height: height });
	
var xScale = d3.time.scale()
    .domain([minDate, maxDate])
    .range([0, width]),
    yScale = d3.scale.linear()
    .domain([yMin, yMax]).nice()
    .range([height, 0]);
	
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(5),
    yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left');
	
plotChart.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

plotChart.append('g')
    .attr('class', 'y axis')
    .call(yAxis);
