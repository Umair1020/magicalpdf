import React from 'react'
import SubHead from '../Header/SubHead'
import "./hr.css"
import { FaPlus, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Hrservices1 = () => {
  return (
    <div className='hr '>
      <SubHead />
      <br />   <br /><br />
      <h2 className='text-center'>Find best candidates for your job role immediately</h2>
      <br />     <br />
      <div className=' container'>
        <div className='row '>
          <div className='col-lg-5 mx-5'>
            <h3>Upload Cv</h3>
            <br />
            <button type="button" class="btn btn-outline-primary d-flex align-items-center p-2"> <FaPlus /> <p className='mx-3'>Add more CVs </p></button>
            <br /> <br />
            <div className='d-flex align-items-center justify-content-between'>
              <h4 className='d-flex align-items-center'>Asfandyar Malik CV </h4><div className='d-flex justify-content-end' ><img className='d-flex ' src='/delete.png' /></div></div> <br />
            <hr style={{ width: "100%" }} /><br />
            <div className='d-flex align-items-center justify-content-between'>
              <h4 className='d-flex align-items-center'>Asfandyar Malik CV </h4><div className='d-flex justify-content-end' ><img className='d-flex ' src='/delete.png' /></div></div> <br />   <hr style={{ width: "100%" }} /><br />
            <div className='d-flex align-items-center justify-content-between'>
              <h4 className='d-flex align-items-center'>Asfandyar Malik CV </h4><div className='d-flex justify-content-end' ><img className='d-flex ' src='/delete.png' /></div></div> <br />
            <hr style={{ width: "100%" }} /><br />
            <div className='d-flex align-items-center justify-content-between'>
              <h4 className='d-flex align-items-center'>Asfandyar Malik CV </h4><div className='d-flex justify-content-end' ><img className='d-flex ' src='/delete.png' /></div></div> <br />
            <hr style={{ width: "100%" }} /><br />
            <div className='d-flex align-items-center justify-content-between'>
              <h4 className='d-flex align-items-center'>Asfandyar Malik CV </h4><div className='d-flex justify-content-end' ><img className='d-flex ' src='/delete.png' /></div></div> <br />
            <hr style={{ width: "100%" }} /><br />
          </div>
          <div className='col-lg-6'>
            <h2>Job Description</h2>
            <p>Summary <br />
              Our mission is to deliver outstanding digital experiences to our customers through robust functionality and advanced technology. We prioritize efficiency and lean development practices to align top-tier software development with optimal performance and scalability. As we continue to innovate, we seek a Senior Flutter Developer to champion these values through the creation of versatile applications for both mobile and web platforms. <br />
              Your Responsibilities <br />
              As a Senior Flutter Developer, you will be an integral member of our tech team, focusing on the development of cross-platform mobile and web applications within our product lines and content management ecosystem. Collaborating closely with product managers, designers, and technologists, you will drive the development process in an agile and lean environment, ensuring our solutions are both feature-rich and efficient. <br />
              Qualification and Skills : <br />
              <ul>
                <li> Proficient in Dart and Flutter for developing cross-platform applications.</li>
                <li>  Experience with implementing clean, maintainable code and architectures.</li>
                <li> Strong background in mobile development, with a keen eye for performance optimization.</li>
                <li> Familiarity with state management solutions (Provider, Riverpod, Bloc, etc.).</li>
                <li>   Experience with web technologies (HTML, CSS) and the ability to leverage Flutter for web development is a plus.</li>
                <li> Deep understanding of the mobile and browser ecosystem, including web view integration for Flutter.</li>
                <li>
                  Willingness to explore and integrate new technologies to enhance application performance and user experience.</li>
                <li>  Commitment to quality assurance and attention to detail in a fast-paced, agile environment.</li>
                <li> Excellent communication skills in English, both written and verbal.</li>
                <li>  Bonus: Experience with video infrastructure and delivery in mobile contexts.</li>
                <li>  Bonus: Understanding of advertisement technology and standards within mobile applications.</li>
                <li>Bonus: Expertise in real-time databases and developing real-time features within Flutter applications</li>

              </ul>

              <h5>Benefits </h5>
              <ul>
                <li >Join a dedicated, professional team united by a common goal of innovation and performance.</li>
                <li > Engage in a communicative, creative work culture offering significant autonomy and opportunity for impact.</li>
                <li > Work on cutting-edge Flutter applications that reach and delight millions of users worldwide.</li>
                <li >Be part of a dynamic company that leverages world-class engineering to lead in digital solution development.</li>
                <li >This position offers a unique opportunity to advance your career in Flutter development while contributing to the creation of high-performance, scalable digital solutions. Join us in our mission to develop state-of-the-art applications for the future.</li>
              </ul>
            </p>

          </div>
        </div>
      </div>
      <br /><br />
      <Link to="/hr2">
        <button className='text-light p-4 d-flex mx-auto' style={{
          background: "linear-gradient(90deg, #4A56EE 1.3%, #7A4CDD 94.35%)", borderRadius: "12px"
        }}>
          <span>✨ </span>
          <span style={{ marginLeft: "7px" }}>Find best Candidate</span>
        </button>
      </Link>
    </div>
  )
}

export default Hrservices1