import React, { useState, useEffect } from "react";
import "../styles/User.css";
import Sidebar from "./Sidebar.jsx";
import TextField from "@mui/material/TextField";
import { Button, Modal, Box, IconButton, Tooltip } from "@mui/material/";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function User() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    middleName: "",
    userName: "",
    password: "",
  });

  useEffect(() => {
    fetchUsers();

    // Handle responsive layout
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  async function fetchUsers() {
    try {
      const { data } = await axios.get("http://localhost:1337/fetchusers");
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAddUser() {
    try {
      console.log("Sending user data:", formData);
      const response = await axios.post("http://localhost:1337/addusers", formData);
      console.log("Server response:", response.data);
      fetchUsers();
      setOpenAdd(false);
      setFormData({
        firstName: "",
        lastName: "",
        middleName: "",
        userName: "",
        password: "",
      });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  }

  async function handleDelete(_id) {
    try {
      await axios.delete(`http://localhost:1337/deleteuser/${_id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  }

  async function handleSaveChanges() {
    if (!editingUser) return;
    try {
      await axios.put(
        `http://localhost:1337/updateuser/${editingUser._id}`,
        formData
      );
      fetchUsers();
      setOpenEdit(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  function handleEdit(user) {
    setEditingUser(user);
    setFormData(user);
    setOpenEdit(true);
  }

  function handleOpenAddModal() {
    setEditingUser(null);
    setFormData({
      userId: "",
      firstName: "",
      lastName: "",
      middleName: "",
      userName: "",
      password: "",
    });
    setOpenAdd(true);
  }

  function maskPassword(password) {
    return showPassword ? password : "•".repeat(password?.length || 0);
  }

  return (
    <div className="app-container">
      <Sidebar onToggle={handleSidebarToggle} />
      <div
        className={`user-container ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <div className="userInfo">
          <div className="user-header">
            <h2>User Management</h2>
            <Tooltip title="Add User">
              <IconButton
                className="add-user-btn"
                onClick={handleOpenAddModal}
                color="inherit"
              >
                <PersonAddAlt1Icon />
              </IconButton>
            </Tooltip>
          </div>

          <div className="password-toggle">
            <Button
              startIcon={
                showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />
              }
              onClick={() => setShowPassword(!showPassword)}
              size="small"
              color="inherit"
            >
              {showPassword ? "Hide" : "Show"} Passwords
            </Button>
          </div>

          <div className="table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th className="user-id-col">User ID</th>
                  <th className="name-col">First Name</th>
                  <th className="name-col">Last Name</th>
                  <th className="name-col hide-on-mobile">Middle Name</th>
                  <th className="username-col">Username</th>
                  <th className="password-col hide-on-small">Password</th>
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td className="hide-on-mobile">{user.middleName}</td>
                    <td>{user.userName}</td>
                    <td className="hide-on-small">
                      {maskPassword(user.password)}
                    </td>
                    <td className="user-actions">
                      <IconButton
                        onClick={() => handleEdit(user)}
                        color="primary"
                        size="small"
                        className="action-btn"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(user._id)}
                        color="error"
                        size="small"
                        className="action-btn"
                      >
                        <PersonRemoveIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        className="user-modal"
      >
        <Box className="modal-box">
          <h2>Add User</h2>
          <TextField
            name="userId"
            label="User ID"
            value={formData.userId}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="middleName"
            label="Middle Name"
            value={formData.middleName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="userName"
            label="Username"
            value={formData.userName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              ),
            }}
          />
          <div className="modal-buttons">
            <Button variant="contained" color="primary" onClick={handleAddUser}>
              Add User
            </Button>
            <Button variant="outlined" onClick={() => setOpenAdd(false)}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>

      <Modal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        className="user-modal"
      >
        <Box className="modal-box">
          <h2>Edit User</h2>
          <TextField
            name="userId"
            label="User ID"
            value={formData.userId}
            onChange={handleChange}
            disabled
            fullWidth
            margin="normal"
          />
          <TextField
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="middleName"
            label="Middle Name"
            value={formData.middleName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="userName"
            label="Username"
            value={formData.userName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              ),
            }}
          />
          <div className="modal-buttons">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
            <Button variant="outlined" onClick={() => setOpenEdit(false)}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default User;
