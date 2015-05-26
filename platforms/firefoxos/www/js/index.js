/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
var pictureSource;   // picture source
var destinationType; // sets the format of returned value

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
		pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
		mygeo.initialize();
		$("#submitButton").click(function(e) {
            e.preventDefault();
			$.ajax({
				url: 'http://councilofparkfriends.org/api/placed.php',
				type: 'POST',
				data: {
					randomNumber: Math.random(),
					action: 'save',
					title: $("#title").val(),
					desc: $("#desc").val(),
					lat: $("#lat").val(),
					lon: $("#lon").val(),
					image: $("#largeImage").attr("src")
				},
				success: function(data){
					console.log(data);
					myalert.message("Place Saved.","Success!");
				},
				error: function(){
					console.log(data);
					alert('There was an error adding your comment');
				}
			});
        });
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
		/*
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
		*/

        /*
		listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
		*/

        console.log('Received Event: ' + id);
    }
};

app.initialize();

var mycam = {
	photoquality: 70,
	largeImage: document.getElementById('largeImage'),
	// Called when a photo is successfully retrieved
    onPhotoDataSuccess: function  (imageData) {
		// Show the captured photo
		// The inline CSS rules are used to resize the image
		this.largeImage.src = "data:image/jpeg;base64," + imageData;
    },
	onPhotoFileSuccess: function (imageData) {
		// Get image handle
		console.log(JSON.stringify(imageData));
		// Show the captured photo
		// The inline CSS rules are used to resize the image
		this.largeImage.src = imageData;
    },
	// Called when a photo is successfully retrieved
    onPhotoURISuccess: function (imageURI) {
		// Uncomment to view the image file URI 
		// console.log(imageURI);
		// Show the captured photo
		// The inline CSS rules are used to resize the image
		this.largeImage.src = imageURI;
    },
	capturePhoto: function() {
		// Take picture using device camera and retrieve image as base64-encoded string
		navigator.camera.getPicture(this.onPhotoDataSuccess, this.onFail, { 
			quality: this.photoquality,
			destinationType: destinationType.DATA_URL 
		});
    },
	// A button will call this function
    capturePhotoEdit: function () {
		// Take picture using device camera, allow edit, and retrieve image as base64-encoded string
      	navigator.camera.getPicture(this.onPhotoDataSuccess, this.onFail, { 
			quality: this.photoquality, 
			allowEdit: true,
			destinationType: destinationType.DATA_URL 
		});
    },
	// A button will call this function
    capturePhotoWithData: function () {
      	// Take picture using device camera and retrieve image as base64-encoded string
      	navigator.camera.getPicture(this.onPhotoDataSuccess, this.onFail, { 
	  		quality: this.photoquality 
		});
    },
	capturePhotoWithFile: function () {
        navigator.camera.getPicture(this.onPhotoFileSuccess, this.onFail, { 
			quality: this.photoquality, 
			destinationType: Camera.DestinationType.FILE_URI 
		});
    },
    // A button will call this function
    getPhoto: function (source) {
		// Retrieve image file location from specified source
		navigator.camera.getPicture(this.onPhotoURISuccess, this.onFail, { 
			quality: this.photoquality, 
			destinationType: destinationType.FILE_URI,
			sourceType: source 
		});
    },
	// Called if something bad happens.
    onFail: function (message) {
      	myalert.message('Failed because: ' + message,'Failure');
    }
};

var mygeo = {
	initialize: function() {
        navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError, { 
			maximumAge: 3000, 
			timeout: 5000, 
			enableHighAccuracy: true 
		});
    },
	onSuccess: function (position) {
		document.getElementById("lat").value = position.coords.latitude;
		document.getElementById("lon").value = position.coords.longitude;
	},
	onError: function (error) {
		myalert.message('code: ' + error.code + '\n' + 'message: ' + error.message,'Failure');
	}
};

var myalert = {
	alertDismissed: function () {
    	//alert("Alert dismissed");
	},
	message: function (messagetext, title, button) {
		navigator.notification.alert(
			messagetext,
			this.alertDismissed,
    		(!title ? '' : title),
    		(!button ? 'OK' : button)
		);
	}
};