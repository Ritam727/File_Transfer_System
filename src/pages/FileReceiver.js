import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import download from "downloadjs";
import { createFileElement } from "./FileSender";
import "../styles/FileReceiver.scss";
import Popup from "../components/Popup";

function generateId() {
  return `${Math.trunc(Math.random() * 999)}-${Math.trunc(
    Math.random() * 999
  )}-${Math.trunc(Math.random() * 999)}`;
}

function addPopup() {
  document.getElementsByClassName("modal")[0].classList.add("open");
  document.getElementsByClassName("overlay")[0].classList.add("open");
}
function removePopup() {
  document.getElementsByClassName("modal")[0].classList.remove("open");
  document.getElementsByClassName("overlay")[0].classList.remove("open");
}

const FileReceiver = () => {
  const [senderId, setSenderId] = useState(null);
  const [senderName, setSenderName] = useState("");
  let sender = null;
  let receiverId = null;
  const [socket, setSocket] = useState(null);
  let transmittedData = 0;
  let bufferData = [];
  let metadata = {};
  let cnt = 0;
  function submitForm(event) {
    event.preventDefault();
    receiverId = generateId();
    setSenderId(event.target[0].value);
    sender = event.target[0].value;
    socket.emit("receiver-join", { uid: receiverId, sender_uid: sender });
  }

  useEffect(() => {
    if (socket === null) {
      setSocket(io());
    }
    if (socket) {
      socket.on("fs-meta", function (metaData) {
        transmittedData = 0;
        metadata = metaData;
        bufferData = [];
        let fileElem = createFileElement(metadata.filename, cnt);
        document.getElementById("files").appendChild(fileElem);
        socket.emit("fs-start", { uid: sender });
        setSenderName(metadata.userName);
      });
      socket.on("fs-share", function (buffer) {
        if (buffer == null) return;
        bufferData.push(buffer);
        transmittedData += buffer.byteLength;
        if (transmittedData === metadata.total_buffer_size) {
          console.log("Downloading ", metadata.filename);
          document.getElementById(cnt).innerHTML =
            Math.trunc((transmittedData * 100) / metadata.total_buffer_size) +
            "%";
          cnt += 1;
          download(new Blob(bufferData), metadata.filename);
        } else {
          document.getElementById(cnt).innerHTML =
            Math.trunc((transmittedData * 100) / metadata.total_buffer_size) +
            "%";
          socket.emit("fs-start", { uid: sender });
        }
      });
    }
  }, [socket]);

  // console.log(senderName);
  return (
    <>
      <div className="overlay"></div>

      <div className="modal">
        <Popup senderId={senderId}></Popup>
      </div>

      <div className="ReceiverBox">
        <div className="ReceiverContainer">
          <div className="ReceiverLeft">
            <div className="ID">
              <img
                className="bgImage"
                src={require("../images/fileReceiver.png")}
                alt=""
              />
              {senderId ? (
                <>
                  <h2>Room ID :</h2>
                  <h1>{senderId}</h1>
                </>
              ) : (
                <>
                  <form
                    onSubmit={function (e) {
                      submitForm(e);
                      addPopup();
                    }}
                  >
                    <input
                      type="text"
                      name="join-id"
                      id="join-id"
                      placeholder="696-969-696"
                    ></input>
                    <button type="submit">Join Room</button>
                  </form>
                </>
              )}
            </div>
          </div>

          <div className="ReceiverRight">
            <h1>Shared Files</h1>
            <div className="RightContent" id="files"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export { FileReceiver, removePopup };
