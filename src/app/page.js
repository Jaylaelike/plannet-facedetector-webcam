"use client"
import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import Webcam from 'react-webcam';


export default function Home() {
  const [imageFile, setImageFile] = useState(null);
  const [faceImage, setFaceImage] = useState('');
  const [modelLoaded, setModelLoaded] = useState(false);
  const webcamRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'), // Change '/models' to the path of your face-api.js models
      ]);
      setModelLoaded(true);
    };
    console.log(modelLoaded)
    loadModels();
  }, []);




  const captureImage = async () => {
    if (!modelLoaded || !webcamRef.current) {
      return; // Model not loaded or webcam not accessible
    }

    const imageSrc = webcamRef.current.getScreenshot();
    await processImage(imageSrc);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const imageSrc = reader.result;
      await processImage(imageSrc);
    };

    reader.readAsDataURL(file);
  };


  const processImage = async (imageSrc) => {
    const image = await faceapi.fetchImage(imageSrc);

    const detection = await faceapi.detectSingleFace(image);
    console.log(detection);

    if (!detection) {
      console.log("Not Face Deteion !!!");
      return;
    }

    const { x, y, width, height } = detection.box;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(image, x, y, width, height, 0, 0, width, height);

    const croppedImage = canvas.toDataURL('image/png');
    setFaceImage(croppedImage);
  };



  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>

        {modelLoaded && (
          <>
            <Webcam audio={false} ref={webcamRef} screenshotFormat="image/png" />

            <br />
            <button onClick={captureImage}>Capture</button>
          </>
        )}
        <br />

        <div>
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={!modelLoaded} />
        </div>


        {faceImage &&
          <div className="flex min-h-screen flex-col items-center justify-between p-10">
            <img className='object-contain hover:object-scale-down rounded-full ring-2"'
              src={faceImage}
              alt="Cropped face"
            />
          </div>}
      </div>
    </main>
  )
}
