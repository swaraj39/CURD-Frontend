import { useState } from "react";
import axios from "../axiosConfig";
import Navbar from "./Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {

    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const params = new URLSearchParams();
            params.append("username", username);
            params.append("password", password);

            await axios.post("/login", params.toString(), {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });

            window.location.replace("/dashboard");

        } catch {
            toast.error("Invalid username or password");
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
// put request
        try {
            await axios.post("/signin", {
                email: username,
                password,
                name
            });
            // sucess url
            toast.success("Signup successful! Please login.", {
                style: {
                    background: "#065f46",   // Dark green
                    color: "#ffffff",
                    fontWeight: "500"
                },
                icon: "✔️"
            });

            // Clear fields
            setUsername("");
            setPassword("");
            setName("");

            // Switch to login after 1.5 sec
            setTimeout(() => {
                setIsLogin(true);
            }, 1500);

        } catch (err) {
            const message = err.response?.data?.message || "Signup failed";
            toast.error(message);
        }
    };

    return (
        <>
            <Navbar />

            {/* ✅ Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar
                theme="colored"
            />

            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-5">

                        {/* Toggle Buttons */}
                        <div className="btn-group w-100 mb-3">
                            <button
                                className={`btn ${isLogin ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setIsLogin(true)}
                            >
                                Sign In
                            </button>
                            <button
                                className={`btn ${!isLogin ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setIsLogin(false)}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Card */}
                        <div className="card shadow">
                            <div className="card-body">
                                <h3 className="text-center mb-3">
                                    {isLogin ? "Sign In" : "Sign Up"}
                                </h3>

                                <form onSubmit={isLogin ? handleLogin : handleSignup}>

                                    {!isLogin && (
                                        <div className="mb-3">
                                            <input
                                                className="form-control"
                                                placeholder="Name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <input
                                            className="form-control"
                                            placeholder="Id"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <input
                                            className="form-control"
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button className="btn btn-success w-100">
                                        {isLogin ? "Login" : "Create Account"}
                                    </button>

                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
