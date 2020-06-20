// Set constraints for the video stream
var constraints = { video: { facingMode: "environment" }, audio: false };
// Define constants
// const cameraView = document.querySelector("#camera--view"),
//   cameraOutput = document.querySelector("#camera--output"),
//   cameraSensor = document.querySelector("#camera--sensor"),
//   cameraTrigger = document.querySelector("#camera--trigger");

  //Initialize the Html5Qrcode class
  const html5QrCode = new Html5Qrcode("camera");

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

// $("input[type=file]").change(function(){
//     alert($(this).val(""));
//     const reader = new FileReader();
//     reader.addEventListener("load", function () {
//       //     // convert image file to base64 string
//       //     //preview.src = reader.result;
    
//       //   }, false);
      
//       //   if (file) {
//       //     reader.readAsDataURL(file);
//       //   }

//     });
// })




document.getElementById("scanSample").onclick = function () {
  var x = document.getElementById("camera");
  if (x.style.display === "none") {
    cameraStart();
    x.style.display = "block";
  } else {
    //How can I stop the camera when they toggle it off
    html5QrCode.stop();
    x.style.display = "none";
  }
}

//delete image 
function deletePreviewFile(obj) {
  var image = $(obj).parents(".card-body").find("img").attr("src", "");
  //var image = $(obj).parent().prop('className');//.find('img').attr('src');
  console.log(image);
}

document.getElementById("uploadImage").onclick = function () {
  //check if we even have a value in the sample input
  let sampleId = document.getElementById("sampleId").value;
  alert('sample id' + sampleId);
  if (sampleId.trim() == '') {
    alert("Please scan or enter a sample Id");
  } else {
    //now we have show a bunch of file inputs for images
  }
} 


// Access the device camera and stream to cameraView
function cameraStart() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      const tracks = stream.getVideoTracks();
      const deviceId = tracks.length && tracks[0].getCapabilities().deviceId;
      const cameraToUse = deviceId;

      //if we found an acceptable camera to use, start the camera
      if (cameraToUse !== 0) {
        alert("starting the camera" + cameraToUse);
        html5QrCode.start(
          cameraToUse,     // retreived in the previous step.
          {
            fps: 10,    // sets the framerate to 10 frame per second
            //qrbox: 250  // sets only 250 X 250 region of viewfinder to
            // scannable, rest shaded.
          },
          qrCodeMessage => {
            // do something when code is read. For example:
            // console.log(`QR Code detected: ${qrCodeMessage}`);
            html5QrCode.stop();
            alert('scanned code is ' + qrCodeMessage);
            document.getElementById("sampleId").value = qrCodeMessage;
            document.getElementById("camera").style.display = "none";

            
            

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

      // track = stream.getTracks()[0];
      // cameraView.srcObject = stream;

    })
    .catch(function (error) {
      console.error("Oops. Something is broken.", error);
    });
}

//Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);