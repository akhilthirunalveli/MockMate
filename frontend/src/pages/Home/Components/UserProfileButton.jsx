import React from "react";

const UserProfileButton = ({ user, onClick }) => {
    const getAvatarColor = (name) => {
        const colors = [
            '#EF4444', '#F97316', '#F59E0B', '#10B981',
            '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'
        ];
        if (!name) return '#6B7280';
        const charCodeSum = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        return colors[Math.abs(charCodeSum) % colors.length];
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        const words = name.trim().split(' ').filter(word => word.length > 0);
        if (words.length === 0) return 'U';
        if (words.length === 1) return words[0][0].toUpperCase();
        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    };

    const hasPhoto = (user.profileImageUrl && user.profileImageUrl.startsWith('http')) || user.photoURL;

    return (
        <button
            onClick={onClick}
            className="group relative flex items-center gap-4 p-2 pr-6 rounded-full 
                 bg-white/0.8 backdrop-blur-xl border border-white/10 
                 hover:bg-white/1 hover:border-white/20 hover:scale-[1.02] cursor-pointer
                 transition-all duration-300 ease-out shadow-2xl overflow-hidden"
        >
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-white/5 to-blue-500/0 
                      -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <div className="relative">
                {hasPhoto ? (
                    <img
                        src={user.profileImageUrl || user.photoURL}
                        alt="profile"
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-lg"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white/20"
                        style={{ backgroundColor: getAvatarColor(user.name) }}
                    >
                        {user?.profileImageUrl && !user.profileImageUrl.startsWith('http')
                            ? user.profileImageUrl
                            : getInitials(user.name)}
                    </div>
                )}

                {/* Status indicator or subtle dot */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0a0a0a] rounded-full shadow-sm" />
            </div>

            <div className="flex flex-col items-start min-w-0 max-w-[150px]">
                <span className="font-semibold text-white text-xs truncate w-full">
                    {user.name || user.email?.split('@')[0] || 'User'}
                </span>
                <span className="font-normal text-white/50 text-[10px] truncate w-full">
                    {user.email}
                </span>
            </div>

            <div className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white/30 group-hover:text-white/60"
                >
                    <path d="m9 18 6-6-6-6" />
                </svg>
            </div>
        </button>
    );
};

export default UserProfileButton;
