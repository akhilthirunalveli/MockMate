import React from 'react';
import { getInitials, getAvatarColor } from '../../utils/avatarUtils';

const Avatar = ({ 
  user, 
  size = 'md', 
  className = '',
  onClick,
  showHover = false 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-lg',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-20 h-20 text-3xl'
  };

  // Ensure we have a valid size
  const validSize = sizeClasses[size] ? size : 'md';
  
  try {
    // Safely get user data with fallbacks
    const userName = user?.name || user?.displayName || '';
    const profileImage = user?.profileImageUrl || user?.photoURL || user?.profileImage;
    
    const initials = getInitials(userName);
    const avatarColor = getAvatarColor(userName);

    const baseClasses = `
      ${sizeClasses[validSize]} 
      rounded-full 
      flex 
      items-center 
      justify-center 
      font-bold 
      text-white 
      border-2 
      border-transparent 
      transition-all 
      duration-200
      ${showHover ? 'hover:border-white/30 hover:scale-105' : ''}
      ${onClick ? 'cursor-pointer' : ''}
      ${className}
    `.replace(/\s+/g, ' ').trim();

    if (profileImage) {
      return (
        <img
          src={profileImage}
          alt={userName || 'Profile'}
          className={`${baseClasses} object-cover`}
          referrerPolicy="no-referrer"
          onClick={onClick}
          onError={(e) => {
            console.warn('Avatar image failed to load:', profileImage);
            e.target.style.display = 'none';
          }}
        />
      );
    }

    return (
      <div
        className={baseClasses}
        style={{ backgroundColor: avatarColor }}
        onClick={onClick}
      >
        {initials}
      </div>
    );

  } catch (error) {
    console.error('Avatar component error:', error);
    // Fallback avatar
    const fallbackClasses = `${sizeClasses[validSize]} rounded-full flex items-center justify-center font-bold text-white bg-gray-500 ${className}`.replace(/\s+/g, ' ').trim();
    
    return (
      <div
        className={fallbackClasses}
        onClick={onClick}
      >
        {user?.name?.[0]?.toUpperCase() || 'U'}
      </div>
    );
  }
};

export default Avatar;
