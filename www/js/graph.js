module.exports = {
  init: function(red){

    //setup basic lines
    //and loading circle if data is loading otherwise a message


  },
  setPlotSize: function(size){

    svg.selectAll('.dot') 
    .transition()
    .duration(1000)
    .delay(100)
    .attr("r", function(d) {return size})

  },
  loadData: function(raw_data){

    var data = $.parseJSON(raw_data);


    $.each(data,function(ind,obj){
      if ($.inArray(obj, data_sets) == -1) {
        data_sets.push(obj);
      }
    });

    renderData();

  }
}


//keep track of all data being loaded
//
//run through each one and set scale
//
//display the data points


var data_sets = [];


function renderData(){

  console.log(data_sets);

}



// function renderGraphWithDataName(data_name){
//   resize();
//     var dim = Math.min(parseInt(d3.select("#chart").style("width")), parseInt(d3.select("#chart").style("height"))),
//   width = dim - margin.left - margin.right,
//   height = dim - margin.top - margin.bottom;

//   var file_name = data_name.substring(0,data_name.length - 4);
//   console.log(file_name);
//   console.log("data_name: "+data_name);


//   d3.csv("data/"+$lti_id+"/"+$user_id+"/"+data_name, function(error,data){
//     if (error) throw error;

//       data.forEach(function(d){
//         d[$x_axis] = +d[$x_axis];
//         d[$y_axis] = +d[$y_axis];
//         d["set"] = file_name;
//       });

//     console.log(data);

//       var x_max = Math.max(d3.max(data, function(d){return d[$x_axis]}),current_x_axis_max);
//       var y_max = Math.max(d3.max(data, function(d){return d[$y_axis]}),current_y_axis_max);

//       if(x_max > current_x_axis_max){
//         current_x_axis_max = x_max;
//       }
//       if(y_max > current_y_axis_max){
//         current_y_axis_max = y_max;
//       }

//       console.log(x_max);
//       console.log(y_max);

//       x.domain([0, x_max]).nice();
//       y.domain([0, y_max]).nice();


//   svg.selectAll(".axis").remove();


//   svg.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis)
//     .append("text")
//       .attr("class", "label")
//       .attr("x", width/2+40)
//       .attr("y", 40)
//       .style("text-anchor", "end")
//       .text($x_axis_display_text);

//   svg.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//     .append("text")
//       .attr("class", "label")
//       .attr("transform", "rotate(-90)")
//       .attr("y", -50)
//       .attr("x", -height/2+40)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       .text($y_axis_display_text);


//   svg.selectAll("circle."+file_name).remove();
//    // svg.selectAll("circle.dot").remove();


//     svg.selectAll(".dot ."+file_name)
//       .data(data)
//     .enter().append("circle")

//       // .transition()  // Transition from old to new
//       //.duration(1000)  // Length of animation
//       // .each("start", function() {  // Start animation
//       //     d3.select(this)  // 'this' means the current element
//       //          .attr("r",0)
//       //         .attr("fill", "red")  // Change color


//       // })
//       // .delay(function(d, i) {
//       //     return i / data.length * 1000;  // Dynamic delay (i.e. each item delays a little longer)
//       // })
//       // .ease("linear")
//       .attr("class", "dot "+file_name)
//       .attr("data_x",function(d) { return d[$x_axis]; })
//       .attr("data_y",function(d) { return d[$y_axis]; })
//       .attr("r", function(d) {return r(radius)})
//       .attr("cx", function(d) { return x(d[$x_axis]); })
//       .attr("cy", function(d) { return y(d[$y_axis]); })
//       .attr("fill", function(d) { return color(d["set"]);})  // Change color

//       // .each("end", function() {  // End animation
//       //                       d3.select(this)  // 'this' means the current element
//       //                           .transition()
//       //                           .duration(500)
//       //                           .attr("r", function(d) {return r(radius)})
//       //                           .attr("fill", function(d) { return color(d["set"]);})  // Change color

//       //                           //.attr("r", r(radius));  // Change radius
//       //                   })



//   })

// }



// var current_x_axis_max = 0;
// var current_y_axis_max = 0;




// var margin = {top: 40, right: 40, bottom: 55, left: 55},
//     dim = Math.max(parseInt(d3.select("#chart").style("width")), parseInt(d3.select("#chart").style("height"))),
//     width = dim - margin.left - margin.right,
//     height = dim - margin.top - margin.bottom;

// var x = d3.scale.linear()
//     .range([0, width]);

// var y = d3.scale.linear()
//     .range([height, 0]);

// var radius = 0.5;
// var r = d3.scale.linear()
//     .range([radius, radius]);

// var color = d3.scale.category10();

// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom")
//     .ticks(5);

// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient("left")
//         .ticks(5);


// var svg = d3.select("#chart")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// // d3.csv("data/"+$lti_id+"/"+$user_id+"/"+$user_id+".csv", function(error, data) {
// //   if (error) throw error;

// //   //var data = data.filter(function(el){return el.Metric === 'Sales'});

// //   data.forEach(function(d) {
// //     d[$x_axis] = +d[$x_axis];
// //     d[$y_axis] = +d[$y_axis];
// //   });

// //   var x_max = Math.max(d3.max(data, function(d){return d[$x_axis]}),current_x_axis_max);
// //   var y_max = Math.max(d3.max(data, function(d){return d[$y_axis]}),current_y_axis_max);

// //  if(x_max > current_x_axis_max){
// //         current_x_axis_max = x_max;
// //       }
// //       if(y_max > current_y_axis_max){
// //         current_y_axis_max = y_max;
// //       }

// //       console.log("xmax : "+x_max);
// //       console.log("ymax : "+y_max);

// //   x.domain([0, x_max]).nice();
// //   y.domain([0, y_max]).nice();

//   svg.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis)
//     .append("text")
//       .attr("class", "label")
//       .attr("x", width/2+40)
//       .attr("y", 40)
//       .style("text-anchor", "end")
//       .text($x_axis_display_text);

//   svg.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//     .append("text")
//       .attr("class", "label")
//       .attr("transform", "rotate(-90)")
//       .attr("y", -50)
//       .attr("x", -height/2+40)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       .text($y_axis_display_text);

// //   svg.selectAll(".dot")
// //       .data(data)
// //     .enter().append("circle")
// //       .attr("class", "dot")
// //       .attr("r", function(d) {return r(radius)})
// //       .attr("cx", function(d) { return x(d[$x_axis]); })
// //       .attr("cy", function(d) { return y(d[$y_axis]); })
// //       .style("fill", function(d) { return color(1); })
// //        //.on('mouseover', function(d){console.log(d.Category)})
// //       // .on('mouseout', tip.hide);

// // });


// resize();

// setTimeout(resize,1);

// function resize() {

//   var dim = Math.min(parseInt(d3.select("#chart").style("width")), parseInt(d3.select("#chart").style("height"))),
//   width = dim - margin.left - margin.right,
//   height = dim - margin.top - margin.bottom;

//   console.log(dim);

//   $("#graph").css({
//       "width":width+margin.left+margin.right,
//       "height":height+margin.top+margin.bottom
//   });

//   // Update the range of the scale with new width/height
//   x.range([0, width]);
//   y.range([height, 0]);

//   // Update the axis and text with the new scale
//   svg.select('.x.axis')
//     .attr("transform", "translate(0," + height + ")")
//     .call(xAxis);

//   svg.select('.x.axis').select('.label')
//       .attr("x",width/2+40);
//   svg.select('.y.axis').select('.label')
//       .attr("x",-height/2+40);

//   svg.select('.y.axis')
//     .call(yAxis);

//   // Update the tick marks
//   xAxis.ticks(dim / 75);
//   yAxis.ticks(dim / 75);

//   // Update the circles
//   r.range([(dim*radius)/100, (dim*radius)/100])



//   svg.selectAll('.dot')
//     .attr("r", function(d) {return r(radius)})
//     .attr("cx", function(d) { return x(d[$x_axis]); })
//     .attr("cy", function(d) { return y(d[$y_axis]); })
// }

// d3.select(window).on('resize', resize);

