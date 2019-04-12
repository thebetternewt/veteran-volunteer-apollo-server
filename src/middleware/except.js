const except = (path, middleware) => {
  return (req, res, next) => {
    if (path.indexOf(req.path) > -1) {
      // Exclude
      return next()
    } else {
      // Apply for all others
      return middleware(req, res, next)
    }
  }
}

export default except
