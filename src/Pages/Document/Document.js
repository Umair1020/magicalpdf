import React, { useState, useRef } from "react";
import Header from "../../components/Header/Header";
import "./Document.css";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { baseurl } from "../../utils/BaseUrl";
import { useFile } from "../../FIleContext";
import ChatWithAllModel from "../Model/ChatWithAllModel";
import Model from "../Model/Model";
import Footer from "../../components/Footer/Footer";
import SubHead from "../../components/Header/SubHead";
const Document = () => {
  // Assuming you're using something like React, this could be in your component
  const queryParams = new URLSearchParams(window.location.search);
  const sessionId = queryParams.get("session_id");

  useEffect(() => {
    const verifyPaymentSession = async () => {
      if (sessionId) {
        // console.log("sessionId:", sessionId);

        try {
          const response = await fetch(`${baseurl}/api/payment/confirm`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ session_id: sessionId }),
          });
          const session = await response.json();
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    verifyPaymentSession();
  }, [sessionId]); // dependency array includes sessionId
  const { file } = useFile();
  // console.log(file);
  const navigate = useNavigate();
  const handleBoxClick = () => {
    // Navigate to the "/compare" route when the box is clicked
    navigate("/resumescanner");
  };

  const [documents, setDocuments] = useState([]);
  // console.log(documents);
  const userCookie = Cookies.get("user");
  const decodedToken = jwtDecode(userCookie);
  const user = userCookie ? decodedToken : null;
  const userId = user.userId == undefined ? user._id : user.userId;
  const [searchQuery, setSearchQuery] = useState("");
  const pdfSec = async () => {
    navigate("/ask");
  };
  const fileInputRef = useRef(null);
  useEffect(() => {
    const getAllPdf = async () => {
      const res = await axios.post(`${baseurl}/api/pdf/getPdf`, { userId });
      console.log(res.data);
      setDocuments(res.data);
    };
    getAllPdf();
  }, []);
  localStorage.setItem("document", JSON.stringify(documents));
  const handleUpload = (event) => {
    const uploadedFile = event.target.files[0];

    if (uploadedFile) {
      setDocuments([...documents, uploadedFile]);
      fileInputRef.current.value = "";
    }
  };

  const filteredDocuments = documents.filter((document, index) => {
    const nameArray = document.name || []; // If 'name' is an array, use it
    const namesArray = document.names || []; // If 'names' is an array, use it
    const allNames = [...nameArray, ...namesArray]; // Combine both 'name' and 'names'

    const concatenatedNames = allNames.join(" ").toLowerCase();
    const isMatch = concatenatedNames.includes(searchQuery.toLowerCase());

    return isMatch;
  });

  const deleteDocument = async (pdfId, index, e) => {
    e.preventDefault();
    try {
      // Send the delete request to the server
      await axios.post(`${baseurl}/api/pdf/delPdf`, { pdfId });

      // Update the state to remove the deleted document
      const updatedDocuments = [...documents];
      updatedDocuments.splice(index, 1);
      setDocuments(updatedDocuments);
    } catch (error) {
      // Handle errors, e.g., show an error message to the user
      console.error("Error deleting document:", error);
    }
  };

  const now = new Date(); // Current time
  function formatTimeDifference(timeDifference) {
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    }
  }
  const getCleanFileName = (filePath) => {
    if (Array.isArray(filePath)) {
      // If filePath is an array, process each path
      return filePath.map((path) => {
        if (typeof path === "string") {
          const pathArray = path.split(/[\/\\]/); // Split by both forward slashes and backslashes
          const fileName = pathArray.pop(); // Get the last element (file name)
          const cleanedFileName = fileName.replace(/\.[^.]+$/, ""); // Remove the extension

          return cleanedFileName + ".pdf"; // Add the ".pdf" extension
        } else {
          console.error("Invalid filePath type:", typeof path);
          return ""; // or return some default value
        }
      });
    } else if (typeof filePath === "string") {
      // If filePath is a string, process it
      const pathArray = filePath.split(/[\/\\]/); // Split by both forward slashes and backslashes
      const fileName = pathArray.pop(); // Get the last element (file name)
      const cleanedFileName = fileName.replace(/\.[^.]+$/, ""); // Remove the extension
      return cleanedFileName + ".pdf"; // Add the ".pdf" extension
    } else {
      // Handle the case where filePath is neither a string nor an array (e.g., log an error or return a default value)
      console.error("Invalid filePath type:", typeof filePath);
      return ""; // or return some default value
    }
  };

  function formatFileSize(bytes) {
    const fileSizeInBytes = parseInt(bytes); // Convert the string to an integer
    if (isNaN(fileSizeInBytes)) {
      return "Unknown size"; // Handle the case where size is not a valid number
    }

    if (fileSizeInBytes < 1024) {
      return fileSizeInBytes + " B";
    } else if (fileSizeInBytes < 1048576) {
      return (fileSizeInBytes / 1024).toFixed(2) + " KB";
    } else {
      return (fileSizeInBytes / 1048576).toFixed(2) + " MB";
    }
  }

  const [show, setShow] = useState(false);
  const [showChatAll, setshowChatAll] = useState(false);

  const handleBoxClick1 = () => {
    // Navigate to the "/compare" route when the box is clicked
    // navigate("/ask");
    setShow(true);
  };
  const hideModal = () => {
    setShow(false);
  };
  const handleBoxClick2 = () => {
    // Navigate to the "/compare" route when the box is clicked
    // navigate("/ask");
    setshowChatAll(true);
  };
  const hideModal2 = () => {
    setshowChatAll(false);
  };
  const customStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    appearance: "none",
    position: "relative",
    cursor: "pointer",
    textAlign: "center",
    lineHeight: "normal",
    whiteSpace: "nowrap",
    margin: "0px",
    padding: "10px 12px",
    // width: "100%",
    color: "rgb(255, 255, 255)",
    background: "#754ddf", // Commented out as per your original CSS
    fontFamily: "var(--sans)",
    fontWeight: 500,
    fontStyle: "normal",
    marginLeft: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "none",
  };
  const chatAll = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    appearance: "none",
    position: "relative",
    cursor: "pointer",
    textAlign: "center",
    lineHeight: "normal",
    whiteSpace: "nowrap",
    margin: "0px",
    padding: "10px 12px",
    // width: "100%",
    color: "rgb(255, 255, 255)",
    background: "black", // Commented out as per your original CSS
    fontFamily: "var(--sans)",
    fontWeight: 500,
    fontStyle: "normal",
    marginLeft: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "none",
  };
  return (
    <div>
      <SubHead />

      {show && (
        <div
          style={{
            position: "fixed",

            background: "rgba(0, 0, 0, 0.46)",
            backdropFilter: "blur(5px)",
            zIndex: 9999,
            inset: 0,
            top: "0%",
            left: "0%",
            margin: "auto",
            width: "100%",
          }}
        >
          <Model hide={hideModal} userId={userId} />
        </div>
      )}

      {showChatAll && (
        <div
          style={{
            position: "fixed",

            background: "rgba(0, 0, 0, 0.46)",
            backdropFilter: "blur(5px)",
            zIndex: 9999,
            inset: 0,
            top: "0%",
            left: "0%",
            margin: "auto",
            width: "100%",
          }}
        >
          <ChatWithAllModel hide={hideModal2} userId={userId} />
        </div>
      )}
      <div
        className="w-full bg-[#faf9f6]"
        style={{ minHeight: "calc(100vh - 61px)" }}
      >
        <div className="max-w-[1080px] mx-auto p-2">
          <div className="text-left p-2 my-4">
            <h2 className="text-3xl font-serif">Documents</h2>
          </div>
          <div className="flex justify-start mb-4 px-2">
            <div className="flex-inline justify-start items-center w-full">
              <div className="sc-1c859520-0 jHAXMR">
                <span className="sc-1c859520-2 QJjyJ">
                  <svg className="sc-a8a76c9-0 fxBdmI" viewBox="0 0 16 16">
                    <path d="M15.55 13.43l-2.67-2.68a6.94 6.94 0 001.11-3.76c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.39 0 2.68-.42 3.76-1.11l2.68 2.67a1.498 1.498 0 102.12-2.12zm-8.56-1.44c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"></path>
                  </svg>
                </span>
                <input
                  className="sc-1c859520-1 fgXWgc input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleBoxClick1} style={customStyles}>
                  Upload
                </button>
                <Link to={`/chatwithmultiple/${userId}`}>
                  <button style={chatAll}>
                    <span>✨ </span>
                    <span style={{ marginLeft: "7px" }}>Chat All</span>
                  </button>
                </Link>
                <Link to="/hr1">
                  <button style={chatAll}>
                    <span style={{ marginLeft: "7px" }}>Hr Services</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="sc-4131da42-0 kkArEI">
            <table className="sc-4131da42-1 khEYYi">
              <tbody className="sc-4131da42-2 hccZzD">
                {filteredDocuments.map((document, index) => {
                  const updateTime = new Date(document.time); // Document update time
                  const timeDifference = now - updateTime;
                  const formattedTimeDifference =
                    formatTimeDifference(timeDifference);

                  return (
                    <tr className="sc-4131da42-3 jSZOxE" key={index}>
                      <td className="sc-4131da42-5 jgaYkc row-icon">
                        <svg
                          className="sc-a8a76c9-0 fxBdmI"
                          viewBox="0 0 16 16"
                        >
                          <path d="M9 0H3c-.55 0-.5 .45-1 1v14c0 .55.45 1 1 1h10c.55 0 1-.45 1-1V5L9 0zm3 14H4V2h4v4h4v8z"></path>
                        </svg>
                      </td>
                      <td className="sc-4131da42-5 jgaYkc">
                        <Link
                          to={`/pdf/${document._id}`}
                          className="flex items-center space-x-2 text-left font-sans font-medium whitespace-nowrap text-black m-0 p-0 bg-none border-none cursor-pointer hover:underline"
                        >
                          
                        </Link>
                      </td>
                      <td className="sc-4131da42-5 jgaYkc">
                        {formatFileSize(document.size)}
                      </td>
                      <td className="sc-4131da42-5 jgaYkc">
                        {formattedTimeDifference}
                      </td>
                      <td className="sc-4131da42-5 jgaYkc">
                        <button className="text-right align-middle font-sans font-normal whitespace-nowrap text-black/60 m-0 p-0 bg-none border-none cursor-pointer">
                          <svg
                            className="sc-a8a76c9-0 fxBdmI row-button"
                            viewBox="0 0 16 16"
                          >
                            <path d="M3.25 10.26l2.47 2.47 6.69-6.69-2.46-2.48-6.7 6.7zm-8.50 9c0 .55-.45 1-1 1s-1-.45-1-1v-6c0-.55.45-1 1-1s1 .45 1 1v6zm3 0c0 .55-.45 1-1 1s-1-.45-1-1v6c0-.55.45-1 1-1s1 .45 1 1v6zm3 0c0 .55-.45 1-1 1s-1-.45-1-1v6c0-.55.45-1 1-1s1 .45 1 1v6zm2-12h-4c0-.55-.45-1-1-1h-2c-.55 0-1 .45-1 1h-4c-.55 0-1 .45-1 1v1h14v-1c0-.55-.45-1-1-1z"></path>
                          </svg>
                        </button>
                      </td>
                      <td className="sc-4131da42-5 jgaYkc">
                        <button
                          className="text-right align-middle font-sans font-normal whitespace-nowrap text-black/60 m-0 p-0 bg-none border-none cursor-pointer"
                          onClick={(e) =>
                            deleteDocument(document._id, index, e)
                          }
                        >
                          <svg
                            className="sc-a8a76c9-0 fxBdmI row-button"
                            viewBox="0 0 16 16"
                          >
                            <path d="M14.49 3.99h-13c-.28 0-.5.22-.5.50s.22.5.50.5h.5v10c0 .55.45 1 1 1h10c.55 0 1-.45 1-1v-10h.5c.28 0 .5-.22.5-.50s-.22-.5-.50-.5zm-8.50 9c0 .55-.45 1-1 1s-1-.45-1-1v-6c0-.55.45-1 1-1s1 .45 1 1v6zm3 0c0 .55-.45 1-1 1s-1-.45-1-1v6c0-.55.45-1 1-1s1 .45 1 1v6zm3 0c0 .55-.45 1-1 1s-1-.45-1-1v6c0-.55.45-1 1-1s1 .45 1 1v6zm2-12h-4c0-.55-.45-1-1-1h-2c-.55 0-1 .45-1 1h-4c-.55 0-1 .45-1 1v1h14v-1c0-.55-.45-1-1-1z"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Document;
