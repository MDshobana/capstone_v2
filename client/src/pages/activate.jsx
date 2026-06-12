import { useEffect } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function Activate() {
    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get("token");
        if(token) {
            fetch(`${API_URL}/api/auth/activate?token=${token}`).then(response => {
                if(response.ok) {
                    alert("Account activated successfully! You can now log in.");
                } else {
                    response.json().then(data => {
                        alert("Activation failed: " + (data.message || "Unknown error"));
                    }).catch(() => {
                        alert("Activation failed: Unable to parse error response");
                    });
                }
            })
        }
    }, []);

    return (
        <div className="activate">
            <h1>Activating your account...</h1>
        </div>
    )
}

export default Activate;