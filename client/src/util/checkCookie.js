const checkCookie = () => {
  const cookie = document.cookie

  console.log('cookie:', decodeURIComponent(document.cookie))

  // if (token) {
  //   setAuthenticatedUser(token)
  //   const decoded = jwtDecode(token)
  //   // Set user data in Apollo cache

  //   // Check for expired token
  //   const currentTime = Date.now() / 1000
  //   if (decoded.exp < currentTime) {
  //     // Logout user
  //     logOutUser()
  //     // Redirect to home
  //     window.location.href = '/'
  //   }
  // }
}

export default checkCookie
