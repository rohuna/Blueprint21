var form = document.getElementById("missingperson")



form.addEventListener('submit', (e) => {
    e.preventDefault();

    var id= create_UUID()
    db.collection("users").doc(id).set({
        id: id,
        name: form["name"].value, 
        age: form["age"].value,
        email: form["email"].value,
        phone:  form["phone"].value
     })

      // Points to the root reference
var storageRef = firebase.storage().ref();

// Create the file metadata
var metadata = {
    contentType: 'image/jpeg'
  };

  var file =   form["img"].files[0];
   console.log(file);
  
  // Upload file and metadata to the object 'images/mountains.jpg'
  var uploadTask = storageRef.child(id + '/' + file.name).put(file, metadata);
  
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
        
      });
    }
  );

   // Upload file and metadata to the object 'images/mountains.jpg'
   var uploadTask = storageRef.child('missingpeople/' + file.name).put(file, metadata);
  
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
       getFaceDetectionBoundries(downloadURL).then(res => {
        db.collection("users").doc(id).update({
            faceid: res[0].faceId,
            imgurl: downloadURL
         }).then(resp => {
             location.href = "./home.html";
         });
       })
       
       });
     }
   );
})

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
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