// import React, { useState } from "react";

// const Accordion = ({ accordionItems }) => {
//   const [activeIndex, setActiveIndex] = useState(null);

//   const handleAccordionClick = (index) => {
//     setActiveIndex(activeIndex === index ? null : index);
//   };

//   return (
//     <div>
//       {accordionItems.map((accordionItem, index) => (
//         <div key={index}>
//           <button
//             className={`accordion ${activeIndex === index ? "active" : ""}`}
//             onClick={() => handleAccordionClick(index)}
//           >
//             {accordionItem.title}
//           </button>
//           <div
//             className="panel"
//             style={{
//               maxHeight: activeIndex === index ? "0px" : "0px",
//               overflow: "hidden",
//               transition: "max-height 0.2s ease-out",
//             }}
//           >
//             {accordionItem.content}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Accordion;
