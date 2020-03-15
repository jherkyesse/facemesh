import React, { useState, useEffect, useRef } from 'react'
import * as facemesh from '@tensorflow-models/facemesh'
import FFFFFF from 'assets/FFFFFF.png'
import 'scss/main.scss'
// import Stats from 'stats.js'

const VIDEO_SIZE = 500
// const stats = new Stats()

export default () => {
  const canvasRef = useRef()
  const videoRef = useRef()
  // const userRef = useRef()
  const bgRef = useRef()
  const [ctx, setCtx] = useState()
  const [model, setModel] = useState()
  const [video, setVideo] = useState()
  const [canvas, setCanvas] = useState()
  const [whiteBg, setWhiteBg] = useState()
  
  const load = async () => {
    const model = await facemesh.load()
    await setWhiteBg(bgRef.current)
    await setVideo(videoRef.current)
    await setCanvas(canvasRef.current)
    setModel(model)
  }

  const predict = async () => {
    // stats.begin()
    const predictions = await model.estimateFaces(video)

    ctx.drawImage(whiteBg, 0, 0, VIDEO_SIZE, VIDEO_SIZE)
    if (predictions.length > 0) {
      for (let i = 0; i < predictions.length; i++) {
        const keypoints = predictions[i].scaledMesh
        for (let i = 0; i < keypoints.length; i++) {
          const [x, y, z] = keypoints[i]
          ctx.beginPath()
          ctx.arc(x, y, 1, 0, 2 * Math.PI)
          ctx.fill()
        }
      }
    }
    // stats.end()
    requestAnimationFrame(predict)
  }

  const enableCamera = async () => {
    if (window.navigator.mediaDevices) {
      const video = videoRef.current
      let stream = await window.navigator.mediaDevices.getUserMedia({
        'audio': false,
        'video': {
          facingMode: 'user',
          width: VIDEO_SIZE,
          height: VIDEO_SIZE
        },
      })
      video.srcObject = stream
    }
  }

  useEffect(() => {
    enableCamera()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      setCtx(canvas.getContext('2d'))
    } else {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
      ctx.strokeStyle = '#32EEDB'
      ctx.lineWidth = 0.5
    }
  }, [canvasRef])

  useEffect(() => {
    if (model) predict()
  }, [model])

  return (
    <>
      <input type='file' accept='image/*;capture=camera' className='d-none' />
      {/* <img ref={userRef} /> */}
      <img ref={bgRef} width={VIDEO_SIZE} height={VIDEO_SIZE} src={FFFFFF} className='d-none' />
      <canvas ref={canvasRef} width={VIDEO_SIZE} height={VIDEO_SIZE} />
      <video ref={videoRef} autoPlay onLoadedMetadata={() => load()} className='d-none' />
    </>
  )
}
