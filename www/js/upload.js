/**
 *
 * 	Basic file upload feature
 * 
 */
$(function(){
    $('#drop a').click(function(){
        // Simulate a click on the file input button
        // to show the file browser dialog
        $(this).parent().find('input').click();
    });
    // Initialize the jQuery File Upload plugin
    $('#upload').fileupload({
        // This element will accept file drag/drop uploading
        dropZone: $('#drop'),
        // This function is called when a file is added to the queue;
        // either via the browse button, or via drag/drop:
        add: function (e, data) {
            // Automatically upload the file once it is added to the queue
            var jqXHR = data.submit();
        },
        progress: function(e, data){
            // Calculate the completion percentage of the upload
            var progress = parseInt(data.loaded / data.total * 100, 10);
            console.log(data.files[0].name);
        },
        fail:function(e, data){
            // Something has gone wrong!
        }
    }).bind('fileuploaddone', function(e, data){
        var user_id = $(e.target).find("input[name='user_id']").val();
        var lti_id = $(e.target).find("input[name='lti_id']").val();
        var data = {'data':{}};
        data['user_id'] = user_id;
        data['lti_id'] = lti_id;
        data['func'] = "get_filesnames";
        $.ajax({
          type: "POST",
          url: "scripts/available_files.php",
          data: data,
          success: function(response) {
            //response is an array of file names
            
            update_datasets(response);
          },
          error: function(error){
              console.log(error);
          }
        });
    });
    // Prevent the default action when a file is dropped on the window
    $(document).on('drop dragover', function (e) {
        e.preventDefault();
    });
    // Helper function that formats the file sizes
    // 
    function update_datasets(uploaded_files){

      console.log(uploaded_files);
      //run ajax call to get current list of files
      //push that list out
      $("#datasets ul").empty();

      $.each(uploaded_files, function(ind, obj){

        $("#datasets ul").append('<li><input class="data_to_load" type="checkbox" name="dataSets" value="'+obj+'"> '+obj+'</li>');

      });
      
    }
    function formatFileSize(bytes) {
        if (typeof bytes !== 'number') {
            return '';
        }
        if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2) + ' GB';
        }
        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
        }
        return (bytes / 1000).toFixed(2) + ' KB';
    }
});