# Graph

# Installation 

### Development

1. Start MAMP/MAMP Pro apache server and point to the project directory or clone this project to your mamp's sites folder
2. Run the following command - 
> npm run start

3. Open your config.php and ensure that it has the configuration details as shown below 
4. Open your web browser to localhost/path/to/project

These steps will ensure that your js and css are being watched by grunt and will compile, minify and reload your browser on every time you save your changes. 

### Production

1. Run the following command - 
> npm run build

2. Open your config.php and ensure that it has the configuration details as shown below. 
These steps will ensure that your js and css are compiled, minified. 
3. Open inc/header.php and point to the minified js and css files for better performance



### Config.php
```php
<?php
	//Configuration File
	//key=>secret
	$config = array(
		'lti_keys'=>array(
			'YOUR_CLIENT_KEY'=>'YOUR_CLIENT_SECRET'
		),
		'use_db'=>true,
		'db'=>array(
			'driver'=>'mysql',
			'hostname'=>'localhost',
			'username'=>'YOUR_DB_USERNAME',
			'password'=>'YOUR_DB_PASSWORD',
			'dbname'=>'YOUR_DB_NAME',
		)
	);
?>
```

# Config Setup
1. Edit config.php with your respective LTI keys and optional database details
2. Host on a https server (LTI with edX requires HTTPS)
3. Add the respective keys in the edX advanced settings
4. Create a new LTI component and point it to the correct URL

That's it! you're done with the setup :)


# Usage
1. use test.php with LTI to confirm that everything is connecting
2. on each page, include <?php require_once('inc/header.php'); ?> at the top
3. to ensure valid LTI, make sure to run $lti->requirevalid(); directly after header.php
4. for production ensure that test flag is set to false in lib/lti.php

# Usage in edX platform - 

## Important Vaiables 

**LTI ID** : graph  
**LTI URL** : https://tools.ceit.uq.edu.au/graph  
**LTI Passports** : "graph:graph:****< PLEASE SEE UQx Tech team for this last bit >****"  

## Step 1:
Create you csv file that you wish to load for the student when they see the activity

[ your data file ].csv 

e.g.

| Year        | Time           |
| ------------- |:-------------:|
|1912|	82.2|
|1920|	73.6|
|1924|	72.4|
|1928|	71|
|1932|	66.8|
|1936|	65.9|
|1948|	66.3|

#### important: column headings are case sensitive 

## Step 2:

Upload The CSV to Files and Uploads on edX

Copy the ***WEB LINK***  
example: 
courses.edx.org/asset-v1:UQx+QUERY101x+1T2016+type@asset+block@Olympic_Swimming_100m_Women.csv

## Step 3:

***A:*** In Advanced Settings, please add "lti_consumer" to Advanced Module List (if not already added)

***B:*** In Advanced Settings, please add the lti passport details (see top of this page under "Important Variables") into LTI Passports


## Step 4:

create an LTI xBlock and using the Important Variables shown above, enter in the ***LTI ID*** and ***LTI URL***


## Step 5:
#### important custom parameters:

### upload 
This is used to specify which csv file/s the graph should use  
example:  

One file: 

`upload=courses.edx.org/asset-v1:UQx+QUERY101x+1T2016+type@asset+block@My_Data.csv`  

Multiple files:

`upload=courses.edx.org/asset-v1:UQx+QUERY101x+1T2016+type@asset+block@My_Data.csv,  courses.edx.org/asset-v1:UQx+QUERY101x+1T2016+type@asset+block@My_Data_B.csv`

>note that for multiple files, the urls are comma seperated

### pre_load
this variable is used to specify which data ***(file name/s of file/s that were uploaded in Step 5)*** should be loaded on the graph when the student is shown the activity

One file: 

`pre_load=My_Data.csv`  

Multiple files:

`pre_load=My_Data.csv,My_Data_B.csv`

>note that for multiple files, the filenames are comma separated


### graph_header
This is the heading the graph will display

`graph_header=My Awesome Graph`

### x_axis

This variable should reference the column heading in your CSV file

`x_axis=Year`
>#### important: column headings are case sensitive, match the heading in your csv file



### y_axis

This variable should reference the column heading in your CSV file

`y_axis=Time`

>#### important: column headings are case sensitive, match the heading in your csv file


### x_axis_display

This variable is used to define the label for the x_axis

`x_axis_display=x_axis_display`

### y_axis_display

This variable is used to define the label for the y_axis

`y_axis_display=y_axis_display`


### Combination of these custom paramerters will look like this -

`["upload=courses.edx.org/asset-v1:UQx+QUERY101x+1T2016+type@asset+block@My_Data.csv,  courses.edx.org/asset-v1:UQx+QUERY101x+1T2016+type@asset+block@My_Data_B.csv","pre_load=My_Data.csv,My_Data_B.csv",
"graph_header=My Awesome Graph",
"x_axis=Year",
"y_axis=Time",
"x_axis_display=x_axis_display",
"y_axis_display=y_axis_display"]`

## Step 6
Add the custom parameters to the custom paramertes input. 

example:  
`["upload=courses.edx.org/asset-v1:UQx+QUERY101x+1T2016+type@asset+block@My_Data.csv,  courses.edx.org/asset-v1:UQx+QUERY101x+1T2016+type@asset+block@My_Data_B.csv","pre_load=My_Data.csv,My_Data_B.csv",
"graph_header=My Awesome Graph",
"x_axis=Year",
"y_axis=Time",
"x_axis_display=x_axis_display",
"y_axis_display=y_axis_display"]`

## That's it! publish your changes and view in live version 

# Testing
For testing we recommend the LTI 1.1 testbed, available at: http://www.imsglobal.org/developers/LTI/test/v1p1/lms.php
