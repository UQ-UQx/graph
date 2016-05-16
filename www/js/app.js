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

            $init_available_data_sets = $.map($init_available_data_sets, function(el){return el;});
			graph.init($init_available_data_sets, $pre_load);
		}
	},500);


	$(document).on("change",'.data_to_load', function() {
	    var values = $(this).map(function() {
	    	if(this.checked){

                graph.show_data([this.value]);
                return;
        		//return {"call":"add", "val":this.value};
        	}
            graph.hide_data([this.value]);
        	//return {"call":"remove", "val":this.value};
    	})//.get();

	});

    $(document).on("change",'.trendline_to_load', function() {
        var values = $(this).map(function() {
            if(this.checked){

                graph.add_line([this.value]);
                return;
                //return {"call":"add", "val":this.value};
            }
            graph.remove_line(this.value);
            //return {"call":"remove", "val":this.value};
        })//.get();

    });


});

