// A codepen example from https://codepen.io/ashblue/pen/mCtuA

var $TABLE = $('#table');
var $BTN = $('#export-btn');
var $EXPORT = $('#export');

var numOfRows = 0;
var enableAutoGenerate = false;




module.exports = {
  init:function(){
    removeAllRows();
    addRows(2);
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

   // console.log($($(tr[0]).find("td")[0]).text("valuemyrowdit"));
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

    lint();
}

function lint(){


    var numInvalid = 0;

    $('[contenteditable]').each(function(ind,obj){


         if(!$.isNumeric(+$(obj).text()) && $(obj).text().length > 0){
           numInvalid++;
           $(obj).addClass("invalid");
           $(obj).removeClass("valid");
         }

        if($.isNumeric(+$(obj).text()) && $(obj).text().length > 0){

           $(obj).addClass("valid");
           $(obj).removeClass("invalid");
         }

    
    });

    if(numInvalid == 0 && $(".data_name_input_modal").val().length > 0){
      $(".addexport_buttons").prop("disabled", false);
    }else{
      $(".addexport_buttons").prop("disabled", true);
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
