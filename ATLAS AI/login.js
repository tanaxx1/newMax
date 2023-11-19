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
  let canvas
  canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const LabeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(LabeledFaceDescriptors, 0.6)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    if (canvas) canvas.remove
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)

    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box, {label : result.toString()})
      drawBox.draw(canvas)
    });
    
  }, 80000)
})


function loadLabeledImages() {
  const labels = ['Maximus']

  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 7; i++) {
        const img = await faceapi.fetchImage(`https://github.com/tanaxx1/Maxitems/tree/86b9e746b5ac2e9d9be3a00f1b073c89abc403a6/ATLAS%20AI/Maximus`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptors
        descriptions.push(detections.descriptions)
      }

      return new faceapi.LabeledFaceDescriptor(label, descriptions)
    })
  )
}