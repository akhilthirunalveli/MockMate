const handleGoogleLogin = () => {
  window.location.href = "/api/auth/google";
};

<button onClick={handleGoogleLogin}>Sign in with Google</button>
