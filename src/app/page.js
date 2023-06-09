"use client"
import React, { useState, useRef, useCallback, useEffect } from "react";
import * as faceapi from 'face-api.js';
import Webcam from 'react-webcam';


import Image from 'next/image';
import html2canvas from 'html2canvas';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

import { Grid, Input, Text, Spacer, Button, Modal, Container } from "@nextui-org/react";

import { HexColorPicker } from "react-colorful";
import useClickOutside from "./useClickOutside";
import downloadjs from 'downloadjs';



import { Inter, Kanit, Noto_Sans_Thai } from 'next/font/google'
const kanit = Kanit({ weight: '400', subsets: ['latin'] })
const noto_sans_thai = Noto_Sans_Thai({ weight: '400', subsets: ['latin'] })

const HeartIcon = ({
  fill = 'currentColor',
  filled,
  size,
  height,
  width,
  label,
  ...props
}) => {
  return (
    <svg
      width={size || width || 24}
      height={size || height || 24}
      viewBox="0 0 24 24"
      fill={filled ? fill : 'none'}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 0 1 4.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12Z"
        stroke={fill}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};


export default function Home() {


  const popover = useRef();
  const popoverLight = useRef();
  const imageRef = useRef(null);
  const [text, setText] = useState('0 - 0');
  const [text2, setText2] = useState('ถ้าอยากเจอผีให้ไปบ้านร้างแต่ถ้าอ้างว้างก็มาบ้านพี่นะจ๊ะ');
  const [color, setColor] = useState("#fff");
  const [colorLight, setColorLight] = useState("#FF0000");
  const [fontSize, setFontSize] = useState(30);
  const [fontSize2, setFontSize2] = useState(15);
  const [xAxis, setXaxis] = useState(-30);
  const [yAxis, setYaxis] = useState(105);
  const [xAxis_2, setXaxis_2] = useState(60);
  const [yAxis_2, setYaxis_2] = useState(-50);


  const [isOpen, toggle] = useState(false);
  const [isOpenLight, toggleLight] = useState(false);
  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  const closeLight = useCallback(() => toggleLight(false), []);
  useClickOutside(popoverLight, closeLight);


  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTextChange2 = (e) => {
    setText2(e.target.value);
  };

  //-------------- it's not work with chrome mobile -----------
  // const handleImageDownload = () => {

  //   html2canvas(imageRef.current).then((canvas) => {
  //     const link = document.createElement('a');
  //     link.download = 'adsRama8.png';
  //     link.href = canvas.toDataURL();
  //     link.click();
  //   });
  // };

  const [visibleDonate, setVisibleDonate] = useState(false);
  const handlerDonate = () => setVisibleDonate(true);

  const closeHandlerDonate = () => {
    setVisibleDonate(false);
    // console.log("closed");
  };


  const handleImageDownload = async () => {
    const canvas = await html2canvas(document.getElementById("image-container"),
      {
        letterRendering: 1,
        allowTaint: false,
        scale: 1,
        dpi: 300,
        backgroundColor: "rgba(0,0,0,0)",
        // onclone: (clonedDoc) => {
        //   clonedDoc.getElementById("image-container").style.display = "block";
        //   clonedDoc.getElementById("frontCardLoad").style.display = "block";
        //   // Visibility set to visible using `onclone` method
        // },

      })

    const dataURL = canvas.toDataURL('image/png');

    downloadjs(dataURL, 'adsRama8.png', 'image/png');



  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImage2, setSelectedImage2] = useState(null);
  const imageList = [
    {
      name: "Liver pool",
      src: "/liverpool.png"
    },
    {
      name: "Man-U",
      src:
        "/man-u.png"
    },
    {
      name: "Arsenal",
      src:
        "/arsenal.png"
    },
    {
      name: "chelsea",
      src:
        "/chelsea.png"
    },
    {
      name: "Man-city",
      src:
        "/man-city.png"
    },
    {
      name: "Real-Marid",
      src:
        "/real-madrid.png"
    }
  ];

  const handleImageSelect = (event) => {
    const selectedImagePath = event.target.value;
    setSelectedImage(selectedImagePath);
  };

  const handleImageSelect2 = (event) => {
    const selectedImagePath = event.target.value;
    setSelectedImage2(selectedImagePath);
  };
  // const handleDrawImage = () => {
  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext("2d");

  //   if (selectedImage) {
  //     const image = new Image();
  //     image.src = selectedImage;
  //     image.onload = () => {
  //       context.drawImage(image, 0, 0, 100, 100);
  //     };
  //   }
  //   handleClearImage();
  // };

  const handleClearImage = () => {
    setSelectedImage(null);
    setSelectedImage2(null);
  };


  const [imageFile, setImageFile] = useState(null);
  const [faceImage, setFaceImage] = useState('');
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
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
      setIsCapturing(true);
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

  const videoConstraints = {
    width: 128,
    height: 72,
    facingMode: "user"
  };







  return (
    <Grid.Container gap={2} justify="center" alignItems="center" css={{ display: "flex", flexDirection: "row" }}>

      <Grid lg={6}>
        <Spacer y={1} />
        <Grid.Container justify="center" alignItems="center" >
          <Grid.Container justify="center" alignItems="center">
            <Text size={30} className={kanit.className}>ฟุตบอลคือศาสนา</Text>
          </Grid.Container>
          <Spacer y={1} />
          <Grid.Container>
            <Input
              type="text"
              value={text}
              underlined
              clearable
              onChange={handleTextChange}
              css={{ width: "100%" }}
              labelPlaceholder="สกอร์ลคะแนน"
            />
          </Grid.Container>
          <Spacer y={2} />

          <Grid.Container>
            <Input
              type="text"
              value={text2}
              underlined
              clearable
              onChange={handleTextChange2}
              css={{ width: "100%" }}
              labelPlaceholder="คำคม"
            />
          </Grid.Container>

          <Spacer y={2} />

          <Grid.Container>
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={!modelLoaded} />
          </Grid.Container>



          <Spacer y={1} />
          <Grid.Container>
          <Grid.Container justify="center" alignItems="center">
            <Text size={20} className={kanit.className}>เลือกทีมในฝัน</Text>
          </Grid.Container>
            <select onChange={handleImageSelect}>
              <option value="">Select an image</option>
              {imageList.map((image, index) => (
                <option key={index} value={image.src}>
                  {image.name}
                </option>
              ))}
            </select>
          </Grid.Container>

          <Grid.Container alignItems="flex-end" justify="flex-end">
            <select onChange={handleImageSelect2}>
              <option value="">Select an image</option>
              {imageList.map((image, index) => (
                <option key={index} value={image.src}>
                  {image.name}
                </option>
              ))}
            </select>
          </Grid.Container>
          <Spacer y={1} />
          <Grid.Container alignItems="center" justify="center">
            <Button
              onClick={handleClearImage} disabled={!selectedImage}
            >

              เคลียร์ทีมที่เลือก
            </Button>

          </Grid.Container>

          <Spacer y={1} />


          {modelLoaded && (
            <>

              <Grid.Container alignItems="center" justify="center">
                <Button
                  onClick={captureImage}
                >

                  ถ่ายรูป
                </Button>

              </Grid.Container>
              <Spacer y={1} />


            </>
          )}
         

        

          {isCapturing && (
            <>
            
            <Grid.Container alignItems="center" justify="center">
              <Webcam audio={false} ref={webcamRef} screenshotFormat="image/png" videoConstraints={videoConstraints} />
              </Grid.Container>
              <Spacer y={1} />
            </>
          )}


{/* 
          <Grid.Container>
            <Text css={{ mb: 16 }} size={14} className={kanit.className}>ขนาดตัวอักษร</Text>
            <Slider value={fontSize} min={0} max={60} onChange={setFontSize} />
          </Grid.Container>

          <Spacer y={1} />
          <Grid.Container>
            <Text css={{ mb: 16 }} size={14} className={kanit.className}>แกน X</Text>
            <Slider value={xAxis} min={-500} max={500} onChange={setXaxis} />
          </Grid.Container>

          <Spacer y={1} />
          <Grid.Container>
            <Text css={{ mb: 16 }} size={14} className={kanit.className}>แกน Y</Text>
            <Slider value={yAxis} min={-500} max={500} onChange={setYaxis} />

          </Grid.Container> */}

          <Spacer y={1} />
          <Grid.Container>
            <Grid>
              <Grid.Container >
                <Text css={{ mb: 16, mr: 10 }} size={14} className={kanit.className}>สีข้อความ</Text>
                <div className="picker">
                  <div
                    className="swatch"
                    style={{ backgroundColor: color }}
                    onPress={() => toggle(true)}
                  />

                  {isOpen && (
                    <div className="popover" ref={popover}>
                      <HexColorPicker color={color} onChange={setColor} style={{ zIndex: 2 }} />
                    </div>
                  )}
                </div>
              </Grid.Container>
            </Grid>

            <Spacer y={1} />
            <Grid>
              <Grid.Container>
                <Text css={{ mb: 16, mr: 10 }} size={14} className={kanit.className}>สีไฟนีออน</Text>
                <div className="picker">
                  <div
                    className="swatch"
                    style={{ backgroundColor: colorLight }}
                    onClick={() => toggleLight(true)}
                  />

                  {isOpenLight && (
                    <div className="popover" ref={popoverLight}>
                      <HexColorPicker color={colorLight} onChange={setColorLight} style={{ zIndex: 2 }} />
                    </div>
                  )}
                </div>
              </Grid.Container>
            </Grid>
          </Grid.Container>

          <Grid.Container alignItems="center" justify="center">

            <Button
              auto
              rounded
              ripple={false}
              color="success"
              // size="auto"
              onClick={handleImageDownload}
              css={{
                zIndex: 1,
                background: '$white',
                fontWeight: '$semibold',
                boxShadow: '$md',
                position: 'relative',
                overflow: 'visible',
                color: '#0F9549',
                px: '$18',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background: '$white',
                  opacity: 1,
                  borderRadius: '$pill',
                  transition: 'all 0.4s ease'
                },
                '&:hover': {
                  transform: 'translateY(-5px)',
                  '&:after': {
                    transform: 'scaleX(1.5) scaleY(1.6)',
                    opacity: 0
                  }
                },
                '&:active': {
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Download
            </Button>
          </Grid.Container>

          {/* <Grid.Container justify="center" css={{ mt: 10 }} >

            <Button size="sm" flat bordered onPress={handlerDonate} color="$bgColor" css={{
              color: "$orange",
              backgroundColor: "$white"
            }}>
              <HeartIcon style={{ display: "block" }} fill="red" filled />

              <Text className={noto_sans_thai.className} css={{ pt: 2 }} size={16} color="$blue" >
                สนับสนุน
              </Text>

            </Button>
          </Grid.Container> */}

          <Spacer y={1} />
          <Grid.Container alignItems="center" justify="center">
            <p>📱 เพื่อความฮาของชาวบอลโปรดใช้บน Smartphone เท่านั้น</p>
          </Grid.Container>

        </Grid.Container>



        <Spacer y={.5} />
      </Grid>


      <Grid lg={6} >
        <div ref={imageRef} className="image-container" id="image-container">
          <img src="/ball_c.png" height="100%" width="100%" />


          <div className="overlay neonText"
            style={{
              transform: `translate(${xAxis}px , ${yAxis}px)`,
              textShadow: `0 0 5px ${colorLight}, 0 0 15px ${colorLight}, 0 0 20px ${colorLight}, 0 0 40px ${colorLight}, 0 0 60px ${colorLight}, 0 0 10px ${colorLight}, 0 0 98px ${colorLight}`,
              color: color,
              fontSize: fontSize
            }}>
            {text}
          </div>


          <div className="overlay2 neonText"
            style={{
              transform: `translate(${xAxis_2}px , ${yAxis_2}px)`,
              textShadow: `0 0 5px ${colorLight}, 0 0 15px ${colorLight}, 0 0 20px ${colorLight}, 0 0 40px ${colorLight}, 0 0 60px ${colorLight}, 0 0 10px ${colorLight}, 0 0 98px ${colorLight}`,
              color: color,
              fontSize: fontSize2
            }}>
            {text2}
          </div>



          <div className="overlay neonText"
            style={{
              transform: `translate(-140px , 70px)`,

            }}>

            {selectedImage && (
              <img
                src={selectedImage}
                alt="Selected Image"
                style={{ width: "100px", height: "100px" }}
              />
            )}


          </div>

          <div className="overlay neonText"
            style={{
              transform: `translate(60px , 70px)`,

            }}>

            {selectedImage2 && (
              <img
                src={selectedImage2}
                alt="Selected Image2"
                style={{ width: "100px", height: "100px" }}
              />
            )}


          </div>




          <div className="overlay"
            style={{
              transform: `translate(-122px , -157px)`,

            }}>

            {faceImage && (
              <img className="overlay3"
                src={faceImage}
                alt="faceImage"
                style={{ width: "80px", height: "80px" }}
              />
            )}


          </div>


        </div>
      </Grid>
      {/* {xAxis}
      |
      {yAxis} */}

      <Modal
        closeButton
        open={visibleDonate}
        onClose={closeHandlerDonate}

      >

        <Modal.Header>
          <Grid.Container className="modalDonate" >

            <Text b h1 size={20} css={{ pt: 8, pr: 10 }} className={noto_sans_thai.className} >
              สนับสนุนค่าเซิฟเวอร์
            </Text>

            <HeartIcon style={{ display: "block" }} fill="red" filled />

          </Grid.Container>

        </Modal.Header>
        <Modal.Body  >
          <Grid.Container className="modalDonate" >

            <Image
              src="/promptpay.png"
              alt="PromptPay"
              width={300}
              height={300}
              style={{ display: "block", margin: "auto" }}
            />

            <Text css={{ mt: 20 }} size={18} className={noto_sans_thai.className} color="#fff"  >
              ใช้แอปธนาคารสแกน QR code ได้เลย!
            </Text>

          </Grid.Container>

        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" className={noto_sans_thai.className} onPress={closeHandlerDonate}>
            ปิด
          </Button>
        </Modal.Footer>

      </Modal>

    </Grid.Container>
  )
}

