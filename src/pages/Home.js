import React from "react";
import "../home.scss";
import { useNavigate } from "react-router-dom";

const Home = () => {
  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/createroom`;
    navigate(path);
  };

  return (
    <>
      <div className="mainPage">
        <div className="container">
          <div className="mainData">
            <div className="Logo">
              <img src={require("../images/logo.png")} alt="" />
            </div>

            <div className="content">
              <h1 className="tagLine">
                Our Innovative <br />  File Transfer System <br />
                Streamlines your Workflow
              </h1>
              <h3>
                Experience lightning-fast,secure and hassle free file
                transfers with our cutting-edge platform
              </h3>
            </div>

            <span>
              <button onClick={routeChange}>Get Started</button>
            </span>
          </div>
          <div className="bgImage">
            <img src={require("../images/main-bg.png")} alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

