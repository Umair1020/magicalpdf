import React, { useEffect, useState, useCallback } from "react";
import Loader from "./Loader";
import { Document, Page, pdfjs } from "react-pdf";
import { useLocation } from "react-router-dom";
import ControlPanel from "./ControlPanel";
import "./pdf.css";
import { baseurl } from "../../utils/BaseUrl";
import axios from "axios";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { useFile } from "../../FIleContext";

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFReader = ({ path, SrcSet, file }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const fieUrl = `${baseurl}/uploads/${file}`;
  const [filename, setFilename] = useState("");
  const [localStorageUrl, setLocalStorageUrl] = useState(
    localStorage.getItem("url") || ""
  );
  const [fileName, setFileName] = useState("");
  const { setFile, setSrcSet } = useFile();

  const changPdf = `https://anywhere.synapssolutions.com/${baseurl}/uploads/${filename}`;
  const resolvePath = `https://anywhere.synapssolutions.com/${path ? path : fieUrl
    }`;
  const { userId, id } = useParams();
  const [list, setList] = useState([]);
  const pathname = useLocation();
  const newName = pathname.pathname;
  const [scale, setScale] = useState(1.0);
  const [numPages, setNumPages] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isTextLayerVisible, setIsTextLayerVisible] = useState(true);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  const [url, setUrl] = useState("");
  const [singleurl, setSingleUrl] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  useEffect(() => {
    const getSinglePdf = async () => {
      const res = await axios.get(`${baseurl}/api/pdf/getOnlyPdf/${id}`);
      const fix1 = res.data.name[0];
      setSingleUrl(`https://anywhere.synapssolutions.com/${baseurl}/${fix1}`);
      // setUrl(`https://anywhere.synapssolutions.com/${baseurl}/${fix1}`);
    };
    getSinglePdf();
  }, []);
  const getMultiplePdf = async () => {
    try {
      const { data } = await axios.post(`${baseurl}/api/pdf/getPdf`, {
        userId,
      });

      const fix = data.map((url) => url.name);
      console.log("here fix:", fix);

      if (fix && fix.length > 0) {
        console.log(fix);
        // Use Promise.all to wait for all promises to be resolved
        const setFilePromises = fix.map(async (path) => {
          const filePath = `${baseurl}/${fileName ? `uploads/${fileName}` : path
            }`;
          await setFile(filePath);
          return filePath;
        });

        // Set single URL and URL after all promises are resolved
        const resolvedFilePaths = await Promise.all(setFilePromises);
        // Set srcFile to the first resolved file path

        setUrl(`https://anywhere.synapssolutions.com/${resolvedFilePaths[0]}`);
      }

      setList(fix);
    } catch (error) {
      console.error("Error fetching multiple PDF:", error);
    }
  };

  useEffect(() => {
    getMultiplePdf();
  }, []);

  // function onDocumentLoadSuccess({ numPages }) {
  //   setNumPages(numPages);
  //   setIsLoading(false);
  // }

  function onDocumentLoadError(error) {
    console.error("Failed to load the document:", error.message);
    setIsLoading(false);
  }
  const handleSelectChange = (event) => {
    const selectedPath = event.target.value;
    const selectedUrl = `https://anywhere.synapssolutions.com/${baseurl}/${selectedPath}`;
    setUrl(selectedUrl);
    setSingleUrl(selectedUrl);
    setPageNumber(1); // Reset page number when changing the PDF
  };
  useEffect(() => {
    const defaultZoom = window.innerWidth < 768 ? 0.5 : 1.0;
    setScale(defaultZoom);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const rotateCounterclockwise = () => {
    // Implement counterclockwise rotation logic
  };

  const toggleTextLayer = () => {
    setIsTextLayerVisible(!isTextLayerVisible);
  };

  const rotateClockwise = () => {
    // Implement clockwise rotation logic
  };
  const srcFile = singleurl ? singleurl : url;
  const presentFile = srcFile ? srcFile : resolvePath;
  const final = presentFile ? presentFile : changPdf;
  const defaultZoom = window.innerWidth < 768;
  console.log("final:", final);

  const [showPageNumberOverlay, setShowPageNumberOverlay] = useState(true);

  const togglePageNumberOverlay = () => {
    setShowPageNumberOverlay(!showPageNumberOverlay);
  };

  useEffect(() => {
    // Load initial number of pages
    const loadInitialPages = async () => {
      const { numPages } = await pdfjs.getDocument(file).promise;
      setNumPages(numPages);
    };

    loadInitialPages();
  }, [file]);
  return (
    <div>
      <section
        id="pdf-section"
        className="pdf-container d-flex flex-column align-items-center w-100"
      >
        <Document
          file={final}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<Loader isLoading={true} />}
        >
          {/* <Page style={styles.body}>
             <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `${pageNumber} / ${totalPages}`
          )} fixed /></Page> */}
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={scale}
              renderMode="canvas"
              renderTextLayer={false} // Disable text layer rendering
              inputRef={(ref) => {
                if (ref) {
                  ref.style.height = `100vh`; // Set page height explicitly
                }
              }}
              width={
                newName === "/resumescanner" || newName === "/invoicescanner"
                  ? 500
                  : 700
              }
            />
          ))}
        </Document>
        {!defaultZoom ? (
          <div
            style={{
              position: "fixed",
              bottom: "72%",
              // borderRadius: "10px",
              backgroundColor: "white",
              width: "50%"
            }}
          >
            <ControlPanel
               file={file}
               pageNumber={pageNumber}
               numPages={numPages}
               setPageNumber={setPageNumber}
               scale={scale}
               setScale={setScale}
               toggleFullScreen={toggleFullScreen}
            />
          </div>
        ) : (
          <ControlPanel
            file={file}
            pageNumber={pageNumber}
            numPages={numPages}
            setPageNumber={setPageNumber}
            scale={scale}
            setScale={setScale}
            toggleFullScreen={toggleFullScreen}
          />
        )}
        {newName === `/chatwithmultiple/${userId}` ? (
          <div class="selectdiv">
            <label className="" style={{ width: "300px" }}>
              <select className="select" onChange={handleSelectChange}>
                {list.map((path, index) => (
                  <option className="option" key={index} value={path}>
                    {path}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : (
          ""
        )}

      </section>
    </div>
  );
};

export default PDFReader;
