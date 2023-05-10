import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import download from "downloadjs";
import { createFileElement } from "./CreateRoom";

function generateId() {
  return `${Math.trunc(Math.random() * 999)}-${Math.trunc(
    Math.random() * 999
  )}-${Math.trunc(Math.random() * 999)}`;
}

const Room = () => {
  const [senderId, setSenderId] = useState(null);
  let sender = null;
  let receiverId = null;
  const [socket, setSocket] = useState(null);
  const [fileList, setFileList] = useState([]);
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
      });
      socket.on("fs-share", function (buffer) {
        if (buffer == null) return;
        bufferData.push(buffer);
        transmittedData += buffer.byteLength;
        if (transmittedData === metadata.total_buffer_size) {
          console.log("Downloading ", metadata.filename);
          document.getElementById(cnt).innerHTML = Math.trunc(transmittedData*100/metadata.total_buffer_size);
          cnt += 1;
          download(new Blob(bufferData), metadata.filename);
        } else {
          document.getElementById(cnt).innerHTML = Math.trunc(transmittedData*100/metadata.total_buffer_size);
          socket.emit("fs-start", { uid: sender });
        }
      });
    }
  }, [socket, fileList]);
  return (
    <div>
      {!senderId ? (
        <form method="GET" onSubmit={submitForm}>
          <input type="text" name="join-id" id="join-id"></input>
          <button type="submit">Submit</button>
        </form>
      ) : (
        <div>
          <p>Room id : {senderId}</p>
          <p>Files Shared:</p>
          <div id="files"></div>
        </div>
      )}
    </div>
  );
};

export default Room;
