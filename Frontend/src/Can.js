import './DrawingCanvas.css';
import {useEffect, useRef, useState} from 'react';
import axios, * as others from 'axios';
import { makeStyles, withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    text: {
      color: 'white !important',
      textAlign: 'center',
      fontSize:'1.5rem',
      margin: '0px',
    },

  }));


const DrawingCanvas = ({chooseMessage}) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    let confidence = 0;
    const [data, setData] = useState();
    const classes = useStyles();

    const [isDrawing, setIsDrawing] = useState(false);

    const clearData = () => {
        setData(null);
      };

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 300;
        canvas.height = 300;

        const context = canvas.getContext("2d");
        context.beginPath();
        context.rect(0, 0, 300, 300);
        context.fillStyle = "white";
        context.fill();
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 20;
        contextRef.current = context;
    }, []);

    const startDrawing = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        setIsDrawing(true);
        nativeEvent.preventDefault();
    };

    const draw = ({nativeEvent}) => {
        if(!isDrawing) {
            return;
        }
        
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        nativeEvent.preventDefault();
    };

    const stopDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const setToDraw = () => {
        contextRef.current.globalCompositeOperation = 'source-over';
    };

    
    const sendFile2 = async () => {
        const canvas = canvasRef.current;
        const image = canvasRef.current.getContext('2d');
        const context = canvas.getContext('2d');

        canvas.toBlob(async function (blob) {
            const formData = new FormData();
            formData.append('file', blob);
            for (var pair of formData.entries()) {
                console.log(pair[0]+ ', ' + pair[1]); 
            }


            let res = await axios({
                method: "post",
                url: 'http://127.0.0.1:5000/predict_alpha',
                data: formData,
            });

            console.log(res.data); 
            if (res.status === 200) {
                // if (res.data.class>9){
                let c = String.fromCharCode(res.data.class + 65);
                res.data.class = c;
                setData(res.data);
                // }
                // else{
                //     setData(res.data);
                // }
                chooseMessage(res.data.class)
            }
            
                   
          });


        context.clearRect(0, 0, 300, 300);
        context.beginPath();
        context.rect(0, 0, 300, 300);
        context.fillStyle = "white";
        context.fill();
      };

    const setToErase = () => {
        clearData();
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.clearRect(0, 0, 300, 300);
        context.beginPath();
        context.rect(0, 0, 300, 300);
        context.fillStyle = "white";
        context.fill();
    };

    const saveImageToLocal = (event) => {
        let link = event.currentTarget;
        link.setAttribute('download', 'canvas.png');
        let image = canvasRef.current.toDataURL('image/png');
        link.setAttribute('href', image);
    };

    if (data) {
        confidence = (parseFloat(data.confidence) * 100).toFixed(2);
      }

    return (
        <div className= 'draw-container'>
            <canvas className="canvas-container"
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}>
            </canvas>
            <div>
                <button onClick={setToDraw}>
                    Draw
                </button>
                <button onClick={setToErase}>
                    Clear
                </button>
                <button id="download_image_link"  onClick={sendFile2}>Predict</button>
            </div>
            {data && <div  >
                <h1 className={classes.text}>Label: {data.class}</h1>
                <h1 className={classes.text}>Confidence: {confidence}</h1> 
            </div>}
        </div>
    )
}

export default DrawingCanvas;