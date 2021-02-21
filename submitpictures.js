var form = document.getElementById("uploadpics")

form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Points to the root reference
var storageRef = firebase.storage().ref();

// Create the file metadata
var metadata = {
    contentType: 'image/jpeg'
  };

  var file =   form["img"].files[0];
   console.log(file);












var isMatched = false;
var matchedId;

  
  // Upload file and metadata to the object 'images/mountains.jpg'
  var uploadTask = storageRef.child('otherphotos/' + file.name).put(file, metadata);
  
  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, 
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
  
        // ...
  
        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    }, 
    () => {
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {

        
        db.collection("users").get().then(function(querySnapshot) {querySnapshot.forEach(user => {
            if(user.data().faceid)
            {   
                var ids = [];
                console.log(getFaceDetectionBoundries(downloadURL))
                getFaceDetectionBoundries(downloadURL).then(res => {
                  res.forEach(face => {
                    ids.push(face.faceId)
                })
                console.log(user.data().faceid, ids)
                axios.post('https://westus.api.cognitive.microsoft.com/face/v1.0/findsimilars', {  faceId: user.data().faceid,
                "faceIds": ids,
                "maxNumOfCandidatesReturned": 10,
                "mode": "matchPerson"
             }, {
                    headers: {
                        "Ocp-Apim-Subscription-Key": "a3d063cedf564fb990de3b2d434238fd",
                        "Content-Type": "application/json"
                    }
                  }).then(res => {
                    console.log(res)
                     isMatched = true;
                     matchedId = user.data().faceid;

                     var matched = document.getElementById("matched");
                     matched.innerHTML = `<h3 style = "color: green"> Missing Person Found! </h3>
                                 <img src = ${user.data().imgurl} style = "width: 200px">
                                    <h1>Missing Person Info:</h1>
                                    <p><b>Name:</b> ${user.data().name}</p>
                                    <p><b>Age:</b> ${user.data().age}</p>
                                    <h1>Contact Information:</h1>
                                    <p><b>Phone Number:</b> ${user.data().phone}</p>
                                    <p><b>Email:</b> ${user.data().email}</p>`
                     

                    
                  });

                  setTimeout(function(){  }, 8000)
                })
            
                
                
                console.log(ids)


            }

            
        })
        
    });

        

        
      });
    }
  );
  



})

async function getFaceDetectionBoundries(imageURL)
{
  const res = await axios.post('https://rohunfacerec.cognitiveservices.azure.com/face/v1.0/detect?detectionModel=detection_02&returnFaceId=true&returnFaceLandmarks=false', { url: imageURL }, {
    headers: {
        "Ocp-Apim-Subscription-Key": "a3d063cedf564fb990de3b2d434238fd",
        "Content-Type": "application/json"
    }
  });
  return res.data;
}

async function getFaceDetectionBoundries(imageURL)
{
  const res = await axios.post('https://rohunfacerec.cognitiveservices.azure.com/face/v1.0/detect?detectionModel=detection_02&returnFaceId=true&returnFaceLandmarks=false', { url: imageURL }, {
    headers: {
        "Ocp-Apim-Subscription-Key": "a3d063cedf564fb990de3b2d434238fd",
        "Content-Type": "application/json"
    }
  });
  return res.data;
}