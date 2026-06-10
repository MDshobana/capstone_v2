import { useEffect } from "react";

function Activate() {
    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get("token");
        if(token) {
            fetch("https://api.mylearningportal.site/api/auth/activate?token=" + token).then(response => {
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