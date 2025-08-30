import React from 'react'
import { HashLoader } from 'react-spinners'

const SpinnerLoader = ({ transparent = false }) => {
  if (transparent) {
    return (
      <div 
        style={{ 
          background: 'transparent',
          minHeight: '100px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <HashLoader color="#ffffff" />
      </div>
    );
  }

  return (
    <div role="status" className="flex justify-center items-center">
      <HashLoader color="#ffffff" />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default SpinnerLoader