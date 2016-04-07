global.$ = global.jQuery = require("jquery");
global.d3 = require("d3");
global._ = require("underscore");

require("blueimp-file-upload");
require("jquery-knob"); 
require("./upload.js"); // Upload files through AJAX
var graph = require("./graph.js");



$("#updateButton").click(function(){



    var radius = _.random(0.1,50);
    console.log(radius);
    graph.setPlotSize(radius);





});





