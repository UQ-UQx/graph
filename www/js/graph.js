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

    console.log("init called", uploaded, pre_load);
    add_data_to_cache(uploaded, function(added_data_names){

        add_data_to_graph(pre_load);

    });

  },
  add_data: function(selected_data_set){

    add_data_to_cache(selected_data_set);

  },
  remove_data: function(selected_data_set){



  },
  add_line: function(selected_data_set){

    add_trendline_for_data(selected_data_set);

  },
  remove_line: function(selected_data_set){

    remove_trendline_for_data(selected_data_set);


  },
  show_data: function(selected_data_set){

   
    add_data_to_graph(selected_data_set);
    
  },
  hide_data: function(selected_data_set){

    remove_data_from_graph(selected_data_set);
  },
  update: function(selected_data_set){



  },
  get_data: function(data_name){
    //console.log("REDDDD");
    return _cached_data[data_name];

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

//console.log(outerWidth);

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
              .attr("height", height)
              .on("mousemove", mousemove)

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

    xAxis.ticks(dim / 80).innerTickSize(-width)
          .outerTickSize(0)
          .tickPadding(10);

    yAxis.ticks(dim / 80).innerTickSize(-height)
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



  // // Update the tick marks
  // xAxis.ticks(dim / 10);
  // yAxis.ticks(dim / 10);

  // Update the circles
  r.range([(dim*radius)/100, (dim*radius)/100])



    // Update the tick marks
    xAxis.ticks(dim / 10).innerTickSize(-width)
              .outerTickSize(0)
              .tickPadding(10);

    yAxis.ticks(dim / 10).innerTickSize(-height)
              .outerTickSize(0)
              .tickPadding(10);

  svg.selectAll('.dot')
    .attr("r", function(d) {return r(radius)})
    .attr("cx", function(d) { return x(d[$x_axis]); })
    .attr("cy", function(d) { return y(d[$y_axis]); })


    setBoldGridLines(0);

  refresh_legend();

}

  var bisectDate = d3.bisector(function(d) { return d[0]; }).left;

var x_cross =  graph_svg.append("line")
      .attr("class", "crosshair_x crosshairline")      
      .attr("stroke", "red")
      .attr("stroke-width", 2).style("opacity", 0);

var y_cross =  graph_svg.append("line")
      .attr("class", "crosshair_y crosshairline")      
      .attr("stroke", "red")
      .attr("stroke-width", 2).style("opacity", 0);

svg.selectAll(".crosshairline")              
    .on("click", function(){ //reset trend so that crosshair doesn't show up
      trend = [];
    });


var trend = [];

function mousemove(){
  if(trend.length > 0){
    var mouse = d3.mouse(this);
    var x_graph_val = x.invert(mouse[0]);
    var y_graph_val = y.invert(mouse[1]);
    
    var y_trend_val = trend[0]*x_graph_val+trend[1];

    setCross(mouse[0],y(y_trend_val))

  }else{
    svg.selectAll(".crosshairline").style("opacity", 0);
  }
}

function setCross(x_cross_val, y_cross_val){
    svg.select(".crosshair_x")
        .attr("x1", x_cross_val)
        .attr("y1", 0)
        .attr("x2", x_cross_val)
        .attr("y2",height).style("opacity", 1);   

    svg.select(".crosshair_y")
        .attr("x1", 0)
        .attr("y1", y_cross_val)
        .attr("x2", width)
        .attr("y2",y_cross_val).style("opacity", 1);
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
                .scaleExtent([0, 2000])
                .center([width / 2, height / 2])
                .size([width, height])
                .on("zoom", zoom);

svg.call(zoomBeh);





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
          console.log(_cached_data);

          if(callback){
            callback(added_data_names);
          }

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


  var temp_data = [];
  $.each(data_to_add, function(ind, data_name){
    $.each(_cached_data[data_name], function(ind, data_point){
      if(data_point["data_set"] != data_name){
        temp_data.push(data_point);
      }
    })
  });
  _data = temp_data;
  temp_data = [];

  $.each(data_to_add, function(ind, data_name){
    $.each(_cached_data[data_name], function(ind, data_point){
     // if($.inArray(data_point, _data) === -1){
        _data.push(data_point);
      //}
    })
  });

  var data = _data;
  //console.log(data);

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

  //console.log(x_min);
  //console.log(y_min);
  var margin_of_point = 10;

   x.domain([_current_x_axis_min, _current_x_axis_max+margin_of_point]).nice();
   y.domain([_current_y_axis_min, _current_y_axis_max+margin_of_point]).nice();
  // 
  //GoToArea([_current_x_axis_min, _current_x_axis_max], [_current_y_axis_min, _current_y_axis_max]);


  svg.selectAll(".axis").remove();


 svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .style("dominant-baseline", "central")
      .call(xAxis)
      .append("defs").append("marker")
    .attr("id", "arrowhead_x")
    .attr("refX",2)
    .attr("refY",8)
    .attr("markerWidth", 13)
    .attr("markerHeight",13)
    .attr("orient", "0")
    .append("path")
    .attr("d", "M2,2 L2,13 L8,7 L2,2")
    
    d3.select(".x").append("text")
      .attr("class", "label")
      .attr("x", width/2+40)
      .attr("y", 70)
      .style("text-anchor", "end")
      .text($x_axis_display_text);

  svg.append("g")
      .attr("class", "y axis")
      .style("dominant-baseline", "central")
      .call(yAxis)
    .append("defs").append("marker")
    .attr("id", "arrowhead_y")
    .attr("refX",2)
    .attr("refY",8)
    .attr("markerWidth", 13)
    .attr("markerHeight",13)
    .attr("orient", "270")
    .append("path")
    .attr("d", "M2,2 L2,13 L8,7 L2,2")

    d3.select(".y").append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", -70)
      .attr("x", -height/2+40)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text($y_axis_display_text);



d3.select(".x path").attr("marker-end","url(#arrowhead_x)");
d3.select(".y path").attr("marker-start","url(#arrowhead_y)");


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

    // graph_svg.selectAll(".dot ."+name)
    //           .data(plot_data)
    //           .enter().append("circle")
    //           .transition()  // Transition from old to new
    //           .duration(500)  // Length of animation
    //           .each("start", function() {  // Start animation
    //             d3.select(this)  // 'this' means the current element
    //             .attr("cx", x(0))
    //             .attr("fill", "red")  // Change color
    //           })
    //           .delay(function(d, i) {
    //             return i / data.length * 1000;  // Dynamic delay (i.e. each item delays a little longer)
    //           })
    //           .ease("linear")
    //           .attr("class", "dot "+name)
    //           .attr("id", ids)
    //           .attr("data_x",function(d) { return d[$x_axis]; })
    //           .attr("data_y",function(d) { return d[$y_axis]; })
    //           .attr("cy", function(d) { return y(d[$y_axis]); })

    //           .attr("r", function(d) {return r(radius)})
    //           .attr("fill", function(d) { return color(d["data_set"]);})  // Change color
    //           .each("end", function() {  // End animation
    //             d3.select(this)  // 'this' means the current element
    //             .transition()
    //             .duration(500)
    //                           .attr("cx", function(d) { return x(d[$x_axis]); })

    //             .attr("fill", function(d) { return color(d["data_set"]);})  // Change color
    //           });


    //Shoot from center
    // graph_svg.selectAll(".dot ."+name)
    //           .data(plot_data)
    //           .enter().append("circle")
    //           .transition()  // Transition from old to new
    //           .duration(500)  // Length of animation
    //           .each("start", function() {  // Start animation
    //             d3.select(this)  // 'this' means the current element
    //             .attr("cy", y(0))
    //             .attr("cx", x(0))

    //             .attr("fill", "red")  // Change color
    //           })
    //           .delay(function(d, i) {
    //             return i / data.length * i*50;  // Dynamic delay (i.e. each item delays a little longer)
    //           })
    //           .ease("linear")
    //           .attr("class", "dot "+name)
    //           .attr("id", ids)
    //           .attr("data_x",function(d) { return d[$x_axis]; })
    //           .attr("data_y",function(d) { return d[$y_axis]; })
    //             .attr("cx", function(d) { return x(d[$x_axis]); })
    //                           .attr("cy", function(d) { return y(d[$y_axis]); })

    //           .attr("r", function(d) {return r(radius)})
    //           .attr("fill", function(d) { return color(d["data_set"]);})  // Change color
    //           .each("end", function() {  // End animation
    //             d3.select(this)  // 'this' means the current element
    //             .transition()
    //             .duration(500)
    //             .attr("fill", function(d) { return color(d["data_set"]);})  // Change color
    //           });

        //pop in with bigger size and settle 
        
        graph_svg.selectAll(".dot ."+name)
              .data(plot_data)
              .enter().append("circle")
              .transition()  // Transition from old to new
              .duration(500)  // Length of animation
              .each("start", function() {  // Start animation
                d3.select(this)  // 'this' means the current element
                 .attr("r", 0)
                .attr("fill", "red")  // Change color
              })
              .delay(function(d, i) {
                return i / data.length * _.random(0,2000);  // Dynamic delay (i.e. each item delays a little longer)
              })
              .ease("linear")
              .attr("class", "dot "+name)
              .attr("id", ids)
              .attr("data_x",function(d) { return d[$x_axis]; })
              .attr("data_y",function(d) { return d[$y_axis]; })
              .attr("cx", function(d) { return x(d[$x_axis]); })
              .attr("cy", function(d) { return y(d[$y_axis]); })
              .attr("r", function(d) {return r(radius)+_.random(0,10)})
              .attr("fill", function(d) { return color(d["data_set"]);})  // Change color
              .each("end", function() {  // End animation
                d3.select(this)  // 'this' means the current element
                .transition()
                .duration(500)
                .attr("r", function(d) {return r(radius)})
                .attr("fill", function(d) { return color(d["data_set"]);})  // Change color

              });



  });

  refresh_legend();

  zoom();

  zoomBeh = d3.behavior.zoom()
                .x(x)
                .y(y)
                .scaleExtent([0, 2000])
                .center([width / 2, height / 2])
                .size([width, height])
                .on("zoom", zoom);

  svg.call(zoomBeh);

  console.log("AHHHHHH")


}

/**
 * 
 * @param {[array]}   data_to_add [description]
 * @param {Function} callback    [description]
 */
function add_trendline_for_data(data_to_add, callback){
  data_to_add = convertFilenamesToDatanames(data_to_add);

  _data_sets_in_use = _data_sets_in_use.concat(data_to_add);
  var temp = [];
  $.each(_data_sets_in_use, function(ind, el){
      if($.inArray(el,temp) === -1) temp.push(el);
  });
  _data_sets_in_use = temp;
  temp = [];

   $.each(data_to_add, function(ind, data_name){


    var data = _cached_data[data_name];

    var xSeries = data.map(function(d) { return +d[$x_axis]; })
    var ySeries = data.map(function(d) { return +d[$y_axis]; });

    
    var leastSquaresCoeff = leastSquares(xSeries, ySeries);
    //console.log(leastSquaresCoeff);
    
    // apply the reults of the least squares regression
    var x1 = -20000;
    var y1 = leastSquaresCoeff[0] * -20000 + leastSquaresCoeff[1];
    var x2 = xSeries[xSeries.length - 1]+20000;
    var y2 = leastSquaresCoeff[0] * (xSeries[xSeries.length - 1]+20000) + leastSquaresCoeff[1];
    var trendData = [[x1,y1,x2,y2,leastSquaresCoeff,data]];

    //console.log(trendData);

    graph_svg.selectAll(data_name+"_trendlines").remove();
    
    var trendline = graph_svg.selectAll(data_name+"_trendlines")
      .data(trendData);
      
    trendline.enter()
      .append("line")
      .attr("id", data_name+"_trend")
      .attr("class", data_name+"_trendlines trendline")
      .attr("x1", function(d) { return x(d[0]); })
      .attr("y1", function(d) { return y(d[1]); })
      .attr("x2", function(d) { return x(d[2]); })
      .attr("y2", function(d) { return y(d[3]); })
      .on("mouseover", function(d) {
         d3.select(this).attr("stroke", "#00E559").style("cursor","pointer").attr("stroke-width", 5);
      })
      .on("mouseout", function(d) {
         d3.select(this).attr("stroke", color(data_name)).attr("stroke-width", 3);

      })
      .on("click", function(d){
         trend = d[4];
      })
      .attr("stroke", color(data_name))
      .attr("stroke-width", 3);

   });

  refresh_legend();
}


function add_cross(data_name, callback){


    var data = _cached_data[data_name];

    var xSeries = data.map(function(d) { return d[$x_axis]; })
    var ySeries = data.map(function(d) { return d[$y_axis]; });
    
    var leastSquaresCoeff = leastSquares(xSeries, ySeries);

    //console.log(leastSquaresCoeff);


}

function remove_data_from_cache(){

  // doesn't need to be implimented as current use case does not need removal of files

}

function remove_data_from_graph(data_to_remove){

  data_to_remove = convertFilenamesToDatanames(data_to_remove);



  $.each(data_to_remove, function(ind, name){

    //console.log((d3.selectAll(".dot."+name)[0].length >= 1));

    if((_data_sets_in_use.indexOf(name) > -1) && (!(d3.selectAll("#"+name+"_trend")[0].length >= 1) && (d3.selectAll(".dot."+name)[0].length >= 1))){
        _data_sets_in_use.splice(_data_sets_in_use.indexOf(name),1);

    }


     d3.select(".graph").selectAll("circle."+name)
    .transition()  // Transition from old to new
    .duration(500)  // Length of animation
    
    .delay(function(d, i) {
      return i / d3.select(".graph").selectAll("circle."+name)[0].length * 500;  // Dynamic delay (i.e. each item delays a little longer)
    })
    .attr("r", 0)
    .ease("linear")
    .each("end", function() {  // End animation
      d3.select(this)              
      .remove();
    });   
  });

  refresh_legend();
}


function remove_trendline_for_data(data_name){


    d3.selectAll("#"+data_name+"_trend").remove();
  //console.log(_data_sets_in_use)

   if((_data_sets_in_use.indexOf(data_name) > -1) && (!(d3.selectAll("#"+data_name+"_trend")[0].length >= 1) && !(d3.selectAll(".dot."+data_name)[0].length >= 1))){
        _data_sets_in_use.splice(_data_sets_in_use.indexOf(data_name),1);

    }


  //console.log(_data_sets_in_use)

  refresh_legend();

}
    

function refresh_legend(){

  graph_svg.selectAll(".legend").remove();

  //console.log("WHHATT"+color.domain());

  var legend = graph_svg.selectAll(".legend")
      .data(_data_sets_in_use)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 25)
       .attr("y", 7)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 30)
      .attr("y",16)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})


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

function zoom() {
  //console.log("BRAAAAHHH!!");
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("cx", function(d){ return x(d[$x_axis]);})
        .attr("cy", function(d){ return y(d[$y_axis]);})
        .attr("r", function(d) {return r(radius)})

    svg.selectAll(".trendline")
      .attr("x1", function(d) { return x(d[0]); })
      .attr("y1", function(d) { return y(d[1]); })
      .attr("x2", function(d) { return x(d[2]); })
      .attr("y2", function(d) { return y(d[3]); })




    d3.selectAll('.tick')
      .filter(function(d){ 
        return d==0
      })
      .select('line') //grab the tick line
      .style('stroke-width', 2) //or style directly with attributes or inline styles
      .style('opacity', 1);
}

// returns slope, intercept and r-square of the line
function leastSquares(xSeries, ySeries) {
  var reduceSumFunc = function(prev, cur) { return prev + cur; };
  
  var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
  var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

  var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
    .reduce(reduceSumFunc);
  
  var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
    .reduce(reduceSumFunc);
    
  var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
    .reduce(reduceSumFunc);
    
  var slope = ssXY / ssXX;
  var intercept = yBar - (xBar * slope);
  var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
  
  return [slope, intercept, rSquare];
}


d3.selectAll("button[data-zoom]")
    .on("click", clicked);

function clicked() {
  //console.log()
  svg.call(zoomBeh.event); // https://github.com/mbostock/d3/issues/2387

  // Record the coordinates (in data space) of the center (in screen space).
  var center0 = zoomBeh.center(), translate0 = zoomBeh.translate(), coordinates0 = coordinates(center0);
  zoomBeh.scale(zoomBeh.scale() * Math.pow(2, +this.getAttribute("data-zoom")));

  // Translate back to the center.
  var center1 = point(coordinates0);
  zoomBeh.translate([translate0[0] + center0[0] - center1[0], translate0[1] + center0[1] - center1[1]]);

  svg.transition().call(zoomBeh.event);
}

function coordinates(point) {
  var scale = zoomBeh.scale(), translate = zoomBeh.translate();
  return [(point[0] - translate[0]) / scale, (point[1] - translate[1]) / scale];
}

function point(coordinates) {
  var scale = zoomBeh.scale(), translate = zoomBeh.translate();
  return [coordinates[0] * scale + translate[0], coordinates[1] * scale + translate[1]];
}

/**
 * Zooms and pans smoothly to specified value ranges for x and y data values
 * 
 * @param  {[array]} xrange [specify the [min, max] value for x]
 * @param  {[array]} yrange [specify the [min, max] value for y]
 * 
 */
function GoToArea(xrange, yrange){

    d3.transition().duration(750).tween("zoom", function() {
      var ix = d3.interpolate(x.domain(), xrange),
        iy = d3.interpolate(y.domain(), yrange);
        return function(t) {
          zoomBeh.x(x.domain(ix(t))).y(y.domain(iy(t)));
          zoom();
        };
    });

}
