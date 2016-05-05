global.$ = global.jQuery = require("jquery");
require('bootstrap');
require('twbs-pagination');
var graph = require("./graph.js");
var buttons = require("./buttons.js");


$(document).ready(function(){

	$("body").css({

		//"background-color":graph.color()
	});

	buttons.init();

	console.log("Hello I think this is just right");

    $(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

    $('.poppy').popover();


     $('#pagination-demo').twbsPagination({
        totalPages: 35,
        visiblePages: 7,
        onPageClick: function (event, page) {
            $('#page-content').text('Page ' + page);
        }
    });
});