



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



var html = "";
db.collection("users").get().then(snap => {
    var i = 0;
    snap.forEach(doc => {
        html += `<div class = "col-sm-4">
            <img src = ${doc.data().imgurl} style = "width: 80%; margin: 10%;">
            <h5>Name: ${doc.data().name } <br>Age: ${doc.data().age }</h5> </div>
        `
    })
    document.getElementById("gallery").innerHTML = html;
})

