import React, { useState, useEffect } from 'react';

const PWAInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event so it can be triggered later
      setInstallPrompt(e);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setShowInstallButton(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if app is already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    const result = await installPrompt.prompt();
    console.log('Install prompt result:', result);
    
    setInstallPrompt(null);
    setShowInstallButton(false);
  };

  if (!showInstallButton) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#000000ff',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '25px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: 'none'
    }}
    onClick={handleInstallClick}
    onMouseEnter={(e) => {
      e.target.style.backgroundColor = '#202020ff';
      e.target.style.transform = 'translateX(-50%) translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = '#000000ff';
      e.target.style.transform = 'translateX(-50%) translateY(0px)';
    }}
    >
      Get App
    </div>
  );
};

export default PWAInstallPrompt;
