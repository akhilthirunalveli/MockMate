import { useState, useRef, useEffect } from 'react';

export const useMediaStream = () => {
  const videoRef = useRef(null);
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [audioOnly, setAudioOnly] = useState(false);
  const [hasAttemptedMediaAccess, setHasAttemptedMediaAccess] = useState(false);

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

  // Check current permission status
  const checkPermissionStatus = async () => {
    try {
      if (!navigator.permissions) {
        console.log('Permissions API not available');
        return { camera: 'unknown', microphone: 'unknown' };
      }

      const cameraPermission = await navigator.permissions.query({ name: 'camera' });
      const microphonePermission = await navigator.permissions.query({ name: 'microphone' });
      
      console.log('Permission status:', {
        camera: cameraPermission.state,
        microphone: microphonePermission.state
      });
      
      return {
        camera: cameraPermission.state,
        microphone: microphonePermission.state
      };
    } catch (err) {
      console.error('Error checking permissions:', err);
      return { camera: 'unknown', microphone: 'unknown' };
    }
  };

  useEffect(() => {
    // Only set up cleanup on component mount, don't request permissions automatically
    const checkDevices = async () => {
      try {
        const { hasVideoInput, hasAudioInput } = await checkDeviceAvailability();
        const permissions = await checkPermissionStatus();
        
        console.log('Initial check - Devices:', { hasVideoInput, hasAudioInput });
        console.log('Initial check - Permissions:', permissions);
        
        if (!hasVideoInput && !hasAudioInput) {
          setErrorMessage("No camera or microphone found. Please connect a device and refresh.");
          return;
        }

        // Handle audio-only scenario
        if (!hasVideoInput && hasAudioInput) {
          console.log("Audio-only mode: No camera detected, using microphone only");
          setAudioOnly(true);
          setErrorMessage("Camera not detected. Recording will be audio-only. Connect a camera for video recording.");
        }
        
        // If permissions were previously granted and devices are available, 
        // we can note this but still wait for user to click buttons
        if ((permissions.camera === 'granted' || permissions.microphone === 'granted') && 
            (hasVideoInput || hasAudioInput)) {
          console.log('Permissions previously granted, ready for user interaction');
        }
      } catch (err) {
        console.error("Error checking devices:", err);
        setErrorMessage("Error checking available devices.");
      }
    };
    
    checkDevices();
    
    // Cleanup function to stop all media tracks when component unmounts
    return () => {
      stopAllMediaTracks();
    };
  }, []);

  // Add multiple event listeners to stop media when leaving page
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      console.log('Page unloading - stopping all media streams');
      stopAllMediaTracks();
      
      // Force immediate cleanup
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      
      // Optional: Show confirmation dialog (some browsers may ignore this)
      if (cameraOn || micOn) {
        const message = 'Your camera and microphone will be turned off when you leave this page.';
        event.returnValue = message;
        return message;
      }
    };

    const handlePageHide = () => {
      console.log('Page hidden - stopping all media streams');
      stopAllMediaTracks();
      
      // Additional forced cleanup for mobile browsers
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };

    // Remove visibility change handler as it's too aggressive
    // const handleVisibilityChange = () => {
    //   if (document.visibilityState === 'hidden') {
    //     console.log('Page visibility hidden - stopping all media streams');
    //     stopAllMediaTracks();
    //   }
    // };

    const handleUnload = () => {
      console.log('Page unload - stopping all media streams');
      stopAllMediaTracks();
    };

    // Remove the blur event handler as it's too aggressive
    // const handleBlur = () => {
    //   console.log('Window blur - stopping all media streams');
    //   stopAllMediaTracks();
    // };

    const handleFocus = () => {
      // When page regains focus, check if media is still working
      if ((cameraOn || micOn) && videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        const activeTracks = tracks.filter(track => track.readyState === 'live');
        
        if (activeTracks.length === 0) {
          console.log('Media tracks stopped externally, resetting states');
          setCameraOn(false);
          setMicOn(false);
        }
      }
    };

    // Listen for page leave events (but not visibility change or blur)
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('unload', handleUnload);
    window.addEventListener('focus', handleFocus);

    return () => {
      // Cleanup event listeners
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('unload', handleUnload);
      window.removeEventListener('focus', handleFocus);
      
      // Only cleanup media if component is actually unmounting
      console.log('useEffect cleanup - component unmounting');
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => {
          if (track.readyState !== 'ended') {
            track.stop();
          }
        });
        videoRef.current.srcObject = null;
      }
    };
  }, []); // Remove dependencies to prevent frequent re-runs

  // Function to stop all media tracks and release permissions
  const stopAllMediaTracks = () => {
    try {
      console.log('Attempting to stop all media tracks...');
      
      // Get all media tracks from the video element
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        
        console.log(`Found ${tracks.length} tracks to stop`);
        
        tracks.forEach((track) => {
          if (track.readyState !== 'ended') {
            track.stop();
            console.log(`Stopped ${track.kind} track (${track.label || 'unnamed'})`);
          }
        });
        
        // Force clear the video element source
        videoRef.current.srcObject = null;
        videoRef.current.load(); // Force reload to clear any cached stream
        console.log('Cleared video element source and reloaded');
      }
      
      // Also try to get and stop any active media streams globally
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Force garbage collection of media streams
        if (typeof window !== 'undefined' && window.gc) {
          window.gc();
        }
      }
      
      // Reset all states to default
      setCameraOn(false);
      setMicOn(false);
      // Only reset permissionGranted if we actually had permissions
      if (permissionGranted) {
        setPermissionGranted(false);
      }
      setAudioOnly(false);
      // Don't clear errorMessage here as it might contain device availability info
      
      console.log('All media streams stopped and permissions released');
    } catch (error) {
      console.error('Error stopping media tracks:', error);
      
      // Force reset states even if stopping fails
      setCameraOn(false);
      setMicOn(false);
      setPermissionGranted(false);
      setAudioOnly(false);
    }
  };

  // Toggle mic by enabling/disabling tracks
  const handleMicToggle = async () => {
    const stream = videoRef.current?.srcObject;
    
    if (!micOn) {
      // Turn mic ON - request permissions if not already granted
      if (!stream) {
        try {
          setHasAttemptedMediaAccess(true);
          
          const { hasAudioInput } = await checkDeviceAvailability();
          
          if (!hasAudioInput) {
            setErrorMessage("No microphone found. Please connect a microphone and refresh.");
            return;
          }

          console.log("Requesting microphone permissions...");
          
          // Request microphone permissions
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            },
          });
          
          console.log("Microphone permissions granted, setting up stream...");
          
          if (videoRef.current && newStream) {
            videoRef.current.srcObject = newStream;
            setPermissionGranted(true);
            setErrorMessage("");
            
            // Enable audio tracks
            newStream.getAudioTracks().forEach((track) => {
              track.enabled = true;
              console.log(`Audio track enabled: ${track.label}`);
            });
            
            setMicOn(true);
            console.log("Microphone enabled successfully");
          }
        } catch (err) {
          console.error("Error enabling microphone:", err);
          
          switch (err.name) {
            case 'NotFoundError':
              setErrorMessage("Microphone not found. Please connect a microphone and try again.");
              break;
            case 'NotAllowedError':
              setErrorMessage("Microphone access denied. Please allow microphone permissions and try again.");
              break;
            case 'NotReadableError':
              setErrorMessage("Microphone is being used by another application. Please close other apps and try again.");
              break;
            case 'OverconstrainedError':
              setErrorMessage("Microphone doesn't support the required settings. Try with a different microphone.");
              break;
            default:
              setErrorMessage(`Microphone error: ${err.message}`);
          }
        }
      } else {
        // Stream exists, just enable audio tracks
        const audioTracks = stream.getAudioTracks();
        audioTracks.forEach((track) => {
          track.enabled = true;
          console.log(`Audio track enabled: ${track.label}`);
        });
        setMicOn(true);
        console.log("Microphone enabled (existing stream)");
      }
    } else {
      // Turn mic OFF - disable audio tracks
      if (stream) {
        const audioTracks = stream.getAudioTracks();
        audioTracks.forEach((track) => {
          track.enabled = false;
          console.log(`Audio track disabled: ${track.label}`);
        });
      }
      setMicOn(false);
      console.log("Microphone disabled");
    }
  };

  const handleCameraToggle = async () => {
    const stream = videoRef.current?.srcObject;
    
    if (!cameraOn) {
      // Turn camera ON - request camera permissions
      try {
        setHasAttemptedMediaAccess(true);
        
        const { hasVideoInput } = await checkDeviceAvailability();
        
        if (!hasVideoInput) {
          setErrorMessage("No camera found. Please connect a camera and refresh.");
          return;
        }

        console.log("Requesting camera and audio permissions...");

        // Request camera and audio permissions
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          },
        });
        
        console.log("Camera and audio permissions granted, setting up stream...");
        
        if (videoRef.current && newStream) {
          // Stop old stream if exists
          if (stream) {
            stream.getTracks().forEach(track => {
              track.stop();
              console.log(`Stopped old track: ${track.kind}`);
            });
          }
          
          videoRef.current.srcObject = newStream;
          
          // Apply current mic state to new stream
          newStream.getAudioTracks().forEach((track) => {
            track.enabled = micOn;
            console.log(`Audio track ${micOn ? 'enabled' : 'disabled'}: ${track.label}`);
          });
          
          // Enable video tracks
          newStream.getVideoTracks().forEach((track) => {
            track.enabled = true;
            console.log(`Video track enabled: ${track.label}`);
          });
          
          setCameraOn(true);
          setErrorMessage("");
          setPermissionGranted(true);
          
          console.log("Camera enabled successfully");
        }
      } catch (err) {
        console.error("Error enabling camera:", err);
        
        switch (err.name) {
          case 'NotFoundError':
            setErrorMessage("Camera not found. Please connect a camera and try again.");
            break;
          case 'NotAllowedError':
            setErrorMessage("Camera access denied. Please allow camera permissions and try again.");
            break;
          case 'NotReadableError':
            setErrorMessage("Camera is being used by another application. Please close other apps and try again.");
            break;
          case 'OverconstrainedError':
            setErrorMessage("Camera doesn't support the required settings. Try with a different camera.");
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
          console.log(`Video track stopped: ${track.label}`);
        });
        
        // Try to get audio-only stream to replace it if mic is still on
        try {
          if (micOn) {
            console.log("Getting audio-only stream to maintain microphone...");
            
            const audioStream = await navigator.mediaDevices.getUserMedia({
              video: false,
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
              },
            });
            
            if (videoRef.current) {
              audioStream.getAudioTracks().forEach((track) => {
                track.enabled = micOn;
                console.log(`Audio track maintained: ${track.label}`);
              });
              videoRef.current.srcObject = audioStream;
            }
          } else {
            // If mic is also off, just clear the stream
            if (videoRef.current) {
              videoRef.current.srcObject = null;
              console.log("Stream cleared - no active media");
            }
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
      console.log("Camera disabled");
    }
  };

  // Function to retry permissions (for the modal)
  const retryPermissions = () => {
    setErrorMessage("");
    setHasAttemptedMediaAccess(false);
    setPermissionGranted(false);
  };

  return {
    videoRef,
    micOn,
    cameraOn,
    permissionGranted,
    errorMessage,
    audioOnly,
    hasAttemptedMediaAccess,
    handleMicToggle,
    handleCameraToggle,
    stopAllMediaTracks,
    retryPermissions
  };
};

// Global debug function for media status
if (typeof window !== 'undefined') {
  window.checkMediaStatus = () => {
    const videoElements = document.querySelectorAll('video');
    console.log('=== MEDIA STATUS DEBUG ===');
    console.log('Video elements found:', videoElements.length);
    
    videoElements.forEach((video, index) => {
      console.log(`Video ${index + 1}:`, {
        hasStream: !!video.srcObject,
        trackCount: video.srcObject ? video.srcObject.getTracks().length : 0,
        tracks: video.srcObject ? video.srcObject.getTracks().map(t => ({
          kind: t.kind,
          label: t.label,
          enabled: t.enabled,
          readyState: t.readyState
        })) : []
      });
    });
    
    // Check permissions
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'camera' }).then(result => {
        console.log('Camera permission:', result.state);
      });
      navigator.permissions.query({ name: 'microphone' }).then(result => {
        console.log('Microphone permission:', result.state);
      });
    }
  };
}
