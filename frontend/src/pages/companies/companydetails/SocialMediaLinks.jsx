import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { Link } from "react-router-dom";

const SocialMediaLinks = () => {
  return (
    <div className=" bg-white rounded-3 col p-3 p-md-4 shadow-sm border">
      <h5 className="fs-18 fw-semibold">Connect with Microsoft</h5>
      <div className="d-flex my-3 fs-5 align-items-center social-links gap-3">
        <Link to="#" className="text-body"><FaLinkedin/></Link> 
        <Link to="#" className="text-body"><FaFacebook/></Link>
        <Link to="#" className="text-body"><FaSquareXTwitter /></Link> 
        <Link to="#" className="text-body"><FaInstagramSquare /></Link>
      </div>
    </div>
  );
};

export default SocialMediaLinks;
