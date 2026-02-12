import { useEffect, useState } from "react";
import axios from "../axiosConfig";
import NavAfterLogin from "./NavAfterLogin";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState("");
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]); // kept, but not displayed

    // 1️⃣ Check if user is logged in (unchanged)
    useEffect(() => {
        axios.get("/test", { withCredentials: true })
            .then(res => {
                setUser(res.data);
                console.log(res.data.name);
            })
            .catch(err => {
                console.log("User not logged in", err);
                setUser("");
            })
            .finally(() => setLoading(false));
    }, []);

    // 2️⃣ Fetch products only if user exists (kept but not used in UI)
    useEffect(() => {
        if (!user) return;
        axios.get("/get/allproducts")
            .then(res => {
                setProducts(Array.isArray(res.data) ? res.data : []);
            })
            .catch(err => {
                console.log("Error fetching products", err);
                setProducts([]);
            });
    }, [user]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status" />
            </div>
        );
    }

    if (!user || user === "") {
        return <Login />;
    }

    return (
        <>
            {/* Enhanced Navbar with user name */}
            <NavAfterLogin name={user?.name || "User"} />

            {/* ✨ HERO SECTION – Modern gradient, subtle animation */}
            <section className="position-relative overflow-hidden py-5 px-3 text-white"
                     style={{
                         background: "linear-gradient(145deg, #0B2F5F 0%, #1E4A7A 70%, #2E6E9E 100%)",
                         borderBottomLeftRadius: "30px",
                         borderBottomRightRadius: "30px",
                         boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
                     }}>
                <div className="container position-relative">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="display-4 fw-bold animate__animated animate__fadeInUp">
                                Welcome back, <span className="border-bottom border-3 border-warning">{user?.name || "User"}</span>
                            </h1>
                            <p className="lead fs-4 mt-3 opacity-90 animate__animated animate__fadeInUp animate__delay-1s">
                                Let's Go
                            </p>
                            <p className="fs-5 mt-2 animate__animated animate__fadeInUp animate__delay-2s">
                                Add Users and Track them!
                            </p>
                            <div className="mt-5 animate__animated animate__fadeInUp animate__delay-3s">
                                <button
                                    className="btn btn-warning btn-lg rounded-pill px-5 py-3 fw-semibold shadow-lg"
                                    onClick={() => navigate(`/addUser`)}
                                >
                                    <span className="me-2">➕</span> Add New User
                                </button>
                            </div>
                        </div>
                        <div className="col-lg-4 d-none d-lg-block text-center">
                            <div className="bg-white bg-opacity-10 p-4 rounded-circle d-inline-block">
                                <i className="bi bi-person-plus-fill" style={{ fontSize: "5rem", color: "rgba(255,255,255,0.9)" }}></i>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decorative wave */}
                <div className="position-absolute bottom-0 start-0 w-100">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ height: "60px", width: "100%" }}>
                        <path fill="#ffffff" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                    </svg>
                </div>
            </section>


            {/* Bootstrap Icons CDN (add to public/index.html if not already) */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />

            {/* Custom inline styles (or move to your CSS) */}
            <style>{`
                .animate__fadeInUp {
                    animation: fadeInUp 0.8s ease both;
                }
                .animate__delay-1s { animation-delay: 0.2s; }
                .animate__delay-2s { animation-delay: 0.4s; }
                .animate__delay-3s { animation-delay: 0.6s; }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translate3d(0, 30px, 0); }
                    to { opacity: 1; transform: translate3d(0, 0, 0); }
                }
            `}</style>
        </>
    );
}