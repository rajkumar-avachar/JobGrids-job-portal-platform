import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useSelector, useDispatch } from "react-redux";
import { USER_API } from "../../../utils/apis";
import axios from "axios";
import { setUser } from "../../../redux/authSlice";
import { toast } from "react-toastify";

const EditEmployerProfileModal = ({ show, setShow }) => {
  const handleClose = () => setShow(false);

  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: "",
    headline: "",
    location: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (user) {
      setInput({
        fullname: user?.fullname || "",
        headline: user?.profile?.headline || "",
        location: user?.profile?.location || "",
        phoneNumber: user?.phoneNumber || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to update your profile.");
      return;
    }
    try {
      const res = await axios.put(`${USER_API}/updateProfile`, input, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Profile updated successfully");
        handleClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="fs-5 fw-bold">Edit Profile Info</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit} className="fs-14">
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Full Name *</Form.Label>
            <Form.Control
              type="text"
              name="fullname"
              value={input.fullname}
              onChange={handleInputChange}
              required
              className="py-2"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Current Role</Form.Label>
            <Form.Control
              type="text"
              name="headline"
              value={input.headline}
              onChange={handleInputChange}
              placeholder="e.g. HR Manager, Tech Lead"
              className="py-2"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={input.location}
              onChange={handleInputChange}
              placeholder="e.g. New York, USA"
              className="py-2"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Email (Read-only)</Form.Label>
            <Form.Control
              type="email"
              value={user?.email || ""}
              disabled
              className="bg-light border-0 py-2"
            />
            <Form.Text className="text-muted fs-12">
              Contact support to change your account email.
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={handleInputChange}
              maxLength={10}
              pattern="[0-9]{10}"
              placeholder="10-digit number"
              className="py-2"
            />
          </Form.Group>
          <Modal.Footer className="px-0 pb-0 pt-3 border-top-0">
            <Button
              variant="light"
              onClick={handleClose}
              className="fs-14 fw-medium border px-4 rounded-pill"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="btn bg-blue fs-14 fw-medium border-0 px-4 rounded-pill"
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditEmployerProfileModal;
