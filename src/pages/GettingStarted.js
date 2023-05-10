import React from "react";
import "../styles/GettingStarted.scss";
import Sender from "../components/Sender";
import Receiver from "../components/Receiver";

const GettingStarted = () => {
  

  return (
    <div className="createRoomPage">
      <div className="CreateRoomcontainer">
        <div className="heading">
          <div className="Logo">
            <img src={require("../images/logo.png")} alt="" />
          </div>

          <div className="tagLine">
            <h1>SHARING MADE SIMPLE</h1>
          </div>

          <div className="title">
            <h1>
              Our Innovative <span> File Transfer System</span>
            </h1>

            <h1>Streamlines your Workflow</h1>
          </div>
        </div>

        <div className="mainFeature">
          <Sender></Sender>
          <Receiver></Receiver>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
