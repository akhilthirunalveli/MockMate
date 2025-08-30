export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (title) => {
  if (!title) return "";

  const words = title.trim().split(/\s+/);
  let initials = "";

  if (words.length === 1) {
    initials = words[0][0];
  } else {
    initials = words[0][0] + words[1][0];
  }

  return initials.toUpperCase();
};