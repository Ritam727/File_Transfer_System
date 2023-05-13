import React from "react";
import "../styles/Popup.scss";
import { removePopup } from "../pages/FileReceiver";

const Popup = (props) => {
  return (
    <div className="popup-box">
      <div className="upper">
        {props.correct ?
          <div className="data">
            <h2>Connected Successfully</h2>
            <p>With Room ID</p>
          </div>
          :
          <div className="data">
            <h2>Could not connect</h2>
            <p>Wrong room Id or sender disconnected</p>
          </div>
        }
        <div className="close">
          <button onClick={removePopup}>x</button>
        </div>
      </div>
      <div className="lottie">
        {props.correct ?
          <video loop autoPlay muted>
            <source src={require("../images/success.mp4")} type="video/mp4" />
          </video>
          :
          <></>
        }
      </div>
      {props.correct ?
        <div className="lower">
          <h2>{props.senderId}</h2>
        </div>
        :
        <></>
      }
    </div>
  );
};

export default Popup;
