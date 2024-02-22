import "./tools.css";
import Header from "../../components/Header/Header";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";

const Tools = () => {
  const ToolCard = ({ href, imgSrc, altText, title, description }) => {
    return (
      <Link className="col-lg-3 relative inline-flex " to={href}>
        <div
          className="flex  flex-row shadow bg-white rounded-md text-black p-3 m-3 space-x-5 w-full hover:bg-gray-50"
          bis_skin_checked="1"
        >
          <img
            src={imgSrc}
            alt={altText}
            className="h-12 w-auto flex-none bg-white object-contain border-none self-start mx-3"
          />
          <div className="flex flex-col">
            <span className="font-semibold" style={{ fontSize: "15px" }}>
              {title}
            </span>
            <span className="text-gray-700 " style={{ fontSize: "10px" }}>
              {description}
            </span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div>
      <main>
        <Header />
        <div
          className=" container row flex flex-wrap justify-center !mt-16 mx-auto"
          bis_skin_checked="1"
        >
          <h1 className="text-center fw-bold" style={{ fontFamily: "Inter" }}>
            Free PDF Tools
          </h1>
          <p className="text-center text-secondary">
            All PDF tools are 100% FREE and run in your browser for complete{" "}
          </p>
          <ToolCard
            href="/resumescanner"
            imgSrc="/tool1.png"
            altText="Resume Checker"
            title="Resume Roaster"
            description="From legal agreements to financial reports, brings yo."
          />
          <ToolCard
            href="/invoicescanner"
            imgSrc="/tool2.png"
            altText="invoicescanner"
            title="Invoice Scanner"
            description="From legal agreements to financial reports, brings yo."
          />
        </div>
        <br /> <br />
        <Footer />
      </main>
    </div>
  );
};

export default Tools;
