// A codepen example from https://codepen.io/ashblue/pen/mCtuA
// Modified by Ankith Konda 2016

var $TABLE = $('#table');
var $BTN = $('#export-btn');
var $EXPORT = $('#export');

var numOfRows = 0;
var enableAutoGenerate = false;


// added -> adding new dataset
// edited -> editing existing dataset
// 
var state = "";

var data = {};
data['lti_id'] = $lti_id;
data['user_id'] = $user_id;
data['func'] = "get_filesnames_from_script";
data['path'] = "../";









setInterval(function () {
    if($(".data_name_input_modal")){


        if($.trim($(".data_name_input_modal").val()).length == 0){

            $(".data_name_input_modal").removeClass("input_valid");
            $(".data_name_input_modal").addClass("input_invalid");

            $(".error_span").text("Please enter a name for your new data set")



        }else{

            $.ajax({
                type: "POST",
                url: "scripts/available_files.php",
                data: data,
                success: function(response) {

                    var lower_response = $.map(response,function(item, index) {
                                                        return item.toLowerCase();
                                         });

                    var requested_name = $(".data_name_input_modal").val().split(' ').join('_')+".csv";
                    var requested_name_lower = requested_name.toLowerCase();

                    if($.inArray(requested_name_lower, lower_response) != -1){
                        $(".data_name_input_modal").removeClass("input_valid");
                        $(".data_name_input_modal").addClass("input_invalid");
                        $(".error_span").text(requested_name+" is already in use");

                    }else{

                        $(".data_name_input_modal").removeClass("input_invalid");
                        $(".data_name_input_modal").addClass("input_valid");
                        $(".error_span").text("Please enter data for "+requested_name);

                    }

                },
                error: function(error){
                    console.log(error);
                }
            });

            
        }
    }
}, 100);


module.exports = {
  init:function(){
    removeAllRows();
    addRows(2);
    state = "added";
  },
  generateTable:function(data){
    console.log(data);

    
    removeAllRows();

    addRows(data.length);

    rows = 0;

    $.each(data, function(ind,datapoint){
        console.log(ind);
        var tr = $TABLE.find('tr.row_'+ind);
        $($(tr[0]).find("td")[0]).text(datapoint[$x_axis]);
        $($(tr[0]).find("td")[1]).text(datapoint[$y_axis]);
    });

    lint();

    state = "edited";

   // console.log($($(tr[0]).find("td")[0]).text("valuemyrowdit"));
  },
  getData:function(){

    return [state, getJSON()];
  }
}

function removeAllRows(){

    $(".myrow").remove();
    numOfRows = 0;
}
function addRows(num_of_rows){

    for (var i = 0; i < num_of_rows; i++) {

        var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line').addClass("myrow row_"+numOfRows);
        numOfRows++;

        $TABLE.find('table').append($clone);

    }

    var d = $('.table-editable');
    d.scrollTop(d.prop("scrollHeight"));


    lint();
}

function lint(){


    console.log("linting");
    var numInvalid = 0;

    $('[contenteditable]').each(function(ind,obj){

        if(!$(obj).parent().hasClass("hide")){

             if(!$.isNumeric(+$(obj).text()) || $(obj).text().length == 0){
                console.log($(obj).parent());
               numInvalid++;
               $(obj).addClass("invalid");
               $(obj).removeClass("valid");
             }

            if($.isNumeric(+$(obj).text()) && $(obj).text().length > 0){

               $(obj).addClass("valid");
               $(obj).removeClass("invalid");
             }

        }
    });



        console.log(numInvalid);

    if(numInvalid == 0 && $(".data_name_input_modal").val().length > 0){


      $(".addexport_buttons").prop("disabled", false);
      $(".error_span").css("display", "none");

    }else{
      if($(".data_name_input_modal").val().length == 0){
            $(".error_span").text("Please enter a name for your new data set")

      }else if(numInvalid == 0){
            //$(".error_span").text("Please enter data")

      }
      $(".addexport_buttons").prop("disabled", true);
      $(".error_span").css("display", "block");

    }




}

$(document).on("focus",'[contenteditable]', function() {

        if(enableAutoGenerate){
          if($(this).parent().attr("class") == "myrow row_"+numOfRows){
            addRows(1);
          }
        }

}).on('blur keyup paste input', ['[contenteditable]', '.data_name_input_modal'], function() {


    lint();


});

$('.table-add').click(function () {
    addRows(1);
});

$('.table-remove').click(function () {
  $(this).parents('tr').detach();
   numOfRows--;
   lint();

});

$('.table-up').click(function () {
  var $row = $(this).parents('tr');
  if ($row.index() === 1) return; // Don't go above the header
  $row.prev().before($row.get(0));
});

$('.table-down').click(function () {
  console.log("myrow")
  var $row = $(this).parents('tr');
  $row.next().after($row.get(0));
});

// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;



$BTN.click(function () {
  var $rows = $TABLE.find('tr:not(:hidden)');
  var headers = [];
  var data = [];
  
  // Get the headers (add special header logic here)
  $($rows.shift()).find('th:not(:empty)').each(function () {
    var header = "";
    if($(this).text() == $x_axis_display_text){
      header = $x_axis;
    }
    if($(this).text() == $y_axis_display_text){
      header = $y_axis;
    }

    headers.push(header);
  });
  
  // Turn all existing rows into a loopable array
  $rows.each(function () {
    var $td = $(this).find('td');
    var h = {};
    
    // Use the headers from earlier to name our hash keys
    headers.forEach(function (header, i) {
      h[header] = $td.eq(i).text();   
    });
    
    data.push(h);
  });
  
  // Output the result
  $EXPORT.text(JSON.stringify(data));
});



function getJSON(){

  var $rows = $TABLE.find('tr:not(:hidden)');
  var headers = [];
  var data = [];

  var data_name = $(".data_name_input_modal").val().split(' ').join('_');
  
  // Get the headers (add special header logic here)
  $($rows.shift()).find('th:not(:empty)').each(function () {
    var header = "";
    if($(this).text() == $x_axis_display_text){
      header = $x_axis;
    }
    if($(this).text() == $y_axis_display_text){
      header = $y_axis;
    }

    headers.push(header);
  });
  
  // Turn all existing rows into a loopable array
  $rows.each(function () {
    var $td = $(this).find('td');
    var h = {};
    
    // Use the headers from earlier to name our hash keys
    
    headers.forEach(function (header, i) {
      h[header] = $td.eq(i).text(); 
      h["data_set"] =  data_name; 
    });
    
    data.push(h);
  });
  
  // Output the result
  return data;


}


