import React from 'react';
import { getInitials, getAvatarColor } from '../../utils/avatarUtils';

const Avatar = ({ 
  user, 
  size = 'md', 
  className = '',
  onClick,
  showHover = false 
}) => {
  console.log('Avatar rendering with user:', user); // Debug log
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-lg',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-20 h-20 text-3xl'
  };

  try {
    const initials = getInitials(user?.name);
    const avatarColor = getAvatarColor(user?.name);
    const profileImage = user?.profileImageUrl || user?.photoURL;

    const baseClasses = `
      ${sizeClasses[size]} 
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
    `;

    if (profileImage) {
      return (
        <img
          src={profileImage}
          alt={user?.name || 'Profile'}
          className={`${baseClasses} object-cover`}
          referrerPolicy="no-referrer"
          onClick={onClick}
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
    // Fallback to simple initial
    return (
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white bg-gray-500 ${className}`}
        onClick={onClick}
      >
        {user?.name?.[0] || 'U'}
      </div>
    );
  }
};

export default Avatar;
