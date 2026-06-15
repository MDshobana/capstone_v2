import jwt from 'jsonwebtoken';
import cookies from 'cookie-parser';

const authMiddleware = (req, res, next) => {
    // const authHeader = req.headers['authorization'];
    // if (!authHeader) {
    //     return res.status(401).json({ message: 'Authorization header missing' });
    // }
    // print("Auth header", authHeader);
    // const token = authHeader.split(' ')[1];


    // if (process.env.NODE_ENV === "test") {
    //     req.user = {
    //         id: "507f1f77bcf86cd799439011",
    //         role: "student" // or "student"
    //     };
    //     return next();
    // }

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Token is missing" });
    }
    try {
        const decoded = jwt.verify(token, process.env.secret);
        req.user = decoded;
        console.log("authenticated user", decoded);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }

};

export default authMiddleware;
