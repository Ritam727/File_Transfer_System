import React from "react";
import "../styles/sendReceive.scss";
import { useNavigate } from "react-router-dom";


const Sender = () => {
  let navigate = useNavigate();
  const sendFile = () => {
    let path = `/sender`;
    navigate(path);
  };

  return (
    <div className="WorkContainer">
      <div className="doImage">
        <img src={require("../images/send.jpg")} alt="" />
      </div>

      <div className="Button">
        <button onClick={sendFile}>Send File</button>
      </div>
    </div>
  );
};

export default Sender;
