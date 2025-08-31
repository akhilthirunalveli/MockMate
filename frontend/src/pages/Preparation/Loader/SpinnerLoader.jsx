import React from 'react'
import { HashLoader } from 'react-spinners'

const SpinnerLoader = ({ transparent = false, size = 40, color = 'black' }) => {
  // Determine color based on prop
  const loaderColor = color === 'white' ? '#ffffff' : '#000000';

  if (transparent) {
    return (
      <div 
        style={{ 
          background: 'transparent',
          minHeight: '50px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <HashLoader color={loaderColor} size={size} />
      </div>
    );
  }

  return (
    <div role="status" className="flex justify-center items-center">
      <HashLoader color={loaderColor} size={size} />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default SpinnerLoader