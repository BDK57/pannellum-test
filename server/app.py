import matplotlib
matplotlib.use('Agg')  # Use the 'Agg' backend which does not require a GUI

import cv2
import numpy as np
import matplotlib.pyplot as plt
import glob
import os
import time
import threading
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = os.path.abspath('public/assets/uploaded_images')  # Specify the absolute path for the UPLOAD_FOLDER
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# UPLOAD_FOLDER = 'uploaded_images'
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def create_upload_folder():
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

def stitch_images(imgs, destination_folder):
    print("Stitching images...")
    start_time = time.time()  # Note the start time
    # Stitch images
    mode = cv2.STITCHER_PANORAMA
    # mode = cv2.STITCHER_SCANS

    if int(cv2.__version__[0]) == 3:
        stitcher = cv2.createStitcher(mode)
    else:
        stitcher = cv2.Stitcher_create(mode)

    status, stitched = stitcher.stitch(imgs)

    end_time = time.time()  # Note the end time

    if status == 0:
        cv2.imwrite(os.path.join(destination_folder, 'result_new.jpg'), stitched)
        execution_time = ((end_time - start_time)/60)
        print("Execution Time: {} minutes".format(execution_time))  # Print the execution time
        return os.path.abspath(destination_folder), execution_time  # Return the absolute path of the destination folder and execution time
    else:
        raise Exception('Failed to stitch images. Status: %s' % status)

def process_and_stitch_images_async(imgs, destination_folder):
    t = threading.Thread(target=process_and_stitch_images, args=(imgs, destination_folder))
    t.start()

def process_and_stitch_images(imgs, destination_folder):
    try:
        folder_path, execution_time = stitch_images(imgs, destination_folder)
        print("Image processing completed.")
        return folder_path, execution_time
    except Exception as e:
        error_message = str(e)
        print("Error:", error_message)
        return jsonify({'error': error_message}), 500

@app.route('/upload', methods=['POST'])
def upload_images():
    print("Accepting images...")

    create_upload_folder()

    uploaded_files = request.files.getlist("files[]")
    uploaded_file_paths = []

    # Create a unique directory for each upload session
    upload_session_id = str(int(time.time()))
    upload_folder_path = os.path.join(app.config['UPLOAD_FOLDER'], upload_session_id)
    os.makedirs(upload_folder_path)

    for file in uploaded_files:
        file_path = os.path.join(upload_folder_path, file.filename)
        file.save(file_path)
        uploaded_file_paths.append(file_path)

    try:
        # Call function to process and stitch images asynchronously
        imgs = [cv2.imread(img_path) for img_path in uploaded_file_paths]
        folder_path, execution_time = process_and_stitch_images(imgs, upload_folder_path)
        print("Image processing started asynchronously.")
        return jsonify({'folder': folder_path, 'execution_time': execution_time, 'folder_name': upload_session_id})  # Return folder path and execution time
    except Exception as e:
        error_message = str(e)
        print("Error:", error_message)
        return jsonify({'error': error_message}), 500

if __name__ == '__main__':
    print("Server is running...")
    app.run(debug=True)
