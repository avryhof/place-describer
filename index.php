<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <title>Untitled Document</title>
    
    <link href="style.css?v=<?= filemtime("style.css"); ?>" rel="stylesheet">
    
    <script type="text/javascript" charset="utf-8" src="PhoneGap.js"></script>
    
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body>
	
    <div class="container">
    	<div class="row">
        	<div class="col-xs-12 text-center">
            	<div id="camera">
    				<button class="btn btn-primary" onclick="capturePhoto();">Capture Photo</button>
 
    				<div style="text-align:center;margin:20px;">
        				<img id="cameraPic" src="" style="width:auto;height:120px;"></img>
    				</div>
				</div>
            </div>
        </div>
    </div>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
    <script>
		function capturePhoto(){
			navigator.camera.getPicture(uploadPhoto,null,{sourceType:1,quality:60});
		}
		
		function uploadPhoto(data){
			// this is where you would send the image file to server
		 
			//output image to screen
			cameraPic.src = "data:image/jpeg;base64," + data;
			navigator.notification.alert(
				'Your Photo has been uploaded', // message
				okay,                           // callback
				'Photo Uploaded',               // title
				'OK'                            // buttonName
			);
			
			if (failedToUpload){
				navigator.notification.alert(
					'Your Photo has failed to upload',
					failedDismissed,
					'Photo Not Uploaded',
					'OK'
				);
			} 
		}
		
		function okay(){
			// Do something
		}
	</script>
</body>
</html>