global.$ = global.jQuery = require("jquery");
global.d3 = require("d3");
global._ = require("underscore");
require('bootstrap');
require('twbs-pagination');
require("blueimp-file-upload");
require("jquery-knob"); 
require("./upload.js"); // Upload files through AJAX
var graph = require("./graph.js");


$("document").ready(function(){
	var check_loaded = setInterval(function(){
		console.log("checking...");
		if($pre_load.length > 0){
			clearInterval(check_loaded);
			graph.init($pre_load);
		}
	},500);


	$(document).on("change",'.data_to_load', function() {
	    var values = $(this).map(function() {
	    	if(this.checked){
        		return {"call":"add", "val":this.value};
        	}
        	return {"call":"remove", "val":this.value};
    	}).get();
    	console.log(values);
	});


});

