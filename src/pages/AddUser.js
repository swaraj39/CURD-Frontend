import React, { useEffect, useState, useRef } from "react";
import axios from "../axiosConfig"; // custom axios instance (baseURL, interceptors etc.)
import NavAfterLogin from "./NavAfterLogin"; // navbar shown after login

// toast notification imports
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// icons for input fields
import { FaUser, FaEnvelope, FaLock, FaCalendarAlt, FaPhone, FaPlusCircle } from "react-icons/fa";

function AddUser() {

    // reference to email input (used to focus when email already exists)
    const emailRef = useRef(null);

    // ---------------- FORM STATE ----------------
    // holds values for all input fields
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        dob: "",
        phone: ""
    });

    // logged-in user info (used for navbar display)
    const [user, setUser] = useState(null);

    // loading state for submit button
    const [loading, setLoading] = useState(false);

    // controls red border on email field if duplicate email error
    const [emailError, setEmailError] = useState(false);

    // ---------------- FETCH LOGGED-IN USER ----------------
    // runs once when component loads
    useEffect(() => {
        axios.get("/test", { withCredentials: true })
            .then(res => setUser(res.data))   // store user info
            .catch(() => setUser(null));      // if not authenticated
    }, []);

    // ---------------- HANDLE INPUT CHANGE ----------------
    const handleChange = (e) => {
        const { name, value } = e.target;

        // update specific field in formData
        setFormData(prev => ({ ...prev, [name]: value }));

        // clear email error when user edits email
        if (name === "email") {
            setEmailError(false);
        }
    };

    // ---------------- SUBMIT FORM ----------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // disable button + show loading text

        try {
            // send form data to backend
            const response = await axios.post("/add-user", formData, { withCredentials: true });

            // show success message
            toast.success(response.data.message || "User created successfully!");

            // reset form after success
            setFormData({
                name: "",
                email: "",
                password: "",
                dob: "",
                phone: ""
            });

            // redirect to dashboard after short delay
            setTimeout(() => {
                window.location.replace("/dashboard");
            }, 1500);

        } catch (error) {

            // extract backend error info safely
            const status = error.response?.status;
            const message = error.response?.data?.message;

            // duplicate email error
            if (status === 409) {
                setEmailError(true);          // show red border
                emailRef.current.focus();     // focus email field
                toast.error(message || "Email already exists!");
            }
            // invalid date of birth error
            else if (status === 400) {
                toast.error(message || "Invalid Date of Birth!");
            }
            // generic error fallback
            else {
                toast.error(message || "Something went wrong!");
            }

        } finally {
            setLoading(false); // always stop loading
        }
    };

    return (
        <>
            {/* navbar with logged-in user's name */}
            <NavAfterLogin name={user?.name} />

            <div style={styles.pageWrapper}>
                {/* toast message container */}
                <ToastContainer position="top-right" autoClose={2000} theme="colored" />

                {/* main centered card */}
                <div style={styles.cardContainer}>
                    <div style={styles.glassCard}>

                        {/* header section */}
                        <div style={styles.header}>
                            <div style={styles.iconCircle}>
                                <FaPlusCircle size={28} color="#4f46e5" />
                            </div>
                            <h2 style={styles.title}>Add New User</h2>
                            <p style={styles.subtitle}>Fill the details to create an account</p>
                        </div>

                        {/* user creation form */}
                        <form onSubmit={handleSubmit} style={{ width: "100%" }}>

                            {/* reusable input renderer */}
                            {renderInput("name", "Full name", FaUser)}
                            {renderInput("email", "Email address", FaEnvelope, "email")}
                            {renderInput("password", "Password", FaLock, "password")}
                            {renderInput("dob", "", FaCalendarAlt, "date")}
                            {renderInput("phone", "Phone number", FaPhone, "tel")}

                            {/* submit button */}
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

    // ---------------- REUSABLE INPUT COMPONENT ----------------
    // renders input with icon + validation styling
    function renderInput(name, placeholder, Icon, type = "text") {
        return (
            <div style={styles.inputWrapper}>
                <Icon style={styles.inputIcon} />

                <input
                    ref={name === "email" ? emailRef : null} // attach ref only to email field
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}

                    // dob and phone are optional fields
                    required={name !== "dob" && name !== "phone"}

                    // conditional border color for email error
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

// ---------------- STYLES OBJECT ----------------
// inline CSS styles used across component
const styles = {

    // full page center layout
    pageWrapper: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f6f8fc, #eef2f7)",
        padding: "20px"
    },

    // wrapper to limit card width
    cardContainer: {
        width: "100%",
        maxWidth: "420px"
    },

    // main form card styling
    glassCard: {
        background: "white",
        borderRadius: "28px",
        padding: "40px 30px",
        boxShadow: "0 25px 50px rgba(0,0,0,0.1)"
    },

    // header layout
    header: {
        textAlign: "center",
        marginBottom: "30px"
    },

    // circular icon container
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

    // title text
    title: {
        fontWeight: 700,
        marginBottom: "5px"
    },

    // subtitle text
    subtitle: {
        color: "#6b7280",
        fontSize: "14px"
    },

    // input container for icon positioning
    inputWrapper: {
        position: "relative",
        marginBottom: "18px"
    },

    // icon inside input
    inputIcon: {
        position: "absolute",
        top: "50%",
        left: "15px",
        transform: "translateY(-50%)",
        color: "#6b7280",
        fontSize: "14px"
    },

    // input styling
    input: {
        width: "100%",
        height: "48px",
        paddingLeft: "42px",
        borderRadius: "14px",
        outline: "none",
        fontSize: "14px",
        transition: "0.2s ease"
    },

    // submit button styling
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
