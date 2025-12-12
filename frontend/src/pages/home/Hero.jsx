import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <header className="border-bottom">
      <div className="container pt-md-3 d-flex justify-content-between align-items-center gap-md-3 flex-wrap flex-md-nowrap px-0">
        <div className=" py-4 px-3 px-sm-0 text-center text-md-start w-100">
          <span className="badge bg-light-blue text-muted border py-2 fs-14 rounded-pill fw-semibold d-inline-flex align-items-center gap-2">
            <span className="blinking-dot bg-primary"></span>
            Over 10,000+ active job listings
          </span>

          <h1 className="fw-bold mt-3">
            India's Smartest Platform for <br />
            <span className="text-primary">Tech Careers</span>
          </h1>
          <h6 className="text-muted my-md-4">
            Discover jobs & internships for freshers and working professionals.
          </h6>
          <Link to="/jobs" className="text-decoration-none">
            <button className="btn bg-blue fw-medium py-2 mt-3 mt-md-0">
              Find Jobs Now <ArrowRight size={16} />
            </button>
          </Link>
          <div className="mt-4 mt-md-5 d-flex gap-md-4 gap-lg-5 justify-content-evenly justify-content-md-start">
            <div className="text-center">
              <h5 className="fw-bold">
                500K+ <br />
                <span className="fs-14 text-muted fw-normal">Job Seekers</span>
              </h5>
            </div>
            <div className="text-center">
              <h5 className="fw-bold">
                2.5K+ <br />
                <span className="fs-14 text-muted fw-normal">Companies</span>
              </h5>
            </div>
            <div className="text-center">
              <h5 className="fw-bold">
                25K+ <br />
                <span className="fs-14 text-muted fw-normal">Got Hired</span>
              </h5>
            </div>
          </div>
        </div>
        <div className=" hero-img-div d-flex justify-content-center">
          <img src="/images/image1.png" alt="BackgroundImage" />
        </div>
      </div>
      {/* <Stats2 /> */}
    </header>
  );
};

export default Hero;

// <div className="hero-gradient heroDiv py-5">
//   <div className="container py-4">
//     <div className="row align-items-center">
//       <div className="col-12 col-md-5 ">
//         <h1 className="fw-bold text-light">Find Your Dream Tech Job</h1>
//         <p className="text-light heroP my-4">
//           Discover thousands of job opportunities with all the information
//           you need.
//         </p>
//         <Link to="/jobs" className="text-decoration-none">
//           <button className="btn btn-light d-flex align-items-center py-2 p-md-3 text-blue fw-medium">
//             Find Jobs Now &nbsp;
//             <ArrowRight size={18} />
//           </button>
//         </Link>
//       </div>
//       <div className="col-12 col-md-7 text-center text-md-end mt-5 mt-md-0">
//         <div className="d-inline-block rounded-4 hero-img-div">
//           <div className="border d-inline-block rounded-4">
//             <img
//               src="images/homehero.jpg"
//               className="rounded-4 opacity-75 w-100"
//               alt="Image"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//     <Stats2 />
//   </div>
// </div>
