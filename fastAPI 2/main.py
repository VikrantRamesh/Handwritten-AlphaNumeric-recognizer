from fastapi import FastAPI, UploadFile, File,responses
import uvicorn  
from io import BytesIO
from PIL import Image
import numpy as np
import tensorflow as tf
from fastapi.middleware.cors import CORSMiddleware
import cv2
import matplotlib.pyplot as plt
import base64

model_alpha = tf.keras.models.load_model("../fastAPI 2/PlantVillage/saved_models/project-alpha")
model_num = tf.keras.models.load_model("../fastAPI 2/PlantVillage/saved_models/model-2")
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

app = FastAPI()


origins = {
    "http://localhost:3000",
    "http://localhost"
}

app.add_middleware(     
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"],    
)

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)).convert('RGBA'))
    return image    

@app.post("/predict_alpha")

async def predict(
    file: UploadFile = File(...)
):

    image = read_file_as_image(await file.read())
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    image = cv2.resize(image,(28,28))
    np_img = np.array(image)
    
    np_img = np.invert(np_img)
    np_img = [np_img]
    img = np.array(np_img)
    result = model_alpha.predict(img)

    res = np.argmax(result)
    conf = np.max(result)
    return {
        'class': int(res),
        'confidence': float(conf),
    }


@app.post("/predict_num")

async def predict(
    file: UploadFile = File(...)
):

    image = read_file_as_image(await file.read())
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    image = cv2.resize(image,(28,28))
    np_img = np.array(image)
    
    np_img = np.invert(np_img)
    np_img = [np_img]
    img = np.array(np_img)
    result = model_num.predict(img)

    res = np.argmax(result)
    conf = np.max(result)
    return {
        'class': int(res),
        'confidence': float(conf),
    }


if __name__ == "__main__":
    uvicorn.run(app,host="localhost",port='5000')