import { useEffect, useState } from "react";
import axios from "../axiosConfig";
import NavAfterLogin from "./NavAfterLogin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserList() {

    const [user, setUser] = useState(null);
    const [userList, setUserList] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [search, setSearch] = useState("");

    // ==========================
    // FETCH USERS
    // ==========================
    useEffect(() => {
        fetchUsers();
        fetchLoggedUser();
    }, []);

    const fetchUsers = () => {
        axios.get("/getAllUsers", { withCredentials: true })
            .then(res => setUserList(res.data))
            .catch(err => {
                console.log(err);
                setUserList([]);
            });
    };

    const fetchLoggedUser = () => {
        axios.get("/test", { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    };

    // ==========================
    // DELETE USER
    // ==========================
    const confirmDelete = (id) => {
        setDeleteUserId(id);
    };

    const deleteUser = () => {
        axios.delete(`/users/${deleteUserId}`, { withCredentials: true })
            .then(res => {
                setUserList(res.data);
                setDeleteUserId(null);
                toast.success("User deleted successfully!");
            })
            .catch(err => {
                console.log(err);
                toast.error("Failed to delete user!");
            });
    };


    // ==========================
    // UPDATE USER
    // ==========================
    const submitUpdate = (e) => {
        e.preventDefault();

        axios.put(`/user/${editUser.id}`, editUser, { withCredentials: true })
            .then(res => {
                setUserList(res.data);
                setEditUser(null);
                toast.success("User updated successfully!");
            })
            .catch(err => {
                console.log(err);
                toast.error("Failed to update user!");
            });
    };

    // ==========================
    // SEARCH FILTER
    // ==========================
    const filteredUsers = userList.filter(u => {
        const q = search.toLowerCase();

        return (
            (u.name || "").toLowerCase().includes(q) ||
            (u.email || "").toLowerCase().includes(q) ||
            String(u.phone || "").toLowerCase().includes(q) ||
            String(u.dob || "").toLowerCase().includes(q) ||
            String(u.id || "").includes(q)
        );
    });

    return (
        <>
            <NavAfterLogin name={user?.name || ""} />

            <ToastContainer position="top-right" autoClose={3000} />

            <div className="container mt-4">

                {/* ================= SEARCH ================= */}
                <div className="row mb-3">
                    <div className="col-md-4 ms-auto">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name, email or phone"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* ================= UPDATE MODAL ================= */}
                {editUser && (
                    <div className="modal fade show d-block"
                         style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>

                        <div className="modal-dialog">
                            <div className="modal-content p-4">

                                <h5 className="mb-3">Update User</h5>

                                <form onSubmit={submitUpdate}>

                                    <input
                                        className="form-control mb-2"
                                        value={editUser.name || ""}
                                        onChange={e =>
                                            setEditUser({
                                                ...editUser,
                                                name: e.target.value
                                            })
                                        }
                                        placeholder="Name"
                                        required
                                    />

                                    <input
                                        className="form-control mb-2"
                                        value={editUser.email || ""}
                                        onChange={e =>
                                            setEditUser({
                                                ...editUser,
                                                email: e.target.value
                                            })
                                        }
                                        placeholder="Email"
                                        required
                                    />

                                    <input
                                        type="date"
                                        className="form-control mb-2"
                                        value={editUser.dob || ""}
                                        onChange={e =>
                                            setEditUser({
                                                ...editUser,
                                                dob: e.target.value
                                            })
                                        }
                                    />

                                    <input
                                        className="form-control mb-3"
                                        value={editUser.phone || ""}
                                        onChange={e =>
                                            setEditUser({
                                                ...editUser,
                                                phone: e.target.value
                                            })
                                        }
                                        placeholder="Phone"
                                    />

                                    <div className="text-end">
                                        <button
                                            type="submit"
                                            className="btn btn-success btn-sm me-2">
                                            Save
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => setEditUser(null)}>
                                            Cancel
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* ================= DELETE CONFIRMATION MODAL ================= */}
                {deleteUserId && (
                    <div className="modal fade show d-block"
                         style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>

                        <div className="modal-dialog">
                            <div className="modal-content p-4">

                                <h5 className="mb-3">Confirm Delete</h5>

                                <p>Are you sure you want to delete this user?</p>

                                <div className="text-end">
                                    <button
                                        className="btn btn-danger btn-sm me-2"
                                        onClick={deleteUser}>
                                        Yes, Delete
                                    </button>

                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => setDeleteUserId(null)}>
                                        Cancel
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                {/* ================= USER TABLE ================= */}
                <table className="table table-bordered table-hover">

                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>DOB</th>
                        <th>Phone</th>
                        <th>Action</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(u => (
                            <tr key={u.id}>
                                <td>BAC00{u.id}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.dob}</td>
                                <td>{u.phone}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => setEditUser(u)}>
                                        Update
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => confirmDelete(u.email)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                                No users found
                            </td>
                        </tr>
                    )}
                    </tbody>

                </table>

            </div>
        </>
    );
}

export default UserList;
