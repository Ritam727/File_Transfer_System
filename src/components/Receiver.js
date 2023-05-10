import React from "react";
import "../styles/sendReceive.scss";
import { useNavigate } from "react-router-dom";

const Receiver = () => {
  let navigate = useNavigate();
  const receiveFile = () => {
    let path = `/receiver`;
    navigate(path);
  };

  return (
    <div className="WorkContainer">
      <div className="doImage">
        <img src={require("../images/receive.png")} alt="" />
      </div>
      <div className="Button">
        <button onClick={receiveFile}>Receive File</button>
      </div>
    </div>
  );
};

export default Receiver;
