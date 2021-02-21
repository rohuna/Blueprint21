



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

