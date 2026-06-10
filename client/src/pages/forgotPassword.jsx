import react, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        await axios.post("https://api.mylearningportal.site/api/auth/forgotpassword", { email });
        console.log("Reset password for:", email);
    }

    return (
        <div className="forgotPassword">
            <h1>Forgot Password</h1>
            <form onSubmit={handleForgotPassword}>
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button> Send email</button>
            </form>

        </div>
    );
}

export function ResetPassword() {
    const {token}= useParams();

    const [passwordData, setPasswordData] = useState({
        newPassword:"",
        confirmPassword:""});

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if(passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        await axios.post(`https://api.mylearningportal.site/api/auth/resetpassword/${token}`, {newPassword: passwordData.newPassword} );
        console.log("Reset password to:", passwordData.newPassword);
    }

    const handleChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    }

    return (
        <div className="resetPassword">
            <h1>Reset Password</h1>
            <form onSubmit={handleResetPassword}>
                <input type="password" name= "newPassword" placeholder="New Password" value={passwordData.newPassword} onChange={handleChange} />
                <input type="password" name= "confirmPassword" placeholder="Confirm Password" value={passwordData.confirmPassword} onChange={handleChange} />
                <button> Reset Password</button>
            </form>

        </div>
    );
}