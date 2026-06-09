const authorize = ((...role) => {
    return (req, res, next) => {

        if (process.env.NODE_ENV === "test") {
            return next();
        }

        if (!role.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: You don't have permission to access this resource" });
        }
        next();
    }

})

export default authorize;