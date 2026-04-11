import React, { useState } from "react";
import { Lock, Bell, Shield, Eye, EyeOff, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { USER_API } from "../../utils/apis";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/authSlice";
import { Modal, Button } from "react-bootstrap";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      return toast.error("Please fill in all fields");
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    
    try {
      setLoading(true);
      const res = await axios.put(`${USER_API}/change-employer-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        withCredentials: true
      });

      if (res.data.success) {
        toast.success("Password updated successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true);
      const res = await axios.delete(`${USER_API}/delete-employer-account`, {
        withCredentials: true
      });

      if (res.data.success) {
        toast.success("Account deleted successfully");
        dispatch(logout());
        localStorage.removeItem("user");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="p-4 bg-light min-vh-100">
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Settings</h3>
        <p className="text-muted mb-0">Manage your account preferences and security.</p>
      </div>

      <div className="row g-4 flex-column">
        {/* Account Security - Stacked Vertically */}
        <div className="col-12 col-xl-10 mx-auto">
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-4">
                <Shield className="text-primary" size={20} />
                <h5 className="fw-bold mb-0">Account Security</h5>
              </div>

              <form onSubmit={updatePassword}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fs-14 fw-semibold">Current Password</label>
                    <div className="position-relative">
                      <input 
                        type={showPasswords.current ? "text" : "password"}
                        className="form-control py-2 fs-14"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                      />
                      <button 
                        type="button"
                        className="btn position-absolute top-50 end-0 translate-middle-y border-0"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPasswords.current ? <EyeOff size={18} className="text-muted" /> : <Eye size={18} className="text-muted" />}
                      </button>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label fs-14 fw-semibold">New Password</label>
                    <div className="position-relative">
                      <input 
                        type={showPasswords.new ? "text" : "password"}
                        className="form-control py-2 fs-14"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                      />
                      <button 
                        type="button"
                        className="btn position-absolute top-50 end-0 translate-middle-y border-0"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPasswords.new ? <EyeOff size={18} className="text-muted" /> : <Eye size={18} className="text-muted" />}
                      </button>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label fs-14 fw-semibold">Confirm New Password</label>
                    <div className="position-relative">
                      <input 
                        type={showPasswords.confirm ? "text" : "password"}
                        className="form-control py-2 fs-14"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                      />
                      <button 
                        type="button"
                        className="btn position-absolute top-50 end-0 translate-middle-y border-0"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPasswords.confirm ? <EyeOff size={18} className="text-muted" /> : <Eye size={18} className="text-muted" />}
                      </button>
                    </div>
                  </div>
                  <div className="col-12 mt-4 text-end">
                    <button className="btn btn-primary px-4 py-2 fw-semibold fs-14 rounded-pill" type="submit" disabled={loading}>
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Notifications - Stacked Vertically */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-4">
                <Bell className="text-primary" size={20} />
                <h5 className="fw-bold mb-0">Notification Preferences</h5>
              </div>

              <div className="d-flex flex-column gap-4">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="fw-semibold mb-0 fs-14">Email Notifications</p>
                    <p className="text-muted mb-0 fs-13">Receive emails about new applications and company updates.</p>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" defaultChecked style={{ width: '40px', height: '20px', cursor: 'pointer' }} />
                  </div>
                </div>
                
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="fw-semibold mb-0 fs-14">Job Alerts</p>
                    <p className="text-muted mb-0 fs-13">Get notified when your job postings are expiring or receiving high volume.</p>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" defaultChecked style={{ width: '40px', height: '20px', cursor: 'pointer' }} />
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="fw-semibold mb-0 fs-14">Security Alerts</p>
                    <p className="text-muted mb-0 fs-13">Get notified of unusual login activity or account changes.</p>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" defaultChecked style={{ width: '40px', height: '20px', cursor: 'pointer' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="card border-danger border-opacity-25 shadow-sm rounded-4 bg-danger bg-opacity-10">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Trash2 className="text-danger" size={20} />
                <h5 className="fw-bold mb-0 text-danger">Delete Account</h5>
              </div>
              <p className="text-muted fs-14 mb-4">
                Once you delete your account, there is no going back. All your data, including company profiles and job postings, will be permanently removed.
              </p>
              <div className="text-end">
                <button 
                  className="btn btn-danger px-4 py-2 fw-semibold fs-14 rounded-pill"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete My Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Body className="p-4 text-center">
          <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex p-3 mb-3">
            <AlertTriangle size={32} />
          </div>
          <h4 className="fw-bold mb-2 fs-5">Are you absolutely sure?</h4>
          <p className="text-muted mb-4 fs-14">
            This action cannot be undone. This will permanently delete your account and all associated data from our servers.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="light" className="px-4 py-2 border fw-semibold rounded-pill fs-14" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              className="px-4 py-2 fw-semibold rounded-pill fs-14" 
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Yes, Delete Account"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Settings;
