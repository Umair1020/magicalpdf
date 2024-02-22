import { useState, useEffect } from "react";
// import "../App.css";
import logo from "../assets/2.svg";
import Typewriter from "typewriter-effect";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import { baseurl } from "../utils/BaseUrl";
import { ToastContainer, toast } from "react-toastify";
import "./Demofile.css";
import "react-toastify/dist/ReactToastify.css";
import WaveCircle from "./OcrPdf/Loader";
import { useFile } from "../FIleContext";
function DemoFile({ pdfDoc, userId, path, pdfId, pdfPath }) {
  const { file } = useFile();
  const { id } = useParams();
  console.log(pdfPath);
  const [showOptions, setShowOptions] = useState(true); // State to control the visibility of options
  const [lastAnimatedMessageIndex, setLastAnimatedMessageIndex] = useState(-1);
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

  const [isLoading, setIsLoading] = useState(false);
  let confirm;
  // State to store chat messages
  const [chatMessages, setChatMessages] = useState([]);

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
        ? await axios.post(`${baseurl}/api/pdf/qnawithchat`, {
          question: userMessage,
          history: [],
          userId,
          pdfId: id,
        })
        : await axios.post(
          `https://anywhere.synapssolutions.com/${baseurl}/api/pdf/resume`,
          {
            pdfUrl: pdfPath,
            userQuestion: userMessage,
          }
        );
      confirm = userId ? response.data.text : response.data.chat_history;
      console.log(userId ? response.data.text : response.data.chat_history);
      // Create a new user message object
      const newUserMessage = {
        message: userMessage,
        sender: "user",
        direction: "outgoing",
      };

      // Update chat messages state with the new user message
      const updatedChatMessages = [...chatMessages, newUserMessage];
      // Check if the answer is available
      if (confirm) {
        // For subsequent questions, add the answer to chat messages
        updatedChatMessages.push({
          message: confirm,
          sender: "backend",
        });
      }

      // Set the chat messages state with the updated messages
      setChatMessages(updatedChatMessages);

      // Set the answer for the next user message

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
    let pageNumber, sourceLink;

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
      }
    }

    // Extract page number directly from loc
    if (loc.metadata && loc.metadata.pageNumber) {
      pageNumber = loc.metadata.pageNumber;
    }

    // Extract source link directly from loc
    if (loc.metadata && loc.metadata.sourceLink) {
      sourceLink = loc.metadata.sourceLink;
    }

    // Extract page number using an alternative method
    if (loc.metadata && loc.metadata.loc && loc.metadata.loc.pageNumber) {
      pageNumber = loc.metadata.loc.pageNumber;
    }
    localStorage.setItem("url", sourceLink);
    return { pageNumber, sourceLink };
  };
  const handleMessageChange = async (e) => {
    message = e.target.value;
  };
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
          ? await axios.post(`${baseurl}/api/pdf/qnawithchat`, {
            question: message,
            history: [],
            userId,
            pdfId: id,
          })
          : await axios.post(
            `https://anywhere.synapssolutions.com/${baseurl}/api/pdf/resume`,
            {
              pdfUrl: pdfPath,
              userQuestion: message,
            }
          );

        confirm = userId ? response.data.text : response.data.chat_history;

        const newUserMessage = {
          message: message,
          sender: "user",
          direction: "outgoing",
        };

        // Update chat messages state with the new user message
        const updatedChatMessages = [...chatMessages, newUserMessage];

        if (confirm) {
          // For backend responses, add the answer to chat messages
          updatedChatMessages.push({
            message: confirm,
            sender: "backend",
          });
        }

        // Set the chat messages state with the updated messages
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

  return (
    <>
      <Desktop>
        <ToastContainer />
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
          {showOptions && (
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
          )}
          <div className="messages-container">
            {chatMessages.map((msg, index) => {
              const messageKey = `message-${index}-${msg.sender}`;

              return msg.sender === "user" ? (
                <div className="message user-message" key={messageKey}>
                  <p>{msg.message}</p>
                </div>
              ) : (
                <div className="message bot-reply" key={messageKey}>
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
                            // Update the state to the current index
                            setLastAnimatedMessageIndex(index);
                          })
                          .start();
                      }}
                    />
                  ) : (
                    msg.message
                  )}
                </div>
              );
            })}
          </div>
          {isLoading && <WaveCircle />}
          <div className="input-container">
            <img className="mx-3 " src="/sender.png" />
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
      </Desktop>
      <Mobile>
        <ToastContainer />
        <div className="chat-container">
          {isLoading && <WaveCircle />}

          {showOptions && (
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
                    handleOptionClick("Find detail  summary of this file")
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
          )}
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
            <img className="mx-3 " src="/sender.png" />
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

export default DemoFile;
