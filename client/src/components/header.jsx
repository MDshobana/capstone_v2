import { useState } from "react";


function Header({email, role}){
    

    return(
        <div>
            <header className="relative bg-gray-200 shadow-sm">
                <div div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    <p>Welcome, {email}!</p>
                    <p>Your role is: {role}</p>
                </div>
            </header>
        </div>
    );
}

export default Header;