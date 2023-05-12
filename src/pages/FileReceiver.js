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
  let sender = null;
  let receiverId = null;
  const [socket, setSocket] = useState(null);
  let transmittedData = {};
  let bufferData = {};
  function submitForm(event) {
    event.preventDefault();
    receiverId = generateId();
    setSenderId(event.target[0].value);
    sender = event.target[0].value;
    socket.emit("receiver-join", { uid: receiverId, sender_uid: sender });
    socket.on("wrong-room-id", function (data) {
      console.log("Wrong Room")
      setSenderId(null);
    });
  }

  useEffect(() => {
    if (socket === null) {
      setSocket(io());
    }
    if (socket) {
      socket.on("fs-meta", function (metaData) {
        transmittedData[metaData.filename] = 0;
        bufferData[metaData.filename] = [];
        let fileElem = createFileElement(metaData.filename);
        document.getElementById("files").appendChild(fileElem);
        socket.emit("fs-start", { uid: sender });
      });
      socket.on("fs-share", function (data) {
        if (data == null) return;
        let buffer = data['buffer'];
        let metadata = data['metadata'];
        let file = metadata.filename;
        bufferData[file].push(buffer);
        transmittedData[file] += buffer.byteLength;
        if (transmittedData[file] === metadata.total_buffer_size) {
          console.log("Downloading ", metadata.filename);
          document.getElementById(file).innerHTML =
            Math.trunc((transmittedData[file] * 100) / metadata.total_buffer_size) +
            "%";
          download(new Blob(bufferData[file]), file);
          delete bufferData[file];
          delete transmittedData[file];
        } else {
          document.getElementById(file).innerHTML =
            Math.trunc((transmittedData[file] * 100) / metadata.total_buffer_size) +
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
        <Popup senderId={senderId} correct={senderId}></Popup>
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
