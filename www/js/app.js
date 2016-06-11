global.math = require('mathjs');
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
var carchase = require("./carchase.js");



$("document").ready(function(){


    if($graph_type == "carchase"){

        console.log($graph_type);
        console.log($car_velocity);
        console.log($final_police_velocity);
        console.log($police_stationary_time);
        console.log($police_acceleration_time);
        $("#datasets").hide();
        $(".scale_buttons").hide();
        $(".carchase_value_inputs").show();

        

        //carchase creates a csv based on initial values 
        carchase.generate($car_velocity, $final_police_velocity, $police_stationary_time, $police_acceleration_time, function(files, point_of_col){
            query_graph.init(files,files,function(){
                console.log(files," Updated ", point_of_col);
                query_graph.setPointOfCollision(point_of_col);
            });
        });


    }else{



        var check_loaded = setInterval(function(){
            if($pre_load.length > 0){
                clearInterval(check_loaded);
                $init_available_data_sets = $.map($init_available_data_sets, function(el){return el;});
                query_graph.init($init_available_data_sets, $pre_load, updateLineOfBestFitFormula);
            }
        },500);



    }



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



    $(document).on("click", ".duplicate_button", function(e){

        e.preventDefault();
        
        var data_display_name = $(this).data("dataset_display_text");
        var data_name = $(this).data("dataset_name");
        var dir = $(this).data("dataset_directory");

        console.log(data_display_name, data_name, dir);

        var data = {};
        data['lti_id'] = $lti_id;
        data['user_id'] = $user_id;
        data['dir'] = dir;

        data['file_name'] = data_name;

         $.ajax({
                type: "POST",
                url: "scripts/duplicateCSV.php",
                data: data,
                success: function(response) {
                    
                    console.log("reddddddd");


                    var data_set_name = response;
                    var display_name = response.replace(/_/g, ' ');
                  //  var filename = response+".csv";

                    var file = {};
                    file["file_name"] = response+".csv";
                    file["directory"] = "user";

                    query_graph.init([file], [file], updateLineOfBestFitFormula);


//<li><a href="#" class="duplicate_button" data-dataset_display_text="'+display_name+'" data-dataset_name="'+data_set_name+'" data-dataset_directory="'+dir+'"><span class="fa fa-clone" aria-hidden="true"></span>&nbsp;&nbsp;&nbsp;Duplicate</a></li>
                    var edit_button  = '<div class="dropdown"> <button class="btn btn-sm btn-primary dropdown-toggle " type="button" data-toggle="dropdown"><i class="fa fa-bars" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Options <span class="caret"></span></button> <ul class="dropdown-menu options_menu"> <li><a href="#" class="edit_button" data-dataset_display_text="'+display_name+'" data-dataset_name="'+data_set_name+'" data-dataset_directory="'+dir+'" data-toggle="modal" data-target="#myModal" ><span class="fa fa-pencil" aria-hidden="true"></span>&nbsp;&nbsp;&nbsp;Edit</a></li>  <li class="divider"></li> <li><a href="#" class="delete_button" data-dataset_display_text="'+display_name+'" data-dataset_name="'+data_set_name+'" data-dataset_directory="'+dir+'"><span class="fa fa-trash" aria-hidden="true"></span>&nbsp;&nbsp;&nbsp;Delete</a></li> </ul> </div>';

                    $("#data_sets_table tbody").append('<tr class="'+data_set_name+'_row"><td>'+display_name+'</td><td><input class="data_to_load" type="checkbox" name="dataSets" value="'+data_set_name+'" checked></td><td><input class="trendline_to_load" type="checkbox" value="'+data_set_name+'" name="dataSets"><span class="trendline_formula_container" data-dataname="'+data_set_name+'"></span></td><td>'+edit_button+'</tr>');


                },
                error: function(error){
                    //console.log(error);
                }
            });
       

    });


    $(document).on("click", ".delete_button", function(e){

        e.preventDefault();
        
        var data_display_name = $(this).data("dataset_display_text");
        var data_name = $(this).data("dataset_name");
        var dir = $(this).data("dataset_directory");

        console.log(data_display_name, data_name, dir);

        var data = {};
        data['lti_id'] = $lti_id;
        data['user_id'] = $user_id;
        data['dir'] = dir;
        data['file_name'] = data_name;

        $.ajax({
            type: "POST",
            url: "scripts/deleteCSV.php",
            data: data,
            success: function(response) {

                var data_set_row_name = response+"_row";
                var data_set_name = response;

                query_graph.hide_data([data_set_name]);

                $("."+data_set_row_name).remove();

            },
            error: function(error){
                //console.log(error);
            }
        });
       

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

            var dir = filename["directory"];
            //<li><a href="#" class="duplicate_button" data-dataset_display_text="'+display_name+'" data-dataset_name="'+data_set_name+'" data-dataset_directory="'+dir+'"><span class="fa fa-clone" aria-hidden="true"></span>&nbsp;&nbsp;&nbsp;Duplicate</a></li> <li class="divider"></li>
            var edit_button  = '<div class="dropdown"> <button class="btn btn-sm btn-primary dropdown-toggle " type="button" data-toggle="dropdown"><i class="fa fa-bars" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Options <span class="caret"></span></button> <ul class="dropdown-menu options_menu"> <li><a href="#" class="edit_button" data-dataset_display_text="'+display_name+'" data-dataset_name="'+data_set_name+'" data-dataset_directory="'+dir+'" data-toggle="modal" data-target="#myModal" ><span class="fa fa-pencil" aria-hidden="true"></span>&nbsp;&nbsp;&nbsp;Edit</a></li> <li><a href="#" class="delete_button" data-dataset_display_text="'+display_name+'" data-dataset_name="'+data_set_name+'" data-dataset_directory="'+dir+'"><span class="fa fa-trash" aria-hidden="true"></span>&nbsp;&nbsp;&nbsp;Delete</a></li> </ul> </div>';

            if(state == "added"){
                $("#data_sets_table tbody").append('<tr class="'+data_set_name+'_row"><td>'+display_name+'</td><td><input class="data_to_load" type="checkbox" name="dataSets" value="'+data_set_name+'" checked></td><td><input class="trendline_to_load" type="checkbox" value="'+data_set_name+'" name="dataSets"><span class="trendline_formula_container" data-dataname="'+data_set_name+'"></span></td><td>'+edit_button+'</tr>');
            }else if(state == "edited"){
                console.log("WOIAHHHH: ",$("input.data_to_load[value="+data_set_name+"]"));
                $("input.data_to_load[value="+data_set_name+"]").prop("checked", "true");
                //console.log("UPDATED");
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

