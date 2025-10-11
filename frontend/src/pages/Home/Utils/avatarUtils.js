/**
 * Generate initials from a user's name
 * @param {string} name - The user's full name
 * @returns {string} - The initials (up to 2 characters)
 */
export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'U';
  
  const words = name.trim().split(' ').filter(word => word.length > 0);
  
  if (words.length === 0) return 'U';
  if (words.length === 1) return words[0][0].toUpperCase();
  
  // Take first letter of first word and first letter of last word
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

/**
 * Generate a color based on the user's name for consistent avatar backgrounds
 * @param {string} name - The user's name
 * @returns {string} - A CSS color value
 */
export const getAvatarColor = (name) => {
  if (!name) return '#6B7280'; // gray-500 as default
  
  const colors = [
    '#EF4444', // red-500
    '#F97316', // orange-500
    '#F59E0B', // amber-500
    '#EAB308', // yellow-500
    '#06B6D4', // cyan-500
    '#0EA5E9', // sky-500
    '#3B82F6', // blue-500
    '#6366F1', // indigo-500
    '#8B5CF6', // violet-500
    '#A855F7', // purple-500
    '#D946EF', // fuchsia-500
    '#EC4899', // pink-500
    '#F43F5E', // rose-500
  ];
  
  // Generate a consistent hash from the name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use the hash to select a color
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};
