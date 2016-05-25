var graph = query_graph;
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
                        console.log(progress);

            console.log(data.files[0].name);
        },
        fail:function(e, data){
            // Something has gone wrong!
        }
    }).bind('fileuploaddone', function(e, data){




        var uploaded_files = [];
        var uploaded_filenames = [];
        $.each(data.files, function(ind, file){
            uploaded_files.push((file.name).substring(0,(file.name).length - 4));
            uploaded_filenames.push(file.name);
        })
        update_datasets(uploaded_files);
        graph.add_data(uploaded_filenames);
    });
    // Prevent the default action when a file is dropped on the window
    $(document).on('drop dragover', function (e) {
        e.preventDefault();
    });
    // Helper function that formats the file sizes
    // 
    function update_datasets(new_files){

        console.log(new_files);


        


        // $.each(new_files, function(ind, file){
        //     if($(".data_to_load[value='"+file+"']").length == 0){
        //         display_name = file.replace(/\_/g,' ');
        //         $("#datasets ul").append('<li><input class="data_to_load" type="checkbox" name="dataSets" value="'+file+'"> '+display_name+'</li>');
        //     }
        // });

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