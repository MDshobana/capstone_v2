import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import Header from '../components/header';
import TrainerContent from "./trainerContent";


export function TrainerDashboard() {
    const [user, setUser] = useState(null);
    
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/auth/checklogin', { withCredentials: true }).then(res => {
            setUser(res.data.user);
        }).catch(error => {
            console.error('Error fetching protected data:', error.response?.data || error.message);
        });
    }, []);



    useEffect(() => {
        axios.get("http://localhost:5000/api/protected/courses", {
            withCredentials: true
        })
            .then(res => {
                setCourses(res.data);
            })
            .catch(err => console.log(err));
    }, []);
    if (!user) return <p>Loading...</p>;
    return (
        <div>
            <Header email={user.email} role={user.role} />
            <TrainerContent />
          
            
        </div>
    )
}

