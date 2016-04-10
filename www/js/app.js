global.$ = global.jQuery = require("jquery");
global.d3 = require("d3");
global._ = require("underscore");

require("blueimp-file-upload");
require("jquery-knob"); 
require("./upload.js"); // Upload files through AJAX
var graph = require("./graph.js");



$("#updateButton").click(function(){



	graph.loadData($pre_load);

   // graph.loadData("Sun_Yang.csv");
   // graph.loadData("Hacket_2004.csv");
  // graph.loadData("Hacket_2006.csv");






});





