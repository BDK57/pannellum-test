'use client'
import React, { useEffect, useState } from 'react';
import '@/public/assets/componentcss/virtualTour.css'
import { useParams } from 'next/navigation';
const Page = () => {
  const [pannellumLoaded, setPannellumLoaded] = useState(false);
  const params = useParams()
  const search = params.folderName;


  useEffect(() => {
    const loadPannellum = async () => {
      // Load Pannellum script
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        setPannellumLoaded(true);
      };
    };

    loadPannellum();

    return () => {
      // Cleanup function to remove Pannellum script
      const script = document.querySelector('script[src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"]');
      if (script && script.parentNode === document.body) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (pannellumLoaded) {
      pannellum.viewer("panorama", {
        default: {
          firstScene: "house",
          author: "Hassan Khan",
          sceneFadeDuration: 1000,
           "autoLoad": true
        },

        scenes: {
          circle: {
            title: "",
            hfov: 110,
            pitch: -3,
            yaw: 117,
            type: "equirectangular",
            panorama: "/assets/vr-images/result.png",
            hotSpots: [
              {
                pitch: -5.1,
                yaw: 302.9,
                type: "scene",
                text: "Desert Tree Area",
                sceneId: "house",
              },
            ],
          },

          house: {
            title: "",
            hfov: 90,
            pitch: -3,
            yaw: 90,
            type: "equirectangular",
            panorama:`/assets/uploaded_images/${search}/result_new.jpg`,
            minPitch: -70, // Adjust this value as needed to limit downward movement
            maxPitch: 50,
            hotSpots: [
              {
                pitch: -2.1,
                yaw: 80.9,
                type: "scene",
                text: "Desert Tree Area",
                sceneId: "circle",
              },
            ],
          },




        },
      });
    }
  }, [pannellumLoaded]);

  return (
    <div id="panorama" style={{width:"90%",height:"600px",marginTop:"120px",marginInline:"auto"}}></div>
  );
};

export default Page;
