const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', async () => {
  const LabeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(LabeledFaceDescriptors, 0.6)
  
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)

    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    console.log(results);
  }, 8000)
})


function loadLabeledImages() {
  const labels = ['Maximus']

  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 7; i++) {
        const img = await faceapi.fetchImage(`https://tanaxx1.github.io/atlas/Maximus`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptors()
        descriptions.push(detections.descriptions)
      }

      return new faceapi.LabeledFaceDescriptor(label, descriptions)
    })
  )
}