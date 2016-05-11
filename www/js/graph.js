/**
 *
 *
 *
 * init (data_sets, pre_load)
 *   Load all files in available files 
 *   get preload list and plot them on the graph
 *
 * load data (data_set)
 *   is called when upload.js completes uploading a new file, data is sent over and is stored in _data_sets for use later
 *
 * add data (data_set)
 *   checks to see if it exists in _data_sets,
 *     if yes
 *       puts it on the graph
 *     no
 *       calls load data with the file name and then calls show data again if successfully loaded
 *
 * remove data (data_set)
 *   checks to see if data is being used
 *    removes it if it is, otherwise ignores
 *
 * add line (data_set)
 *
 * remove line (data_set)
 *
 *
 *
 * 
 */



module.exports = {
  init: function(uploaded, pre_load){
    console.log("Graph init");
    console.log(uploaded);
    add_data_to_cache(uploaded, function(added_data_names){

        add_data_to_graph(pre_load);

    });

  },
  add_data: function(selected__data_set){



  },
  remove_data: function(selected_data_set){



  },
  add_line: function(selected_data_set){



  },
  remove_line: function(selected_data_set){



  },
  show_data: function(selected_data_set){


    add_data_to_graph(selected_data_set);

  },
  hide_data: function(selected_data_set){

    remove_data_from_graph(selected_data_set);

  },
  update: function(selected_data_set){



  }


}


var _dateFormat = d3.time.format("%b %Y");
var _data_base_path = "data/"+$lti_id+"/"+$user_id+"/";
var _current_x_axis_max = 0;
var _current_y_axis_max = 0;
var _current_x_axis_min = 0;
var _current_y_axis_min = 0;

var _cached_data = {};
var _data = [];
var _data_sets_in_use = [];



var margin = {top: 100, right: 100, bottom: 100, left: 100},
    dim = Math.min(parseInt(d3.select("#graph_container").style("width")), parseInt(d3.select("#graph_container").style("height"))),
    outerWidth = dim,
    outerHeight = dim,
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
var num_of_ticks = 10;

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
              .ticks(num_of_ticks)
              .innerTickSize(-width)
              .outerTickSize(0)
              .tickPadding(10);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
              .ticks(num_of_ticks)
              .innerTickSize(-height)
              .outerTickSize(0)
              .tickPadding(10);

var parseDate = d3.time.format("%Y").parse;


if($x_axis_format == "date_year"){
  var x = d3.time.scale().range([0, width]);
 xAxis.scale(x);
 xAxis.tickFormat(d3.time.format("%Y"));
}

if($y_axis_format == "date_year"){
  var y = d3.time.scale().range([0, width]);
  yAxis.scale(y);
  yAxis.tickFormat(d3.time.format("%Y"));
}

console.log(outerWidth);

var svg = d3.select("#graph_container")
            .append("svg")
              .attr("class", "graph_svg")
              .attr("width", outerHeight)
              .attr("height", outerWidth)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


          svg.append("svg")
              .attr("class", "graph")
              .attr("width", width)
              .attr("height", height)
            .append("rect")
              .attr("class", "graph_back")
              .attr("width", width)
              .attr("height", height);

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
            .append("text")
              .attr("class", "label")
              .attr("x", width/2+40)
              .attr("y", 70)
              .style("text-anchor", "end")
              .text($x_axis_display_text);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("class", "label")
              .attr("transform", "rotate(-90)")
              .attr("y", -70)
              .attr("x", -height/2+40)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text($y_axis_display_text);

var graph_svg = d3.select(".graph");


resize();

setInterval(function(){

    xAxis.ticks(dim / 50).innerTickSize(-width)
          .outerTickSize(0)
          .tickPadding(10);

    yAxis.ticks(dim / 50).innerTickSize(-height)
          .outerTickSize(0)
          .tickPadding(10);

},100);



function resize() {

  dim = parseInt(d3.select("#graph_container").style("width")),
    outerWidth = dim,
    outerHeight = dim,
    width = dim - margin.left - margin.right,
    height = dim - margin.top - margin.bottom;
  
  d3.select("#graph_container")
    .attr("width", outerWidth)
    .attr("height", outerHeight)


  d3.select(".graph_svg")
              .attr("width", outerHeight)
              .attr("height", outerWidth)



  // Update the range of the scale with new width/height
  x.range([0, width]);
  y.range([height, 0]);

  // Update the axis and text with the new scale
  svg.select('.x.axis')
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    svg.select('.graph_back')
      .attr("width", width)
      .attr("height", height);

    svg.select('.graph')
      .attr("width", width)
      .attr("height", height);

  svg.select('.x.axis').select('.label')
      .attr("x",width/2+40);
  svg.select('.y.axis').select('.label')
      .attr("x",-height/2+40);

  svg.select('.y.axis')
    .call(yAxis);



  // Update the tick marks
  xAxis.ticks(dim / 50);
  yAxis.ticks(dim / 50);

  // Update the circles
  r.range([(dim*radius)/100, (dim*radius)/100])



    // Update the tick marks
    xAxis.ticks(dim / 50).innerTickSize(-width)
              .outerTickSize(0)
              .tickPadding(10);

    yAxis.ticks(dim / 50).innerTickSize(-height)
              .outerTickSize(0)
              .tickPadding(10);

  svg.selectAll('.dot')
    .attr("r", function(d) {return r(radius)})
    .attr("cx", function(d) { return x(d[$x_axis]); })
    .attr("cy", function(d) { return y(d[$y_axis]); })


    setBoldGridLines(0);

}

function setBoldGridLines(grid_number){

  d3.selectAll('.tick')
    .filter(function(d){ 
        return d==grid_number;
      })
    .select('line')
    .style('stroke-width', 2)
    .style('opacity', 1);

}

d3.select(window).on('resize', resize);

var zoomBeh = d3.behavior.zoom()
                .x(x)
                .y(y)
                .on("zoom", zoom);

svg.call(zoomBeh);

function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("cx", function(d){ return x(d[$x_axis]);})
        .attr("cy", function(d){ return y(d[$y_axis]);})
        .attr("r", function(d) {return r(radius)})


    d3.selectAll('.tick')
      .filter(function(d){ 
        return d==0
      })
      .select('line') //grab the tick line
      .style('stroke-width', 2) //or style directly with attributes or inline styles
      .style('opacity', 1);
}


/**
 * 
 * takes an array of file names to load into memoery to be used by the graph at anypoint.
 *
 * @param {[array]} data_to_add [array of csv file names e.g. hacket_2004.csv]
 * @param {[function]} callback [callback function when add data specefied in data_to_add has been loaded to cache]
 * 
 */
function add_data_to_cache(data_to_add, callback){
  var remaining = data_to_add.length;
  var added_data_names = [];
  $.each(data_to_add, function(ind, filename){
      d3.text(_data_base_path+filename, function(data) {
        data_name = filename.substring(0,filename.length - 4);


        var parsedCSV = d3.csv.parseRows(data);
        var csvString = d3.csv.formatRows(parsedCSV);
        var csvObjs = d3.csv.parse(csvString);

      
        $.each(csvObjs, function(ind, obj){
            obj["data_set"] = data_name;
        });
  

        added_data_names.push(data_name);
        _cached_data[data_name] = csvObjs;

        if(!--remaining){
          callback(added_data_names);
        }
      });
  });
}


/**
 *
 * 
 * 
 * @param {[array]}   data_to_add [description]
 * @param {Function} callback    [description]
 */
function add_data_to_graph(data_to_add, callback){

  data_to_add = convertFilenamesToDatanames(data_to_add);
  _data_sets_in_use = _data_sets_in_use.concat(data_to_add);
  var temp = [];
  $.each(_data_sets_in_use, function(ind, el){
      if($.inArray(el,temp) === -1) temp.push(el);
  });
  _data_sets_in_use = temp;
  temp = [];
  $.each(data_to_add, function(ind, data_name){
    $.each(_cached_data[data_name], function(ind, data_point){
      if($.inArray(data_point, _data) === -1){
        _data.push(data_point);
      }
    })
  });

  var data = _data;
  console.log(data);

  data.forEach(function(d){
    if($x_axis_format == "date_year"){
      d[$x_axis] = parseDate(d[$x_axis]);
    }else{
      d[$x_axis] = +d[$x_axis];
    }
    d[$y_axis] = +d[$y_axis];
  });

  setScales(data);

  var x_max = Math.max(d3.max(data, function(d){return d[$x_axis]}),_current_x_axis_max);
  var y_max = Math.max(d3.max(data, function(d){return d[$y_axis]}),_current_y_axis_max);

  if(x_max > _current_x_axis_max){
    _current_x_axis_max = x_max;
  }
  if(y_max > _current_y_axis_max){
    _current_y_axis_max = y_max;
  }

  var x_min = d3.min(data, function(d){return d[$x_axis] || Infinity;});
  var y_min = d3.min(data, function(d){return d[$y_axis] || Infinity;});

  
  if(x_min < _current_x_axis_min){
    _current_x_axis_min = x_min;
  }
  if(y_max < _current_y_axis_max){
    _current_y_axis_min = y_min;
  }

  console.log(x_min);
  console.log(y_min);

  x.domain([x_min, x_max]).nice();
  y.domain([y_min, y_max]).nice();


  svg.selectAll(".axis").remove();


  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width/2+40)
      .attr("y", 70)
      .style("text-anchor", "end")
      .text($x_axis_display_text);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", -70)
      .attr("x", -height/2+40)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text($y_axis_display_text);

  graph_svg.selectAll(".dot")
    .attr("cx", function(d){ return x(d[$x_axis]);})
    .attr("cy", function(d){ return y(d[$y_axis]);})
    .attr("r", function(d) {return r(radius)})



  $.each(data_to_add, function(ind, name){

    var plot_data = [];

    $.each(data, function(ind, dot){
      if(dot["data_set"] == name){
        plot_data.push(dot);
      }
    })

    var id = 0;
    var ids = function(){
      return name+"_"+id++;
    }


    graph_svg.selectAll("circle."+name).remove();

    graph_svg.selectAll(".dot ."+name)
              .data(plot_data)
              .enter().append("circle")
              .transition()  // Transition from old to new
              .duration(1000)  // Length of animation
              .each("start", function() {  // Start animation
                d3.select(this)  // 'this' means the current element
                .attr("cx", 0)
                .attr("fill", "red")  // Change color
              })
              .delay(function(d, i) {
                return i / data.length * 1000;  // Dynamic delay (i.e. each item delays a little longer)
              })
              .ease("linear")
              .attr("class", "dot "+name)
              .attr("id", ids)
              .attr("data_x",function(d) { return d[$x_axis]; })
              .attr("data_y",function(d) { return d[$y_axis]; })
              .attr("r", function(d) {return r(radius)})
              .attr("cy", function(d) { return y(d[$y_axis]); })
              .attr("fill", function(d) { return color(d["data_set"]);})  // Change color
              .each("end", function() {  // End animation
                d3.select(this)  // 'this' means the current element
                .transition()
                .duration(500)
                .attr("cx", function(d) { return x(d[$x_axis]); })
                .attr("fill", function(d) { return color(d["data_set"]);})  // Change color
              })
  });

  var zoomBeh = d3.behavior.zoom()
                  .x(x)
                  .y(y)
                  .on("zoom", zoom);

  svg.call(zoomBeh);
}


function setScales(data){

  var x_max = Math.max(d3.max(data, function(d){return d[$x_axis]}),_current_x_axis_max);
  var y_max = Math.max(d3.max(data, function(d){return d[$y_axis]}),_current_y_axis_max);

  if(x_max > _current_x_axis_max){
    _current_x_axis_max = x_max;
  }
  if(y_max > _current_y_axis_max){
    _current_y_axis_max = y_max;
  }

  var x_min = Math.min(d3.min(data, function(d){return d[$x_axis] || Infinity;}),_current_x_axis_min);
  var y_min = Math.min(d3.min(data, function(d){return d[$y_axis] || Infinity;}),_current_y_axis_min);

  if(x_min < _current_x_axis_min){
    _current_x_axis_min = x_min;
  }
  if(y_max > _current_y_axis_max){
    _current_y_axis_min = y_min;
  }

}



function remove_data_from_cache(){

  // doesn't need to be implimented as current use case does not need removal of files

}

function remove_data_from_graph(data_to_remove){

  data_to_remove = convertFilenamesToDatanames(data_to_remove);

  $.each(data_to_remove, function(ind, name){
    d3.select(".graph").selectAll("circle."+name)
    .transition()  // Transition from old to new
    .duration(1000)  // Length of animation
    .delay(function(d, i) {
      return i / d3.select(".graph").selectAll("circle."+name)[0].length * 1000;  // Dynamic delay (i.e. each item delays a little longer)
    })
    .ease("linear")
    .each("end", function() {  // End animation
      d3.select(this)  // 'this' means the current element
      .remove();
    })
  });

}


/*
 
 HELPER FUNCTIONS

 */

function convertFilenamesToDatanames(filenames){
  var datanames = [];
  $.each(filenames, function(ind, filename){
    if(filename.indexOf(".csv") >= 0){
      datanames.push(filename.substring(0,filename.length - 4))
    }else{
      datanames.push(filename);
    }
    
  });
  return datanames;
}