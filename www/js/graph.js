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
  init: function(uploaded, pre_load, callback){


   // console.log("init called", uploaded, pre_load);
    add_data_to_cache(uploaded, function(added_data_names){

      console.log(_cached_data);
        add_data_to_graph(pre_load, callback);
        

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

  },
  get_line_of_best_fit_formulas: function(data_names){

    var formulas = {};
    $.each(data_names, function(ind, data_name){
      formulas[data_name] = getLeastSqCof(data_name);
    });

    return formulas;

  },
  setPointOfCollision: function(point_of_col){



   //// console.log("red", point_of_col);
    if(point_of_col["time"]){

       console.log(point_of_col);

       graph_svg.selectAll(".collission").remove();

      var circle_color = "red";

       if(point_of_col["car_distance"] < 8000){
          circle_color = "green";
       }


        var delay = carchase_line_animation_time*(point_of_col["time"]/point_of_col["total_time"]);
        graph_svg.append("circle").datum(point_of_col)
          .transition()
          .delay(delay)  // Transition from old to new
          .duration(700)  // Length of animation
          .each("start", function() {  // Start animation
            d3.select(this)  // 'this' means the current element
             .attr("r", 0)
            .attr("fill", "#000080")  // Change color
          })
          .ease("linear")
          .attr("class", "collission")
          .attr("cx", function(d) { return x(d["time"]); })
          .attr("cy", function(d) { return y(d["car_distance"]); })
          .attr("r", 50)
         // .attr("fill", "red")  // Change color
          .each("end", function() {  // End animation
            d3.select(this)  // 'this' means the current element
            .transition()
            .duration(700)
            .attr("r", 10)
            .attr("fill", circle_color)  // Change color

          });
    }else{

             graph_svg.selectAll(".collission").remove();

    }


  }


}

var carchase_line_animation_time = 3000;



var _dateFormat = d3.time.format("%b %Y");
var _data_base_path = "data/"+$lti_id+"/"+$user_id+"/";
var _current_x_axis_max = 0;
var _current_y_axis_max = 0;
var _current_x_axis_min = 0;
var _current_y_axis_min = 0;

var _cached_data = {};
var _data = [];
var _data_sets_in_use = [];
var axis_display_size = "15px";
var axis_display_x_offset = 60;
var axis_display_y_offset = 80;

  // var margin_of_point_max = 5;
  // var margin_of_point_min = 5;
 var margin_offset_percentage = 0.1;


 var x_margin = 5;
 var y_margin = 5;

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

var radius = 0.7;
var r = d3.scale.linear()
    .range([radius, radius]);

var color = d3.scale.category10();
var num_of_ticks = 10;

var axis_tick_format = "d";
var axis_tick_format_default = ".3r";


var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
              .ticks(num_of_ticks)
              .innerTickSize(-width)
              .outerTickSize(0)
              .tickPadding(10)

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
              .ticks(num_of_ticks)
              .innerTickSize(-height)
              .outerTickSize(0)
              .tickPadding(10)


var x_axis_name = $x_axis;
if((x_axis_name.toLowerCase() == "years") || (x_axis_name.toLowerCase() == "year")){
  xAxis.tickFormat(d3.format(axis_tick_format));
}else{
//  xAxis.tickFormat(d3.format(axis_tick_format_default));

}

var y_axis_name = $y_axis;
if((y_axis_name.toLowerCase() == "years") || (y_axis_name.toLowerCase() == "year")){
  yAxis.tickFormat(d3.format(axis_tick_format));
}else{
  //yAxis.tickFormat(d3.format(axis_tick_format_default));

}

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
              .attr("x", width/2+axis_display_x_offset)
              .attr("y", axis_display_y_offset-20)
              .style("text-anchor", "end")
              .text($x_axis_display_text).style("font-size",axis_display_size);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("class", "label")
              .attr("transform", "rotate(-90)")
              .attr("y", -axis_display_y_offset)
              .attr("x", -height/2+axis_display_x_offset)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text($y_axis_display_text).style("font-size",axis_display_size);

var graph_svg = d3.select(".graph");

var tooltip_div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

var data_line = d3.svg.line().interpolate("basis")  
    .x(function(d) { return x(d[$x_axis]); })
    .y(function(d) { return y(d[$y_axis]); });



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


   svg.selectAll(".trendline")
      .attr("x1", function(d) { return x(d[0]); })
      .attr("y1", function(d) { return y(d[1]); })
      .attr("x2", function(d) { return x(d[2]); })
      .attr("y2", function(d) { return y(d[3]); });


    // svg.selectAll("path.line")
    //       .attr("d", data_line);

   graph_svg.selectAll('.collission')
    .attr("r", function(d) {return 10})
    .attr("cx", function(d) { return x(d["time"]); })
    .attr("cy", function(d) { return y(d["car_distance"]); })

graph_svg.selectAll("path.line")
          .attr("d", data_line);



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
          svg.selectAll(".crosshairline").style("opacity", 0);

               tooltip_div.style("opacity", 0); 

    });


var trend = [];

function mousemove(){
  if(trend.length > 0){
    var mouse = d3.mouse(this);
    var x_graph_val = x.invert(mouse[0]);
    var y_graph_val = y.invert(mouse[1]);
    
    var y_trend_val = trend[0]*x_graph_val+trend[1];

    setCross(mouse[0],y(y_trend_val),[x_graph_val, y_trend_val]);

  }else{
    svg.selectAll(".crosshairline").style("opacity", 0);
  }
}

function setCross(x_cross_val, y_cross_val, values){
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

    var m = trend[0].toFixed($decimal_place);
    var c = trend[1].toFixed($decimal_place);
    var rs = trend[2].toFixed($decimal_place);
    var x = values[0].toFixed($decimal_place);
    var y = values[1].toFixed($decimal_place);


    tooltip_div
        .style("opacity", .9);    
    tooltip_div.html( "<b>y</b> = "+m+"<b>x</b> + "+c+"<br><b>r-squared: "+rs+"<br>"+$y_axis_display_text+": <b>"+y + "</b><br/>"  + $x_axis_display_text+": <b>"+x+"</b>")  
        .style("left", (x_cross_val+120) + "px")   
        .style("top", (y_cross_val+100) + "px");  
  
}

function setBoldGridLines(grid_number){


   //  d3.selectAll(".x_axis_thick_line").remove();

   // graph_svg.append("line")
   //        .style("stroke", "black")  // colour the line

   //    .attr("class", "solid_axis_line")
   //    .attr("x1", 0)
   //    .attr("y1", -300000 )
   //    .attr("x2", 0 )
   //    .attr("y2", 300000)
   //      .style('stroke-width', 2)
   //  .style('opacity', 1);


  d3.selectAll('.tick')
    .filter(function(d){ 

        
        if((d > -0.0000000001) && (d < 0.0000000001)){


          return true;
        }
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

//svg.call(zoomBeh);





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
   // console.log(filename);

      var dir = filename["directory"];
      var filename = filename["file_name"];

      d3.text(_data_base_path+dir+"/"+filename, function(data) {
        data_name = filename.substring(0,filename.length - 4);


        var parsedCSV = d3.csv.parseRows(data);
        var csvString = d3.csv.formatRows(parsedCSV);
        var csvObjs = d3.csv.parse(csvString);

      
        $.each(csvObjs, function(ind, obj){
            obj["data_set"] = data_name;

            obj[$x_axis] = +obj[$x_axis];
            
            obj[$y_axis] = +obj[$y_axis];
        });


        added_data_names.push(data_name);
        _cached_data[data_name] = csvObjs;


        if(!--remaining){
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
  //
  

   setView();
   setScales(data);


  // var y_axis_min_margin = 5;
  // var y_axis_max_margin = 5;
  // var x_axis_min_margin = 5;
  // var x_axis_max_margin = 5;

  // if(_current_x_axis_min == 0){
  //   x_axis_min_margin = 0;
  // }else{
  //   x_axis_min_margin = _current_x_axis_min*margin_offset_percentage
  // }

  // if(_current_x_axis_max == 0){
  //   x_axis_max_margin = 0;
  // }else{
  //   x_axis_max_margin = _current_x_axis_max*margin_offset_percentage
  // }

  // if(_current_y_axis_min == 0){
  //   y_axis_min_margin = 0;
  // }else{
  //   y_axis_min_margin = _current_y_axis_min*margin_offset_percentage
  // }

  // if(_current_y_axis_max == 0){
  //   y_axis_max_margin = 0;
  // }else{
  //   y_axis_max_margin = _current_y_axis_max*margin_offset_percentage
  // }

  // var x_margin_array = [x_axis_max_margin, x_axis_min_margin];
  // var y_margin_array = [y_axis_min_margin, y_axis_max_margin];

  // x_margin = d3.max(x_margin_array);
  // y_margin = d3.max(y_margin_array);

  // x.domain([_current_x_axis_min-x_margin, _current_x_axis_max+x_margin]);
  // y.domain([_current_y_axis_min-y_margin, _current_y_axis_max+y_margin]);


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
      .attr("x", width/2+axis_display_x_offset)
      .attr("y", axis_display_y_offset-20)
      .style("text-anchor", "end")
      .text($x_axis_display_text).style("font-size",axis_display_size);

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
      .attr("y", -axis_display_y_offset)
      .attr("x", -height/2+axis_display_x_offset)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text($y_axis_display_text).style("font-size",axis_display_size);



d3.select(".x path").attr("marker-end","url(#arrowhead_x)");
d3.select(".y path").attr("marker-start","url(#arrowhead_y)");


  graph_svg.selectAll(".dot")
    .attr("cx", function(d){ return x(d[$x_axis]);})
    .attr("cy", function(d){ return y(d[$y_axis]);})
    .attr("r", function(d) {return r(radius)})




      var available_data_names_in_cache = [];
  $.each(_cached_data, function(name,data){
    available_data_names_in_cache.push(name);
  });

  if(callback){
    callback(available_data_names_in_cache);
  }


  refresh_legend();

  //zoom();

  zoomBeh = d3.behavior.zoom()
                .x(x)
                .y(y)
                .scaleExtent([0, 2000])
                .center([width / 2, height / 2])
                .size([width, height])
                .on("zoom", zoom);




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
    graph_svg.selectAll("path."+name).remove();

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
        //
    if($graph_type == "scatter"){
          svg.call(zoomBeh);

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
                return i / data.length * _.random(0,1000);  // Dynamic delay (i.e. each item delays a little longer)
              })
              .ease("linear")
              .attr("class", "dot "+name)
              .attr("id", ids)
              .attr("data_x",function(d) { return d[$x_axis]; })
              .attr("data_y",function(d) { return d[$y_axis]; })
              .attr("cx", function(d) { return x(d[$x_axis]); })
              .attr("cy", function(d) { return y(d[$y_axis]); })
             
              .attr("r", function(d) {return r(radius)+_.random(0,30)})
              .attr("fill", function(d) { return color(d["data_set"]);})  // Change color
              .each("end", function() {  // End animation
                d3.select(this)  // 'this' means the current element
                .transition()
                .duration(500)
                .attr("r", function(d) {return r(radius)})
                .attr("fill", function(d) { return color(d["data_set"]);})  // Change color

              });

      }else{
     

           // var pth =  graph_svg.append("path").data(plot_data)
           //    .attr("class", "line "+name)
           //    .attr("id", ids)
           //    .attr("d", data_line(plot_data))
           //    .attr("stroke", function(d) { return color(d["data_set"]);})  // Change color
           //    .attr("stroke-width", 2)  // Change color
           //    .attr("fill", "none")  // Change color

           var pth = graph_svg.append("path").datum(plot_data)
                      .attr("class", "line "+name)
                      .attr("d", data_line)

                      .attr("stroke", function(d) {return color(d[0]["data_set"]);})  // Change color
              .attr("stroke-width", 2)  // Change color
              .attr("fill", "none")  // Change color
                      //.attr("stroke-width", 1)  // Change color
                     //.attr("fill", "none")  // Change color


         // pth

            // var pth = graph_svg.selectAll(".line ."+name)
            //   .data(plot_data)
            //   .enter().append("path")
            //   .attr("class", "line "+name)
            //   .attr("id", ids)
            //   .attr("d", data_line(plot_data))
            //   .attr("stroke", function(d) { return color(d["data_set"]);})  // Change color
            //   .attr("stroke-width", 2)  // Change color
            //   .attr("fill", "none")  // Change color

            //console.log(graph_svg.selectAll(".police"));


              var totalLength = pth.node().getTotalLength();

                pth
                  .attr("stroke-dasharray", totalLength + " " + totalLength)
                  .attr("stroke-dashoffset", totalLength)
                  .transition()
                    .duration(carchase_line_animation_time)
                    .ease("linear")
                    .attr("stroke-dashoffset", 0);

            //svg.selectAll(".police").data(plot_data);
      }

  });


    setBoldGridLines(0);


 // console.log("AHHHHHH")


}


function getLeastSqCof(data_name){

    var data = _cached_data[data_name];

    if(data.length <= 1){
      return;
    }

    var xSeries = data.map(function(d) { return +d[$x_axis]; })
    var ySeries = data.map(function(d) { return +d[$y_axis]; });

    
    var leastSquaresCoeff = leastSquares(xSeries, ySeries);

    return leastSquaresCoeff;
}



function calculate_min_max_and_set(){


  var cached_max_x = 0;
  var cached_max_y = 0;
  var cached_min_x = 0;
  var cached_min_y = 0;

  var data_in_use = [];

  console.log(_data_sets_in_use);


  $.each(_cached_data, function(cached_data_name, cached_data){
    if($.inArray(cached_data_name, _data_sets_in_use) !== -1){
      data_to_calculate[cached_data_name] = cached_data;
    }
  });

  //calculate max first and set min and max to the max value
  $.each(data_to_calculate, function(cached_data_name, cached_data){
      var x_max = d3.max(cached_data, function(d){return d[$x_axis]});
      var y_max = d3.max(cached_data, function(d){return d[$y_axis]});

      console.log(x_max, y_max);
      console.log(cached_max_x, cached_max_y, cached_min_x, cached_min_y)

      if(x_max != cached_max_x){
        cached_max_x = x_max;
        cached_min_x = x_max;
      }
      if(y_max != cached_max_y){
        cached_max_y = y_max;
        cached_min_y = y_max;
      }
  });  


  //calculate min and check if it's less than the cached min value which was set to the max value
  $.each(data_to_calculate, function(cached_data_name, cached_data){
      var x_min = d3.min(cached_data, function(d){return d[$x_axis]});
      var y_min = d3.min(cached_data, function(d){return d[$y_axis]});
      if(x_min != cached_min_x){
        cached_min_x = x_min;
      }
      if(y_min != cached_min_y){
        cached_min_y = y_min;
      }
  }); 







  _current_x_axis_max = cached_max_x;
  _current_y_axis_max = cached_max_y;
  _current_x_axis_min = cached_min_x;
  _current_y_axis_min = cached_min_y;

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


    var leastSquaresCoeff = getLeastSqCof(data_name);
    if(!leastSquaresCoeff){
      return;
    }

    //console.log(leastSquaresCoeff);
    
    // apply the reults of the least squares regression
    // 
   
    // var crosshairline_range = x(width);
    // var x1 = -crosshairline_range;
    // var y1 = leastSquaresCoeff[0] * -crosshairline_range + leastSquaresCoeff[1];
    // var x2 = xSeries[xSeries.length - 1]+crosshairline_range;
    // var y2 = leastSquaresCoeff[0] * (xSeries[xSeries.length - 1]+crosshairline_range) + leastSquaresCoeff[1];
    // 
    var crosshairline_range = xAxis.scale().domain();
    var x1 = crosshairline_range[0];
    var y1 = leastSquaresCoeff[0] * crosshairline_range[0] + leastSquaresCoeff[1];
    var x2 = crosshairline_range[1];
    var y2 = leastSquaresCoeff[0] * crosshairline_range[1] + leastSquaresCoeff[1];
    var trendData = [[x1,y1,x2,y2,leastSquaresCoeff]];

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

   setView();
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

      setView();

  refresh_legend();
}


function remove_trendline_for_data(data_name){


    d3.selectAll("#"+data_name+"_trend").remove();

   if((_data_sets_in_use.indexOf(data_name) > -1) && (!(d3.selectAll("#"+data_name+"_trend")[0].length >= 1) && !(d3.selectAll(".dot."+data_name)[0].length >= 1))){
        _data_sets_in_use.splice(_data_sets_in_use.indexOf(data_name),1);

    }

    setView();

  refresh_legend();

}
    

function refresh_legend(){

  graph_svg.selectAll(".legend").remove();

  //console.log("WHHATT"+color.domain());
  //
  
  var in_use = [];
  $.each(_data_sets_in_use, function(ind, set){
  var dat = {};

      dat["data_name"] = set;
      dat["data_name_pretty"] = set.replace(/_/g, ' ');
    in_use.push(dat);

  });

 // console.log(in_use);


  var legend = graph_svg.selectAll(".legend")
      .data(in_use)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", 8)
       .attr("y", 7)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) { return color(d["data_name"]);});

  // draw legend text
  legend.append("text")
      .attr("x",  30)
      .attr("y",16)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) { return d["data_name_pretty"];})


}

/*
 
 HELPER FUNCTIONS

 */

function convertFilenamesToDatanames(filenames){
  var datanames = [];
  $.each(filenames, function(ind, filename){
    if(filename["file_name"]){
      filename = filename["file_name"];
    }
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


    var x_domain = xAxis.scale().domain();

    svg.selectAll(".trendline")
      .attr("x1", function(d) { 
        var leastsq = d[4]; 
        return x(x_domain[0]); })
      .attr("y1", function(d) { 
        var leastsq = d[4]; 
        return y(leastsq[0]*x_domain[0]+leastsq[1]); 
      })
      .attr("x2", function(d) { 
        var leastsq = d[4]; 
        return x(x_domain[1]); 
      })
      .attr("y2", function(d) { 
        var leastsq = d[4]; 
        return y(leastsq[0]*x_domain[1]+leastsq[1]); 
      })

    graph_svg.selectAll("path.line")
          .attr("d", data_line);

              setBoldGridLines(0);


    // d3.selectAll('.tick')
    //   .filter(function(d){ 

    //     return d==5
    //   })
    //   .select('line') //grab the tick line
    //   .style('stroke-width', 2) //or style directly with attributes or inline styles
    //   .style('opacity', 1);
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

  console.log(slope, intercept, rSquare);
  
  return [slope, intercept, rSquare];
}


d3.selectAll("button[data-zoom]")
    .on("click", clicked);

d3.selectAll("button[reset-view]")
    .on("click", setView);




function setView(){

  //calculate in slected data max and min
 // console.log(_data_sets_in_use);
 // 
 // 
 
  
  var data_to_calculate = {};

  var cached_max_x = 0;
  var cached_max_y = 0;
  var cached_min_x = 0;
  var cached_min_y = 0;

  var x_max_dataset = '';
  var y_max_dataset = '';
  var x_min_dataset = '';
  var y_min_dataset = '';




  $.each(_cached_data, function(cached_data_name, cached_data){
    if($.inArray(cached_data_name, _data_sets_in_use) !== -1){
      data_to_calculate[cached_data_name] = cached_data;
    }
  });




  //calculate max first and set min and max to the max value
  $.each(data_to_calculate, function(cached_data_name, cached_data){
      var x_max = d3.max(cached_data, function(d){return d[$x_axis]});
      var y_max = d3.max(cached_data, function(d){return d[$y_axis]});

     // console.log("current", x_max, y_max);
     // console.log(cached_max_x, cached_max_y, cached_min_x, cached_min_y)

      if(x_max > cached_max_x){
        x_max_dataset = cached_data_name;
        cached_max_x = x_max;
        cached_min_x = x_max;
      }
      if(y_max > cached_max_y){
        y_max_dataset = cached_data_name;
        cached_max_y = y_max;
        cached_min_y = y_max;
      }
  });  


  //calculate min and check if it's less than the cached min value which was set to the max value
  $.each(data_to_calculate, function(cached_data_name, cached_data){
      var x_min = d3.min(cached_data, function(d){return d[$x_axis]});
      var y_min = d3.min(cached_data, function(d){return d[$y_axis]});
      if(x_min < cached_min_x){
        x_min_dataset = cached_data_name;
        cached_min_x = x_min;
      }
      if(y_min < cached_min_y){
        y_min_dataset = cached_data_name;
        cached_min_y = y_min;
      }
  }); 


  _current_x_axis_max = cached_max_x;
  _current_y_axis_max = cached_max_y;
  _current_x_axis_min = cached_min_x;
  _current_y_axis_min = cached_min_y;


  if(_data_sets_in_use.length > 0){
    x_margin = (_current_x_axis_max - _current_x_axis_min)/data_to_calculate[x_max_dataset].length;
    y_margin = (_current_y_axis_max - _current_y_axis_min)/data_to_calculate[y_min_dataset].length;
  }else{
    x_margin = 1;
    y_margin = 1;
  }



  console.log(cached_max_x, cached_max_y, cached_min_x, cached_min_y, x_margin, y_margin);




  x.domain([_current_x_axis_min-x_margin, _current_x_axis_max+x_margin]);
  y.domain([_current_y_axis_min-y_margin, _current_y_axis_max+y_margin]);


  

  GoToArea([cached_min_x-x_margin, cached_max_x+x_margin], [cached_min_y-y_margin, cached_max_y+y_margin]);

}

function calculate_margin(min_max_datasets, data_to_calculate){

  var margin = {};

  console.log("wa",min_max_datasets);

  var x_axis_data_name = min_max_datasets["max_x"];


  //calcualte margin for x
  $.each(data_to_calculate[x_axis_data_name], function(ind, datapoint){


      console.log(x_axis_data_name, datapoint);




  });


  


  margin["x"] = 5;
  margin["y"] = 10;

  return margin;

}

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



    d3.transition().duration(0).tween("zoom", function() {
      var ix = d3.interpolate(x.domain(), xrange),
        iy = d3.interpolate(y.domain(), yrange);
        return function(t) {
          zoomBeh.x(x.domain(ix(t))).y(y.domain(iy(t)));
          zoom();
        };
    });

}

