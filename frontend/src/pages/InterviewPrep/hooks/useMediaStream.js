import { useState, useRef, useEffect } from 'react';

export const useMediaStream = () => {
  const videoRef = useRef(null);
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [audioOnly, setAudioOnly] = useState(false);

  // Check if devices are available
  const checkDeviceAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasVideoInput = devices.some(device => device.kind === 'videoinput');
      const hasAudioInput = devices.some(device => device.kind === 'audioinput');
      
      console.log('Available devices:', { hasVideoInput, hasAudioInput });
      return { hasVideoInput, hasAudioInput };
    } catch (err) {
      console.error('Error checking device availability:', err);
      return { hasVideoInput: false, hasAudioInput: false };
    }
  };

  useEffect(() => {
    const getCamera = async () => {
      try {
        // First check if devices are available
        const { hasVideoInput, hasAudioInput } = await checkDeviceAvailability();
        
        if (!hasVideoInput && !hasAudioInput) {
          setErrorMessage("No camera or microphone found. Please connect a device and refresh.");
          setPermissionGranted(false);
          return;
        }

        // Handle audio-only scenario
        if (!hasVideoInput && hasAudioInput) {
          console.log("🎤 Audio-only mode: No camera detected, using microphone only");
          setAudioOnly(true);
          setErrorMessage("Camera not detected. Recording will be audio-only. Connect a camera for video recording.");
        }

        // Try to get media with fallback options
        let constraints = { video: false, audio: false };
        
        if (hasVideoInput) {
          constraints.video = { facingMode: "user" };
        }
        
        if (hasAudioInput) {
          constraints.audio = true;
        }

        // Request media access
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setPermissionGranted(true);
          
          // Clear error message if we successfully got some media
          if (!audioOnly) {
            setErrorMessage("");
          }
          
          // Disable all tracks by default
          stream.getAudioTracks().forEach((track) => (track.enabled = false));
          stream.getVideoTracks().forEach((track) => (track.enabled = false));
          
          console.log(`🎯 Media initialized: ${stream.getVideoTracks().length} video tracks, ${stream.getAudioTracks().length} audio tracks`);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setPermissionGranted(false);
        
        // Provide user-friendly error messages
        switch (err.name) {
          case 'NotFoundError':
            setErrorMessage("No camera or microphone found. Please connect a device and refresh the page.");
            break;
          case 'NotAllowedError':
            setErrorMessage("Camera and microphone access denied. Please allow permissions and refresh.");
            break;
          case 'NotReadableError':
            setErrorMessage("Camera or microphone is being used by another application.");
            break;
          case 'OverconstrainedError':
            setErrorMessage("Camera doesn't support the required settings.");
            break;
          default:
            setErrorMessage(`Error accessing media devices: ${err.message}`);
        }
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

  const handleCameraToggle = async () => {
    const stream = videoRef.current?.srcObject;
    
    if (!cameraOn) {
      // Turn camera ON - check if camera is available first
      try {
        const { hasVideoInput } = await checkDeviceAvailability();
        
        if (!hasVideoInput) {
          setErrorMessage("No camera found. Please connect a camera and refresh.");
          return;
        }

        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true,
        });
        
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
          setErrorMessage("");
        }
      } catch (err) {
        console.error("Error enabling camera:", err);
        
        switch (err.name) {
          case 'NotFoundError':
            setErrorMessage("Camera not found. Please connect a camera and try again.");
            break;
          case 'NotAllowedError':
            setErrorMessage("Camera access denied. Please allow camera permissions.");
            break;
          default:
            setErrorMessage(`Camera error: ${err.message}`);
        }
      }
    } else {
      // Turn camera OFF - stop video tracks to turn off camera light
      if (stream) {
        const videoTracks = stream.getVideoTracks();
        
        // Stop all video tracks to turn off camera light
        videoTracks.forEach((track) => {
          track.stop();
        });
        
        // Try to get audio-only stream to replace it
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          });
          
          if (videoRef.current) {
            audioStream.getAudioTracks().forEach((track) => {
              track.enabled = micOn;
            });
            videoRef.current.srcObject = audioStream;
          }
        } catch (err) {
          console.error("Error getting audio stream:", err);
          // If we can't get audio, just clear the stream
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
        }
      }
      
      setCameraOn(false);
    }
  };

  return {
    videoRef,
    micOn,
    cameraOn,
    permissionGranted,
    errorMessage,
    audioOnly,
    handleMicToggle,
    handleCameraToggle,
    stopAllMediaTracks
  };
};
