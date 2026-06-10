import jwt from 'jsonwebtoken';
import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import googleAuth from 'google-auth-library';
import cookies from 'cookie-parser';
import { Resend } from 'resend';

import authMiddleware from '../middleware/auth.js';

const client = new googleAuth.OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);


async function verifyGoogleToken(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
}


function generateToken() {
    return crypto.randomBytes(32).toString('hex');

}

const activationLink = async (email, token) => {
    try {
        await resend.emails.send({
            from: 'MyLearning <noreply@mylearningportal.site>',
            to: email,
            subject: "Activation Link for MyLearning Portal",
            html: `<p> Dear ${email},</p>
            <p>Thank you for registering on MyLearning Portal. Please click the link below to activate your account:</p>
            <a href="https://capstone-v2-xbv3.onrender.com/api/auth/activate?token=${token}">
            Activate Account
            </a>
        
            <p>Best regards,</p>
            <p>MyLearning Portal Team</p>`
        });
        console.log("✅ Email sent");
    }

    catch (error) {
        console.error("❌ Email failed:", error);
    }
};

// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.sender_email,
//         pass: process.env.sender_password
//     }
// });

// let mailOptions = {
//     from: process.env.sender_email,
//     to: email,
//     subject: "Activation Link for MyLearning Portal",
//     html: `<p> Dear ${email},</p>
//     <p>Thank you for registering on MyLearning Portal. Please click the link below to activate your account:</p>
//     <a href="https://capstone-v2-xbv3.onrender.com/api/auth/activate?token=${token}">
//     Activate Account
//     </a>

//     <p>Best regards,</p>
//     <p>MyLearning Portal Team</p>
//     `
// };

// await transporter.sendMail(mailOptions);
// }


const forgotPasswodLink = async (email, resetLink) => {
    try {
        await resend.emails.send({
            from: 'MyLearning <noreply@mylearningportal.site>',
            to: email,
            subject: "Password Reset Link for MyLearning Portal",
            html: `<p> Dear ${email},</p>
            <p>Thank you for registering on MyLearning Portal. Please click the link below to activate your account:</p>
            <a href="${resetLink}">
            Reset Password
            </a>

            <p>If you did not request a password reset, please ignore this email.</p>

            <p>Best regards,</p>
            <p>MyLearning Portal Team</p>`
        });
        console.log("✅ Email sent");
    }

    catch (error) {
        console.error("❌ Email failed:", error);
    }
};
    // let transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //         user: process.env.sender_email,
    //         pass: process.env.sender_password
    //     }
    // });

    // let mailOptions = {
    //     from: process.env.sender_email,
    //     to: email,
    //     subject: "Password Reset Link for MyLearning Portal",
    //     html: `<p> Dear ${email},</p>
    //     <p>We received a request to reset your password for your MyLearning Portal account. Please click the link below to reset your password:</p>
    //     <a href="${resetLink}">
    //     Reset Password
    //     </a>
        
    //     <p>If you did not request a password reset, please ignore this email.</p>
        
    //     <p>Best regards,</p>
    //     <p>MyLearning Portal Team</p>
    //     `
    // }

    // await transporter.sendMail(mailOptions);

// }


router.post('/forgotpassword', async (req, res) => {

    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email does not exist" });
        }

        const user = await User.findOne({ email });
        const token = generateToken();

        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetLink = "https://capstone-v2-indol.vercel.app/resetpassword/" + token;

        await forgotPasswodLink(email, resetLink);

        res.json({ message: "email sent to reset password successfully" });
    } catch (error) {
        console.error("Error during email selection:", error);
        return res.status(500).json({ message: "Internal server error during email selection" });
    }
}

)

router.post('/resetpassword/:token', async (req, res) => {
    try {
        const { token } = req.params;
        console.log(req.body);
        const { newPassword } = req.body;
        const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();
        res.json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error during password reset:", error);
        return res.status(500).json({ message: "Internal server error during password reset" });
    }
});

router.post('/google-login', async (req, res) => {

    const { token } = req.body;
    try {
        const googleUser = await verifyGoogleToken(token);
        if (!googleUser) {
            return res.status(400).json({ message: "Invalid Google token" });
        }
        const email = googleUser.email;
        if (!email) {
            return res.status(400).json({ message: "Google account does not have an email" });
        }
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                firstName: googleUser.given_name || '',
                lastName: googleUser.family_name || '',
                email,
                age: 0,
                isVerified: true,
                expiry: null,
                resetToken: null,
                resetTokenExpiry: null,
                role: 'student',
            });
            await user.save();
        }

        const jwtToken = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, process.env.secret, { expiresIn: '1d' });

        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: true, // process.env.NODE_ENV === 'production',
            sameSite: "none",
            path: "/",
            domain: ".onrender.com"
            maxAge: 24 * 60 * 60 * 1000
        })

        res.json({ message: "Google login successful", user: { email: user.email, role: user.role } });

    } catch (error) {
        console.log("Error during Google login:", error)
        return res.status(500).json({ message: "Internal server error during Google login" });
    };
});


router.get('/activate', async (req, res) => {


    try {
        const token = req.query.token;
        const activateUser = await User.findOne({ token, isVerified: false });
        if (!activateUser) {
            return res.status(400).json({ message: "Invalid activation link" });
        }
        if (activateUser.expiry < Date.now()) {
            return res.status(400).json({ message: "Activation link expired" });
        }
        activateUser.isVerified = true;
        activateUser.token = null;
        activateUser.expiry = null;
        await activateUser.save();
        res.json({ message: "Account activated successfully" });
    } catch (error) {
        console.error("Error during account activation:", error);
        res.status(500).json({ message: "Internal server error" });
    }

});

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    console.log("Request body:", req.body);
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const activationtoken = generateToken();
        const newUser = new User({
            firstName,
            lastName,
            email,
            age: 0,
            token: activationtoken,
            expiry: Date.now() + 3600000,
            isVerified: false,
            password: hashedPassword,
            role,
        })
        await newUser.save();
        activationLink(newUser.email, activationtoken);
        console.log("User registered successfully");

    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.send({ message: 'Registration successful' });
});

router.get('/checklogin', authMiddleware, (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not logged in" });
    const decoded = jwt.verify(token, process.env.secret);
    res.json({ loggedIn: true, user: { email: decoded.email, firstName: decoded.firstName, lastName: decoded.lastName, role: decoded.role } });
});


router.post('/logout', (req, res) => {
    res.clearCookie("token");
    res.json("Logged out successfully");

})


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isVerified: true });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });

    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ message: "Password doesnot match" })
    }

    jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, process.env.secret, { expiresIn: '1hr' }, (err, token) => {
        if (err) {
            console.log("Error generating toekn:", err);
        }
        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // process.env.NODE_ENV === 'production',
            sameSite: "none",
            path: "/",
            domain: ".onrender.com"
            maxAge: 60 * 60 * 1000

        })
        return res.json({ user: { email: user.email, role: user.role }, message: "Login successful" });
    });

    console.log("Received login data:", req.body);
});

export default router;
