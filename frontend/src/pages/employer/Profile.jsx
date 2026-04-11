import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Camera, Mail, Phone, MapPin, Briefcase, Edit2 } from "lucide-react";
import EditEmployerProfileModal from "./components/EditEmployerProfileModal";
import EditProfilePhoto from "../jobseeker/UpdateProfile/EditProfilePhoto";
import { setUser } from "../../redux/authSlice";

const Profile = () => {
  const { user } = useSelector((store) => store.auth);
  const [showEditIntro, setShowEditIntro] = useState(false);
  const [showEditPhoto, setShowEditPhoto] = useState(false);

  return (
    <div className="p-4 bg-light min-vh-100">
      <div className="mb-4">
        <h3 className="fw-bold mb-1">My Profile</h3>
        <p className="text-muted mb-0">Manage your personal information and how it appears to others.</p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-8">
          {/* Personal Info Card */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                <div className="d-flex align-items-center gap-4">
                  <div className="position-relative">
                    {user?.profile?.profilePhoto ? (
                      <img 
                        src={user.profile.profilePhoto} 
                        alt="Profile" 
                        className="rounded-circle object-fit-cover shadow-sm border"
                        style={{ width: "100px", height: "100px" }}
                      />
                    ) : (
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: "100px", height: "100px", fontSize: "40px" }}>
                        {user?.fullname?.charAt(0) || 'U'}
                      </div>
                    )}
                    <button 
                      className="btn btn-white btn-sm position-absolute bottom-0 end-0 rounded-circle border shadow-sm p-1"
                      onClick={() => setShowEditPhoto(true)}
                    >
                      <Camera size={16} className="text-primary" />
                    </button>
                  </div>
                  <div>
                    <h4 className="fw-bold mb-1">{user?.fullname}</h4>
                    <p className="text-muted mb-2 d-flex align-items-center gap-2">
                      <Briefcase size={16} />
                      {user?.profile?.headline || (user?.role === 'employer' ? 'Employer / Hiring Manager' : user?.role)}
                    </p>
                    <div className="d-flex gap-2">
                      <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-normal">Verified Account</span>
                    </div>
                  </div>
                </div>
                <button 
                  className="btn btn-outline-primary btn-sm px-4 rounded-pill fw-semibold"
                  onClick={() => setShowEditIntro(true)}
                >
                  <Edit2 size={14} className="me-2" />
                  Edit Profile
                </button>
              </div>

              <hr className="my-4 opacity-50" />

              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-2 rounded-3 text-primary">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-muted fs-13 mb-0">Email Address</p>
                      <p className="fw-semibold mb-0">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-2 rounded-3 text-success">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-muted fs-13 mb-0">Phone Number</p>
                      <p className="fw-semibold mb-0">{user?.phoneNumber || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-2 rounded-3 text-warning">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-muted fs-13 mb-0">Location</p>
                      <p className="fw-semibold mb-0">{user?.profile?.location || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          {/* Company Quick View */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4 text-center">
              <h5 className="fw-bold mb-4 text-start">Current Company</h5>
              {user?.company ? (
                <>
                  <div className="mb-3 mx-auto shadow-sm rounded-3 border p-1" style={{ width: "80px", height: "80px" }}>
                    <img 
                      src={user.company.logo} 
                      alt="Company Logo" 
                      className="w-100 h-100 object-fit-contain rounded-3"
                    />
                  </div>
                  <h6 className="fw-bold mb-1">{user.company.name}</h6>
                  <p className="text-muted fs-14 mb-3">{user.company.industry}</p>
                  <button 
                    className="btn btn-primary w-100 rounded-pill fs-14 fw-semibold"
                    onClick={() => window.location.href = '/employer/company/profile'}
                  >
                    View Company Profile
                  </button>
                </>
              ) : (
                <div className="py-4">
                  <p className="text-muted mb-3">No company profile associated.</p>
                  <button 
                    className="btn btn-outline-primary rounded-pill fs-14 fw-semibold px-4"
                    onClick={() => window.location.href = '/employer/company/setup'}
                  >
                    Create Company
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEditIntro && (
        <EditEmployerProfileModal 
          show={showEditIntro} 
          setShow={setShowEditIntro} 
        />
      )}
      {showEditPhoto && (
        <EditProfilePhoto 
          showProfilePhotoModal={showEditPhoto} 
          setShowProfilePhotoModal={setShowEditPhoto} 
        />
      )}
    </div>
  );
};

export default Profile;
