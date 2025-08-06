import { useState, useRef, useEffect } from 'react';

export const useMediaStream = () => {
  const videoRef = useRef(null);
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setPermissionGranted(true);
          // Disable all tracks by default
          stream.getAudioTracks().forEach((track) => (track.enabled = false));
          stream.getVideoTracks().forEach((track) => (track.enabled = false));
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setPermissionGranted(false);
      }
    };
    
    getCamera();
    
    // Cleanup function to stop all media tracks when component unmounts
    return () => {
      stopAllMediaTracks();
    };
  }, []);

  // Add beforeunload event listener to stop media when leaving page
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopAllMediaTracks();
    };

    // Only listen for page unload, not tab switching
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Function to stop all media tracks and release permissions
  const stopAllMediaTracks = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
      videoRef.current.srcObject = null;
    }
    
    // Reset states
    setCameraOn(false);
    setMicOn(false);
  };

  // Toggle mic by enabling/disabling tracks
  const handleMicToggle = () => {
    setMicOn((prev) => {
      const enabled = !prev;
      const stream = videoRef.current?.srcObject;
      if (stream) {
        stream.getAudioTracks().forEach((track) => (track.enabled = enabled));
      }
      return enabled;
    });
  };

  const handleCameraToggle = () => {
    const stream = videoRef.current?.srcObject;
    
    if (!cameraOn) {
      // Turn camera ON - need to request new video stream
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      }).then((newStream) => {
        if (videoRef.current) {
          // Stop old stream if exists
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          
          videoRef.current.srcObject = newStream;
          
          // Apply current mic state to new stream
          newStream.getAudioTracks().forEach((track) => {
            track.enabled = micOn;
          });
          
          setCameraOn(true);
        }
      }).catch((err) => {
        console.error("Error enabling camera:", err);
        alert("Unable to access camera. Please check permissions.");
      });
    } else {
      // Turn camera OFF - stop video tracks to turn off camera light
      if (stream) {
        const videoTracks = stream.getVideoTracks();
        
        // Stop all video tracks to turn off camera light
        videoTracks.forEach((track) => {
          track.stop();
        });
        
        // Get audio-only stream to replace it
        navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        }).then((audioStream) => {
          if (videoRef.current) {
            audioStream.getAudioTracks().forEach((track) => {
              track.enabled = micOn;
            });
            videoRef.current.srcObject = audioStream;
          }
        }).catch((err) => {
          console.error("Error getting audio stream:", err);
        });
      }
      
      setCameraOn(false);
    }
  };

  return {
    videoRef,
    micOn,
    cameraOn,
    permissionGranted,
    handleMicToggle,
    handleCameraToggle,
    stopAllMediaTracks
  };
};
