function authRoute(authorizeUser) {
  return (req, res, next) => {
    const { role } = req.headers;
    if (authorizeUser.includes(role)) {
      return next();
    }
    return res.status(401).json({
      error: {
        code: 401,
        message: "You are not authorized to make this request"
      }
    });
  };
}
export default authRoute;
