import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import Header from '../components/header';
import TrainerContent from "./trainerContent";
import StudentAssignment from "./studentUpload";

export function StudentDashboard() {
    const [user, setUser] = useState("");
    useEffect(() => {
        axios.get('https://capstone-v2-xbv3.onrender.com/api/auth/checklogin', { withCredentials: true }).then(res => {
            setUser(res.data.user);
        }).catch(error => {
            console.error('Error fetching protected data:', error.response?.data || error.message);
        });
    }, []);

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>
             <Header email={user.email} role={user.role} />
             <TrainerContent />
             
        </div>
    )
}

