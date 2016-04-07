var margin = {top: 40, right: 40, bottom: 55, left: 55},
    dim = Math.min(parseInt(d3.select("#chart").style("width")), parseInt(d3.select("#chart").style("height"))),
    width = dim - margin.left - margin.right,
    height = dim - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var radius = 0.5;
var r = d3.scale.linear()
    .range([radius, radius]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


module.exports = {
  init: function(red){

      loadGraph(red);


  },
  setPlotSize: function(size){

    svg.selectAll('.dot') 
    .transition()
    .duration(1000)
    .delay(100)
    .attr("r", function(d) {return size})

  }
}


function loadGraph(red){



  console.log(red+" Loading!!! "+radius);

}

d3.csv("data/"+$lti_id+"/"+$user_id+"/"+"Sun_Yang.csv", function(error, data) {
  if (error) throw error;

  //var data = data.filter(function(el){return el.Metric === 'Sales'});

  data.forEach(function(d) {
    d.Time = +d.Time;
    d.Distance = +d.Distance;
  });

  x.domain([0, d3.max(data, function(d){return d.Time})]).nice();
  y.domain([0, d3.max(data, function(d){return d.Distance})]).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width/2+40)
      .attr("y", 40)
      .style("text-anchor", "end")
      .text($x_axis_name);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", -height/2+40)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text($y_axis_name);

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d) {return r(radius)})
      .attr("cx", function(d) { return x(d.Time); })
      .attr("cy", function(d) { return y(d.Distance); })
      .style("fill", function(d) { return color(1); })
       //.on('mouseover', function(d){console.log(d.Category)})
      // .on('mouseout', tip.hide);

});


resize();

setTimeout(resize,1);

function resize() {

  var dim = Math.min(parseInt(d3.select("#chart").style("width")), parseInt(d3.select("#chart").style("height"))),
  width = dim - margin.left - margin.right,
  height = dim - margin.top - margin.bottom;

  console.log(dim);

  $("#graph").css({
      "width":width+margin.left+margin.right,
      "height":height+margin.top+margin.bottom
  });

  // Update the range of the scale with new width/height
  x.range([0, width]);
  y.range([height, 0]);

  // Update the axis and text with the new scale
  svg.select('.x.axis')
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.select('.x.axis').select('.label')
      .attr("x",width/2+40);
  svg.select('.y.axis').select('.label')
      .attr("x",-height/2+40);

  svg.select('.y.axis')
    .call(yAxis);

  // Update the tick marks
  xAxis.ticks(dim / 75);
  yAxis.ticks(dim / 75);

  // Update the circles
  r.range([(dim*radius)/100, (dim*radius)/100])

  svg.selectAll('.dot')
    .attr("r", function(d) {return r(radius)})
    .attr("cx", function(d) { return x(d.Time); })
    .attr("cy", function(d) { return y(d.Distance); })
}

d3.select(window).on('resize', resize);

