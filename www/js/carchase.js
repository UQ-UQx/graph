
module.exports = {
  generate:function(car_velocity, final_police_velocity, police_stationary_time, police_acceleration_time, callback){

    complie(car_velocity, final_police_velocity, police_stationary_time, police_acceleration_time, callback);
  }


}


var point_of_col = {};



function complie(car_velocity, final_police_velocity, police_stationary_time, police_acceleration_time, callback){


var loaded_files = [];
    var num_of_datapoints = 0;


    var car_vel_ms = car_velocity/3.6;
    var pol_vel_ms = final_police_velocity/3.6;
    var pol_acc_mss = pol_vel_ms/police_acceleration_time;
    var dis = math.eval("0.5 * "+pol_acc_mss+" * ("+(police_acceleration_time-1)+" ^ 2)");

    //console.log( car_vel_ms, pol_vel_ms, pol_acc_mss);




    if(car_vel_ms > pol_vel_ms){
        num_of_datapoints = 250;
    }


    var did_not_meet = true;

    var time = 0;
    var pol_temp_time = 1;
    var num_of_extra_points = 0;
    var extra_points = 0;

    var police = [];
    var car = [];

    while(did_not_meet){

        var car_dis = car_vel_ms*time;
        var pol_dis = 0;

        if(time > 5 && time < police_acceleration_time+5){

            pol_time = time - 5;
            pol_dis = math.eval("0.5 * "+pol_acc_mss+" * ("+pol_time+" ^ 2)");

        }else if(time >= police_acceleration_time+5){
            pol_term_dis = math.eval("0.5 * "+pol_acc_mss+" * ("+(police_acceleration_time-1)+" ^ 2)");

            pol_dis = (pol_vel_ms*pol_temp_time)+pol_term_dis;

            pol_temp_time++;

        }

        if((car_vel_ms > pol_vel_ms) && time > 250){
            did_not_meet = false;
        }

        if(pol_dis > car_dis){

            if(extra_points == 0){
                num_of_extra_points = Math.ceil(0.1*time+1);
                //console.log("extra",num_of_extra_points);

                point_of_col["time"] = time;
                point_of_col["police_distance"] = pol_dis;
                point_of_col["car_distance"] = car_dis;
                point_of_col["total_time"] = time + num_of_extra_points-1;
            }


            extra_points++;
            if(extra_points == num_of_extra_points){
                did_not_meet = false;
            }
        }


        var police_data_point = {};
        var car_data_point = {};

        pol_dis = pol_dis.toFixed(2);
        car_dis = car_dis.toFixed(2);

         police_data_point["Time"] = time;
         police_data_point["Distance"] = pol_dis;
         car_data_point["Time"] = time;
         car_data_point["Distance"] = car_dis;



        police.push(police_data_point);
        car.push(car_data_point);

        time++;
    }


    //console.log(police);
    generateCSV("police", police, function(file){

        loaded_files.push(file);


        if(loaded_files.length == 2){
            callback(loaded_files, point_of_col);
        }

    });
    generateCSV("car", car, function(file){

        loaded_files.push(file);

        if(loaded_files.length == 2){
            callback(loaded_files, point_of_col);
        }

    });

}




function generateCSV(data_name, data, callback){

    
    //console.log(data);

    //console.log(ConvertToCSV(data));

    var csv_data_string = ConvertToCSV(data);

    //console.log(csv_data_string);

    var csv_data = {};

    csv_data["filename"] = data_name+".csv";
    csv_data["csvstring"] = csv_data_string;
    csv_data['lti_id'] = $lti_id;
    csv_data['user_id'] = $user_id;

    $.ajax({
        type: "POST",
        url: "scripts/generateCSV.php",
        data: csv_data,
        success: function(response) {

            //console.log(response);

            if(response == "success"){


               // query_graph.init([filename], [filename]);
               // 
               file = {};
               file["file_name"] = data_name+".csv";
               file["directory"] = "user";
               callback(file);

            }

        },
        error: function(error){
           


        }
    });



}


function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = $x_axis+","+$y_axis+ '\r\n';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}


