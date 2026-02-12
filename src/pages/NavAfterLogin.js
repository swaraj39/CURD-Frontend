import { Link } from "react-router-dom"; // for client-side navigation without page reload
import { useEffect, useState } from "react";
import axios from "axios"; // (currently unused here but imported if future API calls are added)

function NavAfterLogin({ name }) {

    // receives logged-in user's name as prop from parent component
    // used to display greeting in navbar

    return (
        // main navigation bar
        <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#ffffff' }}>

            {/* fluid container keeps navbar responsive */}
            <div className="container-fluid " style={{color:'#ff0000'}}>

                {/* application title / brand name */}
                <a className="navbar-brand" href="#">
                    Altarians Management System
                </a>

                {/* toggle button for mobile view */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarText"
                    aria-controls="navbarText"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* collapsible menu section */}
                <div className="collapse navbar-collapse" id="navbarText">

                    {/* left side navigation links */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2">

                        {/* dashboard / home link */}
                        <li className="nav-item ml-2">
                            <Link className="nav-link active" to="/dashboard">
                                Home
                            </Link>
                        </li>

                        {/* all users page link */}
                        <li className="nav-item ml-2">
                            <Link className="nav-link" to="/allUser">
                                All Users
                            </Link>
                        </li>

                        {/* navigation area reserved for future items */}
                        {/* fetch all users */}
                    </ul>

                    {/* right side greeting with logged-in user name */}
                    <span className="navbar-brand" style={{ fontWeight: 'bold' }}>
                        Hello, {name} {/* shows name if available */}
                    </span>

                </div>
            </div>
        </nav>
    );
}

export default NavAfterLogin;
