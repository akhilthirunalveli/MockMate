import { useEffect, useRef, useState, useCallback } from 'react';
import SimplePeer from 'simple-peer';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = import.meta.env.VITE_BASE_URL;

// Custom hook for 1-on-1 WebRTC video calling
export default function useWebRTC(roomId) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isAudio, setIsAudio] = useState(true);
  const [isVideo, setIsVideo] = useState(true);
  const [isScreenShare, setIsScreenShare] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [error, setError] = useState(null);

  const socketRef = useRef();
  const peerRef = useRef();
  const reconnectTimeout = useRef();

  // Ref to track local stream for reliable cleanup
  const localStreamRef = useRef(null);

  const room = roomId;

  // Initialize Socket and get user media
  useEffect(() => {
    let isMounted = true;

    const startAndConnect = async () => {
      let stream = null;
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (!isMounted) {
            stream.getTracks().forEach(track => track.stop());
            return;
          }
          setLocalStream(stream);
          localStreamRef.current = stream; // Update ref immediately
        } else {
          console.warn("navigator.mediaDevices is undefined. Camera access requires HTTPS or localhost.");
          if (isMounted) setError(new Error("Camera requires HTTPS or localhost"));
        }
      } catch (err) {
        console.error("Failed to get user media:", err);
        if (isMounted) setError(err);
        // Continue even if media fails so we can still connect (receive-only)
      }

      // If socket already exists, disconnect it first (shouldn't happen with proper cleanup, but safety first)
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      socketRef.current = io(SOCKET_SERVER_URL, { transports: ['websocket'] });

      // ICE Server Configuration

      const meteredUsername = import.meta.env.VITE_METERED_USERNAME;
      const meteredCredential = import.meta.env.VITE_METERED_CREDENTIAL;

      const iceServers = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
      ];

      if (meteredUsername && meteredCredential) {
        iceServers.push(
          {
            urls: "turn:standard.relay.metered.ca:80",
            username: meteredUsername,
            credential: meteredCredential,
          },
          {
            urls: "turn:standard.relay.metered.ca:80?transport=tcp",
            username: meteredUsername,
            credential: meteredCredential,
          },
          {
            urls: "turn:standard.relay.metered.ca:443",
            username: meteredUsername,
            credential: meteredCredential,
          },
          {
            urls: "turns:standard.relay.metered.ca:443?transport=tcp",
            username: meteredUsername,
            credential: meteredCredential,
          }
        );
      }

      const peerConfig = {
        iceServers,
        sdpSemantics: 'unified-plan'
      };

      socketRef.current.on('other-user', ({ signal }) => {
        console.log("Received other-user (Offer)");
        if (peerRef.current) peerRef.current.destroy();

        const peer = new SimplePeer({
          initiator: false,
          trickle: false,
          stream: stream || undefined,
          config: peerConfig,
          offerOptions: {
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
          }
        });

        peer.on('signal', signal => {
          console.log("Sending Answer");
          socketRef.current.emit('signal', { room, signal });
        });

        peer.on('connect', () => {
          console.log("Peer Connected!");
          if (isMounted) setConnecting(false);
        });

        peer.on('stream', (remoteStream) => {
          console.log("Received Remote Stream (Guest)");
          if (isMounted) setRemoteStream(remoteStream);
        });

        peer.on('error', (err) => {
          console.error('Peer error:', err);
        });

        peer.signal(signal);
        peerRef.current = peer;
        if (isMounted) setConnecting(false);
      });

      socketRef.current.on('user-joined', () => {
        console.log("User Joined - Initiating Peer");
        if (peerRef.current) peerRef.current.destroy();

        const peer = new SimplePeer({
          initiator: true,
          trickle: false,
          stream: stream || undefined,
          config: peerConfig,
          offerOptions: {
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
          }
        });

        peer.on('signal', signal => {
          console.log("Sending Offer");
          socketRef.current.emit('signal', { room, signal });
        });

        peer.on('connect', () => {
          console.log("Peer Connected!");
          if (isMounted) setConnecting(false);
        });

        peer.on('stream', (remoteStream) => {
          console.log("Received Remote Stream (Host)");
          if (isMounted) setRemoteStream(remoteStream);
        });

        peer.on('error', (err) => {
          console.error('Peer error:', err);
        });

        peerRef.current = peer;
        if (isMounted) setConnecting(false);
      });

      socketRef.current.on('signal', ({ signal }) => {
        console.log("Received Signal (Answer)");
        if (peerRef.current && !peerRef.current.destroyed) {
          peerRef.current.signal(signal);
        }
      });

      socketRef.current.on('disconnect', () => {
        console.log("Socket Disconnected");
        // Only attempt reconnect if mounted
        if (isMounted) attemptReconnect();
      });

      // Join room AFTER setting up listeners
      console.log("Joining Room:", room);
      socketRef.current.emit('join-room', { room });
    };

    startAndConnect();

    return () => {
      isMounted = false;
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);

      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }

      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(); // Remove all listeners
        socketRef.current = null;
      }

      // Cleanup local stream using ref to ensure we have the latest stream reference
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
        localStreamRef.current = null;
      }
      setLocalStream(null);
      setRemoteStream(null);
    };
  }, [room]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup connections/streams (external cleanup function)
  const cleanup = () => {
    if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    peerRef.current?.destroy();
    socketRef.current?.disconnect();

    // Explicitly stop all tracks using the ref
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      localStreamRef.current = null;
    }

    setLocalStream(null);
    setRemoteStream(null);
  };

  // Reconnection handler
  const attemptReconnect = useCallback(() => {
    cleanup();
    reconnectTimeout.current = setTimeout(() => {
      window.location.reload(); // simple force reload reconnection (customize as needed)
    }, 2000);
  }, []);

  // Toggle audio/video functions
  const toggleAudio = async () => {
    if (isAudio) {
      // Turn OFF - Stop the track to release hardware
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
      }
      setIsAudio(false);
    } else {
      // Turn ON - Request new audio stream
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const newAudioTrack = stream.getAudioTracks()[0];

        if (localStreamRef.current) {
          const oldAudioTrack = localStreamRef.current.getAudioTracks()[0];
          const videoTracks = localStreamRef.current.getVideoTracks();
          const newStream = new MediaStream([...videoTracks, newAudioTrack]);

          setLocalStream(newStream);
          localStreamRef.current = newStream; // Update Ref

          if (peerRef.current) {
            if (oldAudioTrack) {
              peerRef.current.replaceTrack(oldAudioTrack, newAudioTrack, localStreamRef.current);
            } else {
              peerRef.current.addTrack(newAudioTrack, newStream);
            }
          }
        } else {
          // Case where we might have killed the stream entirely, restart it
          setLocalStream(stream);
          localStreamRef.current = stream;
        }
        setIsAudio(true);
      } catch (err) {
        console.error("Error restarting audio:", err);
      }
    }
  };

  const toggleVideo = async () => {
    if (isVideo) {
      // Turn OFF - Stop the track to release hardware
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
      }
      setIsVideo(false);
    } else {
      // Turn ON - Request new video stream
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const newVideoTrack = stream.getVideoTracks()[0];

        if (localStreamRef.current) {
          const oldVideoTrack = localStreamRef.current.getVideoTracks()[0];
          const audioTracks = localStreamRef.current.getAudioTracks();
          const newStream = new MediaStream([...audioTracks, newVideoTrack]);

          setLocalStream(newStream);
          localStreamRef.current = newStream; // Update Ref

          if (peerRef.current) {
            if (oldVideoTrack) {
              peerRef.current.replaceTrack(oldVideoTrack, newVideoTrack, localStreamRef.current);
            } else {
              peerRef.current.addTrack(newVideoTrack, newStream);
            }
          }
        } else {
          // Case where we might have killed the stream entirely
          setLocalStream(stream);
          localStreamRef.current = stream;
        }
        setIsVideo(true);
      } catch (err) {
        console.error("Error restarting video:", err);
      }
    }
  };

  // Screen share
  const shareScreen = async () => {
    if (!isScreenShare && navigator.mediaDevices.getDisplayMedia) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setIsScreenShare(true);
        // Replace video track with screen
        const sender = peerRef.current?.streams[0]?.getVideoTracks()[0];
        // Use localStreamRef.current for consistency
        peerRef.current?.replaceTrack(sender, screenStream.getVideoTracks()[0], localStreamRef.current);

        screenStream.getVideoTracks()[0].onended = () => {
          stopScreenShare();
        };
      } catch (err) { /* ignore */ }
    }
  };
  const stopScreenShare = async () => {
    setIsScreenShare(false);
    // Revert to camera
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const sender = peerRef.current?.streams[0]?.getVideoTracks()[0];
      peerRef.current?.replaceTrack(sender, stream.getVideoTracks()[0], localStreamRef.current);

      // Update localStream to show camera again locally
      if (localStreamRef.current) {
        const audioTracks = localStreamRef.current.getAudioTracks();
        const newStream = new MediaStream([...audioTracks, stream.getVideoTracks()[0]]);
        setLocalStream(newStream);
        localStreamRef.current = newStream;
      } else {
        setLocalStream(stream);
        localStreamRef.current = stream;
      }

    } catch (err) {
      console.error("Error stopping screen share:", err);
    }
  };

  const endCall = () => {
    cleanup();
  };

  return {
    localStream,
    remoteStream,
    remoteConnected: !connecting, // If not connecting (and no error), we are connected
    isAudio,
    isVideo,
    isScreenShare,
    connecting,
    error,
    toggleAudio,
    toggleVideo,
    shareScreen,
    stopScreenShare,
    endCall,
  };
}
