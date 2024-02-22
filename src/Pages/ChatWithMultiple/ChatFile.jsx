import { useState, useEffect } from "react";
// import "../App.css";
import logo from "../../assets/2.svg";
import io from "socket.io-client";
import Typewriter from "typewriter-effect";

import axios from "axios";
import { useMediaQuery } from "react-responsive";
import { baseurl } from "../../utils/BaseUrl";

import { ToastContainer, toast } from "react-toastify";
import "../Demofile.css";
// import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import WaveCircle from "../OcrPdf/Loader";
import { useFile } from "../../FIleContext";
function OcrFile({ pdfDoc, userId, path, pdfId, pdfPath, setSrcSet }) {
  const [clickedPageNumber, setClickedPageNumber] = useState(null);
  const [messagesWithPageNumbers, setMessagesWithPageNumbers] = useState([]);
  const togglePageVisibility = (pdfId) => {
    setVisiblePages((prevVisiblePages) => {
      if (prevVisiblePages.includes(pdfId)) {
        return prevVisiblePages.filter((page) => page !== pdfId);
      } else {
        return [...prevVisiblePages, pdfId];
      }
    });
  };

  const [showOptions, setShowOptions] = useState(true); // State to control the visibility of options
  const { id } = useParams();
  const { srcSet } = useFile();
  const [isLocateSectionSelected, setIsLocateSectionSelected] = useState(false);
  const [isLanguageSelected, setLanguageSelected] = useState(false);
  const [inputPlaceholder, setInputPlaceholder] = useState("Type Message here");
  const handleOptionClick = async (option) => {
    // Translate a paragraph
    setShowLogoAndText(false);
    if (option === "Locate a specific section") {
      setIsLocateSectionSelected(true);
      setInputPlaceholder("Enter desired section you want to search"); // Set the state to true when this option is selected
    } else if (option === "Translate a paragraph") {
      setInputPlaceholder("Enter desired Translate language");
      setLanguageSelected(true);
    } else {
      await handleUserMessage(option); // For other options, proceed as before
      setShowOptions(false);
    }
  };
  const containerStyle = {
    // display: "flex",
    // justifyContent: "space-between",
    // alignItems: "center",
    padding: "10px",
    margin: "auto", // This will center the container
    // border: "1px solid #ccc", // Example border to separate the container from the rest of the page
    borderRadius: "8px", // Example border radius
  };

  const boxStyle = {
    backgroundColor: "#fff", // Background color for the div
    border: "1px solid #D8D9E5",
    borderRadius: "5px",
    padding: "10px",
    borderRadius: "12px",
    border: "1px",
    gap: "16px",

    margin: "0 10px", // Spacing between the divs
    flexBasis: "45%", // Adjust width as needed to fit content
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: "18px", // Adjust font size as needed
    fontWeight: "600", // Adjust font weight as needed
    marginBottom: "10px",
  };

  const contentStyle = {
    fontSize: "16px", // Adjust font size as needed
    fontWeight: "400", // Adjust font weight as needed
    color: "#555",
    textAlign: "start",
  };

  const [showLogoAndText, setShowLogoAndText] = useState(true);

  let confirm;
  let [chk, setChk] = useState("");
  const [lastAnimatedMessageIndex, setLastAnimatedMessageIndex] = useState(-1);
  const [chatMessages, setChatMessages] = useState([]);
  const [sourceDocument, setSourceDocument] = useState(undefined);
  const [latestPageNumber, setLatestPageNumber] = useState(null);
  const [visiblePages, setVisiblePages] = useState([]);
  // Function to handle user messages
  const handleUserMessage = async (userMessage) => {
    setShowOptions(false);
    setShowLogoAndText(false);
    const formData = new FormData();
    formData.append("pdfFile", pdfDoc);
    formData.append("userQuestion", userMessage);
    formData.append("userId", userId);
    formData.append("pdfUrl", path);
    pdfId ? formData.append("pdfId", pdfId) : "";

    if (isLocateSectionSelected) {
      userMessage = "Locate a specific section: " + userMessage;
      setIsLocateSectionSelected(false); // Reset the state
      setInputPlaceholder("Type Message here");
    }
    if (isLanguageSelected) {
      userMessage = "Translate a paragraph: " + userMessage;
      setLanguageSelected(false); // Reset the state
      setInputPlaceholder("Type Message here");
    }
    setIsLoading(true);

    try {
      // Send the user's question to the API
      const response = userId
        ? await axios.post(`${baseurl}/api/pdf/qnawithchats`, {
            question: userMessage,
            history: [],
            userId,
            pdfId: id,
          })
        : await axios.post(`${baseurl}/api/pdf/resume`, { pdfUrl: pdfPath });

      console.log(response.data);
      confirm = response.data.text;

      // Create a new user message object
      const newUserMessage = {
        message: userMessage,
        sender: "user",
        direction: "outgoing",
        pageNumber: latestPageNumber, // Use the latest page number
      };

      const updatedChatMessages = [...chatMessages, newUserMessage];

      if (confirm) {
        updatedChatMessages.push({
          message: confirm,
          sender: "backend",
          pageNumber: latestPageNumber, // Use the latest page number
        });
      }

      setChatMessages(updatedChatMessages);

      // Update the latest page number
      setLatestPageNumber(
        userMessage.toLowerCase().includes("out of my pdf")
          ? null // Set to null or the appropriate value for out-of-PDF questions
          : chk !== undefined ? chk[0]?.pageNumber : undefined
      );
      // Set the answer for the next user message
      if (userMessage.toLowerCase().includes("out of my pdf")) {
        // Handle out-of-PDF question separately, don't associate with a page number
        // ...
    
        // Clear the latestPageNumber or set it to an appropriate value
        setLatestPageNumber(null);
      } else {
        // Update the latest page number for other questions related to the PDF
        setLatestPageNumber(chk !== undefined ? chk[0]?.pageNumber : undefined);
      }
      // Clear the input field
      // setUserQuestion('');
    } catch (error) {
      console.log(error.message);
      const errorMessage = error.response
        ? error.response.data.error
        : "An unexpected error occurred";
      toast.error(errorMessage, {
        // Use errorMessage here
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 992 });
    return isDesktop ? children : null;
  };

  const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    return isMobile ? children : null;
  };
  // const [message, setMessage] = useState("");
  let message;
  const [messages, setMessages] = useState([]);
  const extractPageNumberAndLink = (loc) => {
    let pageNumber, sourceLink, pdfId;
    if (loc.metadata && loc.metadata.pdfId) {
      pdfId = loc.metadata.pdfId;
    }
    // Extract page number from metadata keys
    if (loc.metadata) {
      for (const key in loc.metadata) {
        if (
          key.toLowerCase().includes("page") ||
          key.toLowerCase().includes("number")
        ) {
          pageNumber = loc.metadata[key];
        }
        if (key.toLowerCase().includes("source")) {
          sourceLink = loc.metadata[key];
        }
        if (key.toLowerCase().includes("pdfId")) {
          pdfId = loc.metadata[key];
        }
      }
    }

    // Extract page number directly from loc
    if (loc.metadata && loc.metadata.pageNumber) {
      pageNumber = loc.metadata.pageNumber;
    }

    // Extract source link directly from loc
    if (loc.metadata && loc.metadata.sourceLink) {
      sourceLink = loc.metadata.sourceLink;
      pdfId = loc.metadata.pdfId;
    }
    if (loc.metadata && loc.metadata.pdfId) {
      pdfId = loc.metadata.pdfId;
    }

    // Extract page number using an alternative method
    if (loc.metadata && loc.metadata.loc && loc.metadata.loc.pageNumber) {
      pageNumber = loc.metadata.loc.pageNumber;
    }

    return { pageNumber, sourceLink, pdfId };
  };

  const handleMessageChange = async (e) => {
    message = e.target.value;
  };
  const [changeUrl, setChangeUrl] = useState("");
  const handleSendMessage = async () => {
    if (message.trim()) {
      const formData = new FormData();
      formData.append("pdfFile", pdfDoc);
      formData.append("userQuestion", message);
      formData.append("userId", userId);
      formData.append("pdfUrl", path);
      pdfId ? formData.append("pdfId", pdfId) : "";

      if (isLocateSectionSelected) {
        message = "Locate a specific section: " + message;
        setIsLocateSectionSelected(false);
        setInputPlaceholder("Type Message here");
      }
      if (isLanguageSelected) {
        message = "Translate a paragraph: " + message;
        setLanguageSelected(false);
        setInputPlaceholder("Type Message here");
      }

      setIsLoading(true);

      try {
        setShowOptions(false);
        const response = userId
          ? await axios.post(`${baseurl}/api/pdf/qnawithchats`, {
            question: message,
            history: [],
            userId,
            pdfId: id,
          })
          : await axios.post(`${baseurl}/api/pdf/resume`, { pdfUrl: pdfPath });
        setSourceDocument(response.data.sourceDocuments);
        confirm = response.data.text;

        setChk(
          response.data.sourceDocuments.map((loc) => {
            const { pageNumber, sourceLink, pdfId } = extractPageNumberAndLink(loc);

            return { pageNumber, sourceLink, pdfId };
          })
        );

        const newUserMessage = {
          message: message,
          sender: "user",
          direction: "outgoing",
        };

        const updatedChatMessages = [...chatMessages, newUserMessage];
        if (confirm) {
          updatedChatMessages.push({
            message: confirm,
            sender: "backend",
          });
        }

        setChatMessages(updatedChatMessages);

        message = ""; // Clear the input field
      } catch (error) {
        console.error("Error:", error); // Log the error for debugging
        const errorMessage = error.response
          ? error.response.data.error
          : "An unexpected error occurred";
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <Desktop>
        <div
          className=""
          style={{ background: "rgb(244, 244, 247)", padding: "10px" }}
        ></div>
        <div className="chat-container">
          {showLogoAndText && (
            <div style={{ position: "relative", top: "auto", right: "6%" }}>
              <img
                className="d-flex justify-content-center align-items-center mx-auto  "
                alt="Logo"
                style={{ width: "150px" }}
                src={logo}
              />
            </div>
          )}
          {/* {showOptions && (
            <div
              style={{
                position: "absolute",
                left: "57%",
                bottom: "28%",
                margin: "auto",
                borderColor: "rgba(0,0,0,.1)",
              }}
            >
              <div style={containerStyle}>
                <button
                  className="mx-3 flex items-center justify-center"
                  style={boxStyle}
                  onClick={() =>
                    handleOptionClick("Find a summary of the document")
                  }
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src="/btnicon.svg" style={{ marginRight: "10px" }} />
                    <div className="flex flex-col overflow-hidden text-start mx-4">
                      <div style={titleStyle}>Find Summary</div>
                      <div style={contentStyle}>
                        Get a quick summary of the PDF content
                      </div>
                    </div>
                  </div>
                </button>
                <br />
                <button
                  className="mx-3 flex items-center justify-center"
                  style={boxStyle}
                  onClick={() =>
                    handleOptionClick(
                      "Explain this document, as if I am in 7th Grade"
                    )
                  }
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src="/btnicon.svg" style={{ marginRight: "10px" }} />
                    <div className="flex flex-col overflow-hidden text-start mx-4">
                      <div style={titleStyle}>Explain</div>
                      <div style={contentStyle}>
                        Explain this document, as if I am in 7th Grade
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )} */}
          <div className="messages-container">
            {chatMessages.map((msg, index) => {
              const messageKey = `message-${index}-${msg.sender}`;

              return (
                <div key={messageKey}>
                  {msg.sender === "user" ? (
                    <div className="message user-message">
                      <p>{msg.message}</p>
                    </div>
                  ) : (
                    <div className="message bot-reply">
                      {index > lastAnimatedMessageIndex ? (
                        <Typewriter
                          options={{
                            delay: 0,
                            deleteSpeed: 0,
                            typeSpeed: 1,
                            cursor: "",
                          }}
                          onInit={(typewriter) => {
                            typewriter
                              .typeString(msg.message)
                              .callFunction(() => {
                                setLastAnimatedMessageIndex(index);
                              })
                              .start();
                          }}
                        />
                      ) : (
                        msg.message
                      )}
                    </div>
                  )}

                  {msg.sender === "backend" && sourceDocument !== undefined && (
                    <div>
                      {sourceDocument.slice(0, 2).map((sourceDoc, docIndex) => {
                        const { pageNumber, sourceLink, pdfId } = extractPageNumberAndLink(sourceDoc);
                        const isPageVisible = visiblePages.includes(pdfId);
                        const isClicked = clickedPageNumber === pdfId;

                        return (
                          <div key={`sourceDoc-${pdfId}-${docIndex}`}>
                            <button
                              onClick={() => togglePageVisibility(pdfId)}
                              style={{
                                backgroundColor: isPageVisible ? "#fff" : "#000",
                                color: isPageVisible ? "#000" : "#fff",
                                border: "none",
                                padding: "5px 10px",
                                marginRight: "10px",
                                cursor: "pointer",
                              }}
                            >
                              P: {chk !== undefined ? chk[docIndex]?.pageNumber : docIndex + 1}
                            </button>

                            {isPageVisible && (
                              <div style={{ marginLeft: "10px" }}>
                                <p>Page Content: {sourceDoc.pageContent}</p>
                                {isClicked && (
                                  <>
                                    <p>Page Number: {chk !== undefined ? chk[docIndex]?.pageNumber : docIndex + 1}</p>
                                    <p>Source Link: {chk !== undefined ? chk[docIndex]?.sourceLink : sourceLink}</p>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

          </div>
          {isLoading && <WaveCircle />}
          <div className="input-container">
            <img className="mx-3 " src="/attach.svg" />
            <input
              type="text"
              className="input"
              placeholder={inputPlaceholder}
              value={message}
              onChange={handleMessageChange}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSendMessage} style={{ background: "white" }}>
              <img src="/send.svg" />
            </button>
          </div>
        </div>
      </Desktop >
      <Mobile>
        <div className="chat-container">
          {isLoading && <WaveCircle />}

          {/* {showOptions && (
            <div
              style={{
                position: "absolute",
                left: "0%",
                bottom: "14%",
                margin: "auto",
                borderColor: "rgba(0,0,0,.1)",
              }}
            >
              <div style={containerStyle}>
                <button
                  className="mx-3 flex items-center justify-center"
                  style={boxStyle}
                  onClick={() =>
                    handleOptionClick("Find a summary of the document")
                  }
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src="/btnicon.svg" style={{ marginRight: "10px" }} />
                    <div className="flex flex-col overflow-hidden text-start mx-4">
                      <div style={titleStyle}>Find Summary</div>
                      <div style={contentStyle}>
                        Get a quick summary of the PDF content
                      </div>
                    </div>
                  </div>
                </button>
                <br />
                <button
                  className="mx-3 flex items-center justify-center"
                  style={boxStyle}
                  onClick={() =>
                    handleOptionClick(
                      "Explain this document, as if I am in 7th Grade"
                    )
                  }
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src="/btnicon.svg" style={{ marginRight: "10px" }} />
                    <div className="flex flex-col overflow-hidden text-start mx-4">
                      <div style={titleStyle}>Explain</div>
                      <div style={contentStyle}>
                        Explain this document, as if I am in 7th Grade
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )} */}
          <div className="messages-container">
            {chatMessages.map((msg, index) => {
              const messageKey = `message-${index}-${msg.sender}`; // Unique key for each message
              return msg.sender === "user" ? (
                <div className="message user-message" key={messageKey}>
                  <p>{msg.message}</p>
                </div>
              ) : (
                <div className="message bot-reply" key={messageKey}>
                  <Typewriter
                    options={{
                      delay: 0, // No delay between each character
                      deleteSpeed: 0, // No delay when deleting characters
                      typeSpeed: 1, // Very fast typing speed
                      cursor: "", // Empty string to hide the cursor
                    }}
                    onInit={(typewriter) => {
                      typewriter
                        .typeString(msg.message)
                        .callFunction(() => {
                          console.log("String typed out!");
                        })
                        .start();
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="input-container">
            <img className="mx-3 " src="/attach.svg" />
            <input
              type="text"
              className="input"
              placeholder={inputPlaceholder}
              value={message}
              onChange={handleMessageChange}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSendMessage}>
              <img src="/send.svg" />
            </button>
          </div>
        </div>
      </Mobile>
    </>
  );
}

export default OcrFile;