// Set constraints for the video stream
var constraints = { video: { facingMode: "environment" }, audio: false };

//Initialize the Html5Qrcode class
const html5QrCode = new Html5Qrcode("camera");

//Add event listener for the camera button to toggle qr-code scanning on/off
document.getElementById("scanSample").onclick = function () {
  var x = document.getElementById("camera");
  if (x.style.display === "none") {
    //Start camera
    cameraStart();
    x.style.display = "block";
  } else {
    //Stop the camera
    html5QrCode.stop();
    x.style.display = "none";
  }
}

//Add event listener for the image button to initiate look up of available SAMPLE_IMAGE tests
document.getElementById("uploadImage").onclick = function () {
  //check if we even have a value in the sample input
  let sampleId = document.getElementById("sampleId").value;
  //alert('sample id' + sampleId);
  if (sampleId.trim() == '') {
    alert("Please Scan or Enter a Sample ID");
  } else {
    //Determine how many images results need to be displayed by clicking a hidden visual workflow button that will call a subroutine QR_CODE_RESULT_SEARCH

    //TESTING THE JAVASCRIPT NEEDED TO APPEND A PLACE AN IMAGE CAN BE UPLOADED
    //var imageDiv = document.getElementById("imagesToUpload");
    //$("<div class='row image'><div class='col'><div class='card'><div class='card-body'><div class='card-text text-right' onclick='deletePreviewFile(this)'><smallclass='text-muted'><i class='fas fa-trash'></i></small></div><div class='card-text text-left'><input type='file' accept='image/*' onchange='previewFile(this)'></div><img class='img-upload card-img-top' src='#' alt='Card image cap'></div></div></div></div>").appendTo(imageDiv);
  }
} 

//Add event listener for the submit button to initiate pushing the base 64 data to LIMS
document.getElementById("submitImages").onclick = function () {

  //Determine the valid images to upload by clicking a hidden visual workflow button that will call a subroutine QR_CODE_RESULT_SUBMIT

  // TESTING THE JAVASCRIPT NEEDED TO FIND ALL THE IMAGES THAT HAVE VALID CONTENT
  // let imagesArr = document.getElementById("imagesToUpload").children;
  // for (let i = 0; i < imagesArr.length; i++) {
  //   let imageSrc = imagesArr[i].querySelector('img').getAttribute('src');
  //   if (imageSrc != '#') {
  //     alert(imageSrc);
  //   }
  // }
} 


//Function called on the onChange event for file input
//Function finds the closest img element, gets the uploaded file, and sets it as the img source
function previewFile(node) {
  const preview = $(node).parents(".card-body").find(".img-upload")[0]
  const file = node.files[0];
  const reader = new FileReader();
  
    reader.addEventListener("load", function () {
      // convert image file to base64 string
      preview.src = reader.result;

    }, false);
  
    if (file) {
      reader.readAsDataURL(file);
    }
  }


//Function called on the onClick event for the div that surrounds the trash icon
//Function finds the closest img element and clears the img source
function deletePreviewFile(obj) {
  var image = $(obj).parents(".card-body").find("img").attr("src", "");
  var fileInput = $(obj).parents(".card-body").find("input[type=file]").val("");
}


// Access the device camera and stream to cameraView
function cameraStart() {
  navigator.mediaDevices
    .getUserMedia(constraints) //Get the camera based on the constraints set above
    .then(function (stream) {
      const tracks = stream.getVideoTracks();
      const deviceId = tracks.length && tracks[0].getCapabilities().deviceId; //Assume they have only one environment facing camera
      const cameraToUse = deviceId;

      //If we found an acceptable camera to use, start the camera
      if (cameraToUse !== 0) {
        //alert("starting the camera" + cameraToUse);
        html5QrCode.start(
          cameraToUse,     // retreived in the previous step.
          {
            fps: 10,    // sets the framerate to 10 frame per second
            //qrbox: 250  // sets only 250 X 250 region of viewfinder to
            // scannable, rest shaded.
          },
          qrCodeMessage => {
            //Once we get a successful scan, stop and hide the camera
            html5QrCode.stop();
            document.getElementById("camera").style.display = "none";
            //Update the Sample ID input field with the scanned code
            document.getElementById("sampleId").value = qrCodeMessage;

            //Clear the the current images for a previous sample
            document.getElementById("imagesToUpload").innerHTML = "";
          },
          errorMessage => {
            // parse error, ideally ignore it. For example:
            //console.log(`QR Code no longer in front of camera.`);
          })
          .catch(err => {
            // Start failed, handle it. For example,
            console.log(`Unable to start scanning, error: ${err}`);
          });
      } else {
        alert("Could not find videoinput device")
      }
    })
    .catch(function (error) {
      console.error("Oops. Something is broken.", error);
    });
}

//Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);