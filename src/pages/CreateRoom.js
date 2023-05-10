import React, { useState } from "react";

import DragDropFile from "../components/DragDropFile";
import "../styles/CreateRoom.scss";

import io from "socket.io-client";
const socket = io();
let receiverId;

function generateId() {
  return `${Math.trunc(Math.random() * 999)}-${Math.trunc(
    Math.random() * 999
  )}-${Math.trunc(Math.random() * 999)}`;
}

const CreateRoom = () => {
  const [joinId, setJoinId] = useState(null);
  let join = null;
  let cnt = 0;
  let transmittedData = 0;
  function click() {
    join = generateId();
    setJoinId(join);
    socket.emit("sender-join", { uid: join });
    socket.on("init", function (uid) {
      receiverId = uid;
    });
  }
  function handleFileUpload(event) {
    let file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      let buffer = new Uint8Array(fileReader.result);
      const fileElem = document.createElement("div");
      const fileName = document.createElement("p");
      const percent = document.createElement("p");
      fileName.innerHTML = file.name;
      percent.innerHTML = "0";
      percent.id = cnt;
      fileElem.appendChild(fileName);
      fileElem.appendChild(percent);

      document.getElementById("files").appendChild(fileElem);
      shareFile(
        {
          filename: file.name,
          total_buffer_size: buffer.length,
          buffer_size: 262144,
        },
        buffer
      );
    };
    fileReader.readAsArrayBuffer(file);
    cnt += 1;
    transmittedData = 0;
  }

  function shareFile(metadata, buffer) {
    socket.emit("file-meta", {
      uid: joinId,
      metadata: metadata,
    });
    socket.on("fs-share", function () {
      let chunk = buffer.slice(0, metadata.buffer_size);
      transmittedData += chunk.length;
      buffer = buffer.slice(metadata.buffer_size, buffer.length);
      if (chunk.length !== 0) {
        socket.emit("file-raw", {
          uid: joinId,
          buffer: chunk,
        });
        document.getElementById(cnt).innerHTML = Math.trunc(
          (transmittedData * 100) / metadata.total_buffer_size
        );
      }
    });
  }
  return (
    <div className="senderBox">
      <div className="SenderContainer">
        <div className="Left">
          <div className="ID">
            {joinId ? (
              <>
                <h2>Room ID :</h2>
                <h1>{joinId}</h1>
              </>
            ) : (
              <button onClick={click}>Create Room</button>
            )}
          </div>
          <DragDropFile onChange={handleFileUpload}></DragDropFile>
        </div>

        <div className="Right" id="files">
          <h1>hehe</h1>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
