import React from 'react';

// React 18 compatibility wrapper to prevent Children property errors
const ReactWrapper = React;

// Ensure React object has proper structure to prevent undefined property access
if (ReactWrapper && typeof ReactWrapper === 'object') {
  // Ensure Children property exists and is properly defined
  if (!ReactWrapper.Children) {
    ReactWrapper.Children = React.Children;
  }
  
  // Ensure all essential React properties are available
  if (!ReactWrapper.Component) {
    ReactWrapper.Component = React.Component;
  }
  
  if (!ReactWrapper.createElement) {
    ReactWrapper.createElement = React.createElement;
  }
  
  if (!ReactWrapper.Fragment) {
    ReactWrapper.Fragment = React.Fragment;
  }

  // Ensure forwardRef property exists and is properly defined
  if (!ReactWrapper.forwardRef) {
    ReactWrapper.forwardRef = React.forwardRef;
  }
}

export default ReactWrapper;
