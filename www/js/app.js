global.$ = global.jQuery = require("jquery");
global.d3 = require("d3");
global._ = require("underscore");
global.query_graph = require("./graph.js");
require('bootstrap');
require('twbs-pagination');
require("blueimp-file-upload");
require("jquery-knob"); 
require("./upload.js"); // Upload files through AJAX
var editable_table = require("./editable_table.js");


$("document").ready(function(){
	var check_loaded = setInterval(function(){
		console.log("checking...");
		if($pre_load.length > 0){
			clearInterval(check_loaded);

            $init_available_data_sets = $.map($init_available_data_sets, function(el){return el;});
			query_graph.init($init_available_data_sets, $pre_load);



		}
	},500);



	$(document).on("change",'.data_to_load', function() {
	    var values = $(this).map(function() {
	    	if(this.checked){

                query_graph.show_data([this.value]);
                return;
        		//return {"call":"add", "val":this.value};
        	}
            query_graph.hide_data([this.value]);
        	//return {"call":"remove", "val":this.value};
    	})//.get();

	});

    $(document).on("change",'.trendline_to_load', function() {
        var values = $(this).map(function() {
            if(this.checked){

                query_graph.add_line([this.value]);
                return;
                //return {"call":"add", "val":this.value};
            }
            query_graph.remove_line(this.value);
            //return {"call":"remove", "val":this.value};
        })//.get();



    });


    editable_table.init();



       

    $(document).on("click", ".add_data_button", function(){

      
        $(".modal_data_name_container").html('<input class="data_name_input_modal" type="text" name="data_name" placeholder="Data Name"><br>');


    });


    $(document).on("click", ".edit_button", function(){

        console.log(query_graph.get_data("Sun_Yang"));


        $(".modal_data_name_container").html('<input class="data_name_input_modal" type="text" name="data_name" placeholder="Data Name"><br>');






    });

    $(document).on('hidden.bs.modal', '#myModal', function (e) {
    // do something…
    // 
        $(".red").remove();
        editable_table.init();
     console.log("EDIT CLOSED");

    })




});

