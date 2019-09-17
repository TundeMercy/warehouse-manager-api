function authRoute(authorizeUser) {
  return (req, res, next) => {
    const { user } = req.headers;
    if (authorizeUser.includes(user)) {
      return next();
    }
    return res.status(401).json({
      error: {
        code: 401,
        message: "You are not authorized to view this page"
      }
    });
  };
}
export default authRoute;
