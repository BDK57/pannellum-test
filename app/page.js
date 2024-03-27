'use client'
import { useState,useRef } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from 'next/router' instead of 'next/navigation'

const Page = () => {
  const [files, setFiles] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [folderName, setFolderName] = useState('');
  const router = useRouter();
  const inputFileRef = useRef(null); // Create a ref for the input element


  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

//   const handleUpload = async () => {
//     if (!files) return;

//     const formData = new FormData();
//     for (const file of files) {
//       formData.append('files[]', file);
//     }

//     setUploading(true);
//     setUploadStatus('Accepting images...');

//     try {
//       const response = await fetch('http://127.0.0.1:5000/upload', {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();
//       setUploading(false);

//       if (response.ok) {
//         setFiles(null); // Clear the input field
//         setFolderName(data.folder_name);
//         setUploadStatus(`Folder: ${data.folder}, Execution Time: ${data.execution_time} seconds`);

//         router.push(`/Para?folderName=${data.folder_name}`);
//       } else {
//         setUploadStatus(`Error: ${data.error}`);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setUploading(false);
//       setUploadStatus('An error occurred while uploading');
//     }
//   };
const handleUpload = async () => {
    if (!files) return;

    const formData = new FormData();
    for (const file of files) {
      formData.append('files[]', file);
    }

    setUploading(true);
    setUploadStatus('Accepting images...');

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setUploading(false);

      if (response.ok) {
        setFiles(null); // Clear the input field
        inputFileRef.current.value = '';
        setFolderName(data.folder_name);
        setUploadStatus(`Folder: ${data.folder}, Execution Time: ${data.execution_time} seconds`);
      } else {
        setUploadStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setUploading(false);
      setUploadStatus('An error occurred while uploading');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} multiple ref={inputFileRef} />
      <button onClick={handleUpload} disabled={uploading}>Upload</button>
      <div>{uploading && 'Uploading...'}</div>
      <div>{uploadStatus}</div>
      <div>{folderName && `Folder Name: ${folderName}`}</div>
    </div>
  );
};

export default Page;
