import React from "react";

const Home = () => {
  return (
    <div className="mainPage">
      <div className="container">
        <div className="mainData">
          <img src={require("../images/logo.png")} alt="" />
          <h1>Our Innotvative File Transfer System</h1>
          <h1>Streamlines your Workflow</h1>
          <h2>
            Experience lightning-fast,secure and hassle free file transfers with
            out cutting-edge platform
          </h2>
          <button>Get Started</button>
        </div>
        <img src={require("../images/main-bg.png")} alt="" />
      </div>
    </div>
  );
};

export default Home;
