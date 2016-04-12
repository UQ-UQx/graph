var _data_sets = [];
var _data = {};
var _parsed_csv_files = {};
var _data_base_path = "data/"+$lti_id+"/"+$user_id+"/";
var _current_x_axis_max = 0;
var _current_y_axis_max = 0;


var margin = {top: 40, right: 40, bottom: 55, left: 55},
    dim = Math.max(parseInt(d3.select("#chart").style("width")), parseInt(d3.select("#chart").style("height"))),
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
    .orient("bottom")
    .ticks(5);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
        .ticks(5);


var svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width/2+40)
      .attr("y", 40)
      .style("text-anchor", "end")
      .text($x_axis_display_text);

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
      .text($y_axis_display_text);

resize();
function resize() {

  var dim = Math.min(parseInt(d3.select("#chart").style("width")), parseInt(d3.select("#chart").style("height"))),
  width = dim - margin.left - margin.right,
  height = dim - margin.top - margin.bottom;

  //console.log(dim);

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
    .attr("cx", function(d) { return x(d[$x_axis]); })
    .attr("cy", function(d) { return y(d[$y_axis]); })
}

d3.select(window).on('resize', resize);





module.exports = {
  init: function(data){
    console.log("Graph init");
    
    $.each(data,function(ind,obj){
      if ($.inArray(obj, _data_sets) == -1) {
        _data_sets.push(obj);
      }
    });
    load_and_render_data();
   // renderData();
  },
  add: function(selected__data_set){



  },
  remove: function(selected_data_set){



  },
  add_line: function(selected_data_set){



  },
  remove_line: function(selected_data_set){



  },
  show_data: function(selected_data_set){



  },
  update: function(selected_data_set){



  }


}


//keep track of all data being loaded
//
//run through each one and set scale
//
//display the data points
//
//



// add
// remove
// add_line
// remove_line
// update



function load_and_render_data(){
  var remaining = _data_sets.length;
  $.each(_data_sets, function (ind, filename){
    d3.text(_data_base_path+filename, function(data) {
        var parsedCSV = d3.csv.parseRows(data);
        file_name = filename.substring(0,filename.length - 4);
        _parsed_csv_files[file_name] = parsedCSV;
        if (!--remaining) renderDataTable();
    });
  });
  function renderDataTable(){
    $.each(_parsed_csv_files, function(key,dat_text){
      var csvString = d3.csv.formatRows(dat_text);
      var csvObjs = d3.csv.parse(csvString);
      $.each(csvObjs, function(ind, obj){
          obj["set"] = key;
      });
      _data[key]=csvObjs;
      _data[key]["display"] = true;
      // if(key == "aHacket_2004"){
      //   _data[key]["display"] = false;
      // }
    })
    setScales();
  }
  function setScales(){
    remaining = _data_sets.length;
    $.each(_data_sets, function(ind, filename){
      d3.csv(_data_base_path+filename, function(error,data){
        if (error) throw error;
        data.forEach(function(d){
          d[$x_axis] = +d[$x_axis];
          d[$y_axis] = +d[$y_axis];
        });

        var x_max = Math.max(d3.max(data, function(d){return d[$x_axis]}),_current_x_axis_max);
        var y_max = Math.max(d3.max(data, function(d){return d[$y_axis]}),_current_y_axis_max);

        if(x_max > _current_x_axis_max){
          _current_x_axis_max = x_max;
        }
        if(y_max > _current_y_axis_max){
          _current_y_axis_max = y_max;
        }
        if (!--remaining) renderGraph();
      });
    });
  }
}


function renderGraph() {
  //console.log(_data);
    $.each(_data, function(data_name, obj){
     if(obj["display"]){
        renderGraphWithDataName(data_name, obj);
     }
    });
}

function renderGraphWithDataName(name, data){
  resize();
    var dim = Math.min(parseInt(d3.select("#chart").style("width")), parseInt(d3.select("#chart").style("height"))),
  width = dim - margin.left - margin.right,
  height = dim - margin.top - margin.bottom;


      data.forEach(function(d){
        d[$x_axis] = +d[$x_axis];
        d[$y_axis] = +d[$y_axis];
        d["set"] = name;
      });

    //console.log(data);

      var x_max = Math.max(d3.max(data, function(d){return d[$x_axis]}),_current_x_axis_max);
      var y_max = Math.max(d3.max(data, function(d){return d[$y_axis]}),_current_y_axis_max);

      if(x_max > _current_x_axis_max){
        _current_x_axis_max = x_max;
      }
      if(y_max > _current_y_axis_max){
        _current_y_axis_max = y_max;
      }

      //console.log(x_max);
      //console.log(y_max);

      x.domain([0, x_max]).nice();
      y.domain([0, y_max]).nice();


  svg.selectAll(".axis").remove();


  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width/2+40)
      .attr("y", 40)
      .style("text-anchor", "end")
      .text($x_axis_display_text);

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
      .text($y_axis_display_text);


  svg.selectAll("circle."+name).remove();
   // svg.selectAll("circle.dot").remove();

   var id = 0;
   var ids = function(){
      return name+"_"+id++;
   }

    svg.selectAll(".dot ."+name)
      .data(data)
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
//      .attr("cx", function(d) { return x(d[$x_axis]); })
      .attr("cy", function(d) { return y(d[$y_axis]); })
      .attr("fill", function(d) { return color(d["set"]);})  // Change color

      .each("end", function() {  // End animation
                            d3.select(this)  // 'this' means the current element
                                .transition()
                                .duration(500)
                                .attr("cx", function(d) { return x(d[$x_axis]); })
                                .attr("fill", function(d) { return color(d["set"]);})  // Change color

                                //.attr("r", r(radius));  // Change radius
                        })



  //})

}




