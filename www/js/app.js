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
		if($pre_load.length > 0){
			clearInterval(check_loaded);
            $init_available_data_sets = $.map($init_available_data_sets, function(el){return el;});
			query_graph.init($init_available_data_sets, $pre_load, updateLineOfBestFitFormula);
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







       

    $(document).on("click", ".add_data_button", function(){

      

        $(".modal_data_name_container").html('<input class="data_name_input_modal" type="text" name="data_name" placeholder="Data Name"><br>');
        $(".add_button span").text("Add To Graph");

        editable_table.init();

    });


    $(document).on("click", ".edit_button", function(){

        
        var data_display_name = $(this).data("dataset_display_text");
        var data_name = $(this).data("dataset_name");

         $(".modal_data_name_container").html('<input class="data_name_input_modal" type="text" name="data_name" placeholder="Data Name" value="'+data_display_name+'" readonly><br>');
        $(".add_button span").text("Update Data");

        editable_table.generateTable(query_graph.get_data(data_name));

    });

    $(document).on('hidden.bs.modal', '#myModal', function (e) {
    // do something…

    });

    $(document).on('shown.bs.modal', '#myModal', function (e) {
    // do something…
    // 
             $('#myModaltrigger').one('focus', function(e){$(this).blur();});


    });


    $(document).on('click', ".add_button", function(e){


       editable_table.generate_csv(function(filename, display_name, data_set_name, state){
            console.log("all done", filename, display_name, data_set_name);
            query_graph.init([filename], [filename], updateLineOfBestFitFormula);

            if(state == "added"){
                $("#data_sets_table tbody").append('<tr><td>'+display_name+'</td><td><input class="data_to_load" type="checkbox" name="dataSets" value="'+data_set_name+'" checked></td><td><input class="trendline_to_load" type="checkbox" value="'+data_set_name+'" name="dataSets"><span class="trendline_formula_container" data-dataname="'+data_set_name+'"></span></td><td><button type="button" class="btn btn-info btn-sm edit_button" data-dataset_display_text="'+display_name+'" data-dataset_name="'+data_set_name+'" data-toggle="modal" data-target="#myModal"><i class="fa fa-pencil" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Edit</button></td></tr>');
            }
       });



    });


    $('#myModal').on('shown.bs.modal', function(e){
        $('#myModaltrigger').one('focus', function(e){$(this).blur();});
    });


    function updateLineOfBestFitFormula(cached_data){

        var formulas = query_graph.get_line_of_best_fit_formulas(cached_data);



        $.each(cached_data, function(ind, data_name){


           // console.log()
            if(formulas[data_name]){
                var m = formulas[data_name][0].toFixed(2);
                var c = formulas[data_name][1].toFixed(2);
                $(".trendline_formula_container[data-dataname="+data_name+"]").html("&nbsp;&nbsp;<b>y</b> = "+m+" <b>x</b> + "+c);
                $(".trendline_to_load[value="+data_name+"]").show();
            }else{
                $(".trendline_formula_container[data-dataname="+data_name+"]").html("");
                $(".trendline_to_load[value="+data_name+"]").hide();

            }
            


        });
        
    }






});

