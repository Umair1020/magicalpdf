import React, { useEffect } from "react";
import PDFPrinter from "./PDFPrinter";
import { Link } from "react-router-dom";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
const ControlPanel = (props) => {
  const {
    file,
    pageNumber,
    numPages,
    setPageNumber,
    scale,
    setScale,
    toggleFullScreen,
    rotateClockwise,
    rotateCounterclockwise,
    toggleTextLayer,
    showPageNumberOverlay,
    togglePageNumberOverlay,
  } = props;
  useEffect(() => {
    const defaultZoom = window.innerWidth < 768 ? 0.5 : 1.0;
    setScale(defaultZoom);
  }, [setScale]);

  const isFirstPage = pageNumber === 1;
  const isLastPage = pageNumber === numPages;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const onOptionClick = (option) => {
    closeMenu();
    if (option === "fullscreen") toggleFullScreen();
    else if (option === "rotate-clockwise") rotateClockwise();
    else if (option === "rotate-counterclockwise") rotateCounterclockwise();
    else if (option === "toggle-text-layer") toggleTextLayer();
  };
  const firstPageClass = isFirstPage ? "disabled" : "clickable";
  const lastPageClass = isLastPage ? "disabled" : "clickable";

  const goToFirstPage = () => {
    if (!isFirstPage) setPageNumber(1);
  };
  const goToPreviousPage = () => {
    if (!isFirstPage) setPageNumber(pageNumber - 1);
  };
  const goToNextPage = () => {
    if (!isLastPage) setPageNumber(pageNumber + 1);
  };
  const goToLastPage = () => {
    if (!isLastPage) setPageNumber(numPages);
  };

  const onPageChange = (e) => {
    const { value } = e.target;
    setPageNumber(Number(value));
  };

  const isMinZoom = scale < 0.6;
  const isMaxZoom = scale >= 2.0;

  const zoomOutClass = isMinZoom ? "disabled" : "clickable";
  const zoomInClass = isMaxZoom ? "disabled" : "clickable";

  const zoomOut = () => {
    if (!isMinZoom) setScale(scale - 0.1);
  };

  const zoomIn = () => {
    if (!isMaxZoom) setScale(scale + 0.1);
  };

  return (
    <div className="control-panel m-3 p-3 d-flex justify-content-between align-items-center">

      {/* <div className="d-flex justify-content-between align-items-baseline">
        <i
          className={`fas fa-fast-backward mx-3 ${firstPageClass}`}
          onClick={goToFirstPage}
        />
        <i
          className={`fas fa-backward mx-3 ${firstPageClass}`}
          onClick={goToPreviousPage}
        />
        <span>
          Page{" "}
          <input
            name="pageNumber"
            type="number"
            min={1}
            max={numPages || 1}
            className="p-0 pl-1 mx-2"
            value={pageNumber}
            onChange={onPageChange}
          />{" "}
          of {numPages}
        </span>
        <i
          className={`fas fa-forward mx-3 ${lastPageClass}`}
          onClick={goToNextPage}
        />
        <i
          className={`fas fa-fast-forward mx-3 ${lastPageClass}`}
          onClick={goToLastPage}
        />
      </div> */}
      <div className="d-flex align-items-baseline">
        <i
          className={`fas fa-backward mx-3 ${firstPageClass}`}
          onClick={goToPreviousPage}
        />
        <span>
          Page
          <input
            name="pageNumber"
            type="number"
            min={1}
            max={numPages || 1}
            className=" "
            value={pageNumber}
            onChange={onPageChange}
          />
          of {numPages}
        </span>
        <i
          className={`fas fa-forward mx-3 ${lastPageClass}`}
          onClick={goToNextPage}
        />

      </div>
      <div className="d-flex justify-content-between align-items-baseline">
        <i
          className={`fas fa-search-minus mx-3 ${zoomOutClass}`}
          onClick={zoomOut}
        />
        <span>{(scale * 100).toFixed()}%</span>
        <i
          className={`fas fa-search-plus mx-3 ${zoomInClass}`}
          onClick={zoomIn}
        />
      </div>


      <div className="d-flex align-items-center position-relative">
        <button
          className="btn btn-secondary"
          type="button"
          id="dropdownMenuButton"
          onClick={toggleMenu}
        >
          <BsThreeDotsVertical />
        </button>
        {isMenuOpen && (
          <div className=" position-absolute" style={{
            zIndex: 1, marginTop: "210px",
            /* margin-bottom: 100px; */
            marginLeft: "-73px" , background: "#fff" , borderRadius: "10px"
          }}>
            <button className="dropdown-item" onClick={() => onOptionClick("fullscreen")}>
              Toggle Full Screen
            </button>
            <button className="dropdown-item" onClick={() => onOptionClick("rotate-clockwise")}>
              Rotate Clockwise
            </button>
            <button className="dropdown-item" onClick={() => onOptionClick("rotate-counterclockwise")}>
              Rotate Counterclockwise
            </button>
            <button className="dropdown-item" onClick={() => onOptionClick("toggle-text-layer")}>
              Toggle Text Layer
            </button>
            {/* Add more options as needed */}
          </div>
        )}
      </div>
      <div className="mx-3">
        <Link to="/assets/docs/file-sample.pdf" download={true} title="download">
          <i className="fas fa-file-download clickable" />
        </Link>
      </div>
      <div className="mx-3">
        <PDFPrinter file={file} />
      </div>
    </div>
  );
};

export default ControlPanel;
