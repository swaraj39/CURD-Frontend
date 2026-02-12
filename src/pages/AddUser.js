import React, { useEffect, useState, useRef } from "react";
import axios from "../axiosConfig";
import NavAfterLogin from "./NavAfterLogin";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaEnvelope, FaLock, FaCalendarAlt, FaPhone, FaPlusCircle } from "react-icons/fa";

function AddUser() {

    const emailRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        dob: "",
        phone: ""
    });

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState(false);

    useEffect(() => {
        axios.get("/test", { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "email") {
            setEmailError(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post("/add-user", formData, { withCredentials: true });

            toast.success(response.data.message || "User created successfully!");

            setFormData({
                name: "",
                email: "",
                password: "",
                dob: "",
                phone: ""
            });

            setTimeout(() => {
                window.location.replace("/dashboard");
            }, 1500);

        } catch (error) {

            const status = error.response?.status;
            const message = error.response?.data?.message;

            if (status === 409) {
                setEmailError(true);
                emailRef.current.focus();
                toast.error(message || "Email already exists!");
            }
            else if (status === 400) {
                toast.error(message || "Invalid Date of Birth!");
            }
            else {
                toast.error(message || "Something went wrong!");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* navbar*/}
            <NavAfterLogin name={user?.name} />

            <div style={styles.pageWrapper}>
                <ToastContainer position="top-right" autoClose={2000} theme="colored" />
                {/* acard shows*/}
                <div style={styles.cardContainer}>
                    <div style={styles.glassCard}>

                        <div style={styles.header}>
                            <div style={styles.iconCircle}>
                                <FaPlusCircle size={28} color="#4f46e5" />
                            </div>
                            <h2 style={styles.title}>Add New User</h2>
                            <p style={styles.subtitle}>Fill the details to create an account</p>
                        </div>

                        <form onSubmit={handleSubmit} style={{ width: "100%" }}>

                            {renderInput("name", "Full name", FaUser)}
                            {renderInput("email", "Email address", FaEnvelope, "email")}
                            {renderInput("password", "Password", FaLock, "password")}
                            {renderInput("dob", "", FaCalendarAlt, "date")}
                            {renderInput("phone", "Phone number", FaPhone, "tel")}

                            <button
                                type="submit"
                                disabled={loading}
                                style={styles.submitBtn}
                            >
                                {loading ? "Creating..." : "Create User"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );

    function renderInput(name, placeholder, Icon, type = "text") {
        return (
            <div style={styles.inputWrapper}>
                <Icon style={styles.inputIcon} />
                <input
                    ref={name === "email" ? emailRef : null}
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={name !== "dob" && name !== "phone"}
                    style={{
                        ...styles.input,
                        border: name === "email" && emailError
                            ? "2px solid #ef4444"
                            : "2px solid #e5e7eb"
                    }}
                />
            </div>
        );
    }
}

const styles = {

    pageWrapper: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f6f8fc, #eef2f7)",
        padding: "20px"
    },

    cardContainer: {
        width: "100%",
        maxWidth: "420px"
    },

    glassCard: {
        background: "white",
        borderRadius: "28px",
        padding: "40px 30px",
        boxShadow: "0 25px 50px rgba(0,0,0,0.1)"
    },

    header: {
        textAlign: "center",
        marginBottom: "30px"
    },

    iconCircle: {
        width: "60px",
        height: "60px",
        background: "#eef2ff",
        borderRadius: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 15px"
    },

    title: {
        fontWeight: 700,
        marginBottom: "5px"
    },

    subtitle: {
        color: "#6b7280",
        fontSize: "14px"
    },

    inputWrapper: {
        position: "relative",
        marginBottom: "18px"
    },

    inputIcon: {
        position: "absolute",
        top: "50%",
        left: "15px",
        transform: "translateY(-50%)",
        color: "#6b7280",
        fontSize: "14px"
    },

    input: {
        width: "100%",
        height: "48px",
        paddingLeft: "42px",
        borderRadius: "14px",
        outline: "none",
        fontSize: "14px",
        transition: "0.2s ease"
    },

    submitBtn: {
        width: "100%",
        height: "48px",
        background: "linear-gradient(135deg, #4f46e5, #6366f1)",
        border: "none",
        borderRadius: "30px",
        color: "white",
        fontWeight: 600,
        marginTop: "10px",
        cursor: "pointer"
    }
};

export default AddUser;
