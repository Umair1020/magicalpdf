import React from 'react'
import SubHead from '../Header/SubHead'
import "./hr.css"
import { FaPlus, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
const Hrservices2 = () => {
  return (
    <div>
      <div className='hr '>
        <SubHead />
        <br />   <br />
        <div className='container'>
          <h2 className='mx-5'>Find best candidates for your job role immediately</h2>
        </div>
        <br />     <br />
        <div className=' container'>
          <div className='row '>
            <div className='col-lg-5 mx-5'>
              <h3>Upload Cv</h3>
              <br />
              <button type="button" class="btn btn-outline-primary d-flex align-items-center p-2"> <FaPlus /> <p className='mx-3'>Add more CVs </p></button>
              <br /> <br />
              <div className='d-flex align-items-center justify-content-between'>
                <h4 className='d-flex align-items-center'>Asfandyar Malik CV </h4><div className='d-flex justify-content-end align-items-center' ><span className='mr-4'>76%</span><img className='d-flex ' src='/delete.png' /></div></div> <br />
              <hr style={{ width: "100%" }} /><br />
              <div className='d-flex align-items-center justify-content-between'>
                <h4 className='d-flex align-items-center'>Asfandyar Malik CV </h4><div className='d-flex justify-content-end align-items-center' ><span className='mr-4'>66%</span><img className='d-flex ' src='/delete.png' /></div></div> <br />   <hr style={{ width: "100%" }} /><br />
              <div className='d-flex align-items-center justify-content-between'>
                <h4 className='d-flex align-items-center'>Asfandyar Malik CV </h4><div className='d-flex justify-content-end align-items-center' ><span className='mr-4'>16%</span><img className='d-flex ' src='/delete.png' /></div></div> <br />
              <hr style={{ width: "100%" }} /><br />
              <div className='d-flex align-items-center justify-content-between'>
                <h4 className='d-flex align-items-center'>Asfandyar Malik CV </h4><div className='d-flex justify-content-end align-items-center' ><span className='mr-4'>56%</span><img className='d-flex ' src='/delete.png' /></div></div> <br />
              <hr style={{ width: "100%" }} /><br />
              <div className='d-flex align-items-center justify-content-between'>
                <h4 className='d-flex align-items-center'>Asfandyar Malik CV </h4><div className='d-flex justify-content-end align-items-center' ><span className='mr-4'>26%</span><img className='d-flex ' src='/delete.png' /></div></div> <br />
              <hr style={{ width: "100%" }} /><br />
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Hrservices2