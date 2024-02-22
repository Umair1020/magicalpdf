import React, { useEffect, useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin, RenderToolbarSlot } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PdfHeader = ({ pdfFile, onPdfLoadSuccess }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const [numPages, setNumPages] = useState(null);

  const handleToolbarSlot = (toolbarSlot: RenderToolbarSlot) => {
    const {
      CurrentPageInput,
      GoToPage,
      NumberOfPages,
      Print,
      Rotate,
      Download,
      ZoomIn,
      ZoomOut,
    } = toolbarSlot;

    // Customize the toolbar by adding or modifying options
    return (
      <div>
        <div>{CurrentPageInput}</div>
        <div>{GoToPage}</div>
        <div>{NumberOfPages}</div>
        <div>{Print}</div>
        <div>{Rotate}</div>
        <div>{Download}</div>
        <div>{ZoomIn}</div>
        <div>{ZoomOut}</div>
        {/* Add your custom options here */}
        <div>
          <button onClick={() => console.log('Custom Option')}>
            Custom Option
          </button>
        </div>
      </div>
    );
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      <section
        id="pdf-section"
        className="pdf-container d-flex flex-column align-items-center w-100"
      >
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
          <div
            style={{
              height: '750px',
              width: '900px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
         <Viewer fileUrl={pdfFile} plugins={[defaultLayoutPluginInstance]} on={onDocumentLoadSuccess}>
        {handleToolbarSlot}
      </Viewer>
          </div>
        </Worker>
      </section>
    </div>
  );
};

export default PdfHeader;
