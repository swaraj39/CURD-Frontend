import { useState } from "react";
import axios from "../axiosConfig"; // custom axios instance (base URL, interceptors, etc.)
import Navbar from "./Navbar"; // top navigation bar component

// toast notification imports
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// bootstrap styling
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {

    // ---------------- STATE MANAGEMENT ----------------

    // controls whether form shows Login or Signup
    const [isLogin, setIsLogin] = useState(true);

    // stores username/email input
    const [username, setUsername] = useState("");

    // stores password input
    const [password, setPassword] = useState("");

    // stores name input (only used for signup)
    const [name, setName] = useState("");

    // stores error message if needed (currently unused visually)
    const [error, setError] = useState("");

    // ---------------- LOGIN HANDLER ----------------
    const handleLogin = async (e) => {
        e.preventDefault(); // prevent page refresh
        setError("");

        try {
            // create form-urlencoded data for backend authentication
            const params = new URLSearchParams();
            params.append("username", username);
            params.append("password", password);

            // send login request
            await axios.post("/login", params.toString(), {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });

            // redirect to dashboard on success
            window.location.replace("/dashboard");

        } catch {
            // show error toast if login fails
            toast.error("Invalid username or password");
        }
    };

    // ---------------- SIGNUP HANDLER ----------------
    const handleSignup = async (e) => {
        e.preventDefault(); // prevent page refresh
        setError("");

        try {
            // send signup request to backend
            await axios.post("/signin", {
                email: username,
                password,
                name
            });

            // success notification with custom styling
            toast.success("Signup successful! Please login.", {
                style: {
                    background: "#065f46",   // dark green background
                    color: "#ffffff",
                    fontWeight: "500"
                },
                icon: "✔️"
            });

            // clear all input fields after successful signup
            setUsername("");
            setPassword("");
            setName("");

            // automatically switch UI back to login form after delay
            setTimeout(() => {
                setIsLogin(true);
            }, 1500);

        } catch (err) {
            // extract backend error message safely
            const message = err.response?.data?.message || "Signup failed";
            toast.error(message);
        }
    };

    return (
        <>
            {/* Top navigation bar */}
            <Navbar />

            {/* Toast notification container */}
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar
                theme="colored"
            />

            {/* Centered container */}
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-5">

                        {/* ---------------- LOGIN / SIGNUP TOGGLE ---------------- */}
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

                        {/* ---------------- FORM CARD ---------------- */}
                        <div className="card shadow">
                            <div className="card-body">

                                {/* Dynamic title based on mode */}
                                <h3 className="text-center mb-3">
                                    {isLogin ? "Sign In" : "Sign Up"}
                                </h3>

                                {/* Form switches handler based on mode */}
                                <form onSubmit={isLogin ? handleLogin : handleSignup}>

                                    {/* Name input only visible in signup mode */}
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

                                    {/* Username / Email input */}
                                    <div className="mb-3">
                                        <input
                                            className="form-control"
                                            placeholder="Id"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Password input */}
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

                                    {/* Submit button text changes based on mode */}
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
