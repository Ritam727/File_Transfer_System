import React, { useState } from 'react'
import io from "socket.io-client";

const socket = io();
let receiverId;

function generateId() {
  return `${Math.trunc(Math.random() * 999)}-${Math.trunc(Math.random() * 999)}-${Math.trunc(Math.random() * 999)}`;
}

const CreateRoom = () => {
  const [joinId, setJoinId] = useState(null);
  function click() {
    const join = generateId();
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
      shareFile({
        filename: file.name,
        total_buffer_size: buffer.length,
        buffer_size: 32768
      }, buffer);
    }
    fileReader.readAsArrayBuffer(file);
  }

  function shareFile(metadata, buffer) {
    socket.emit("file-meta", {
      uid: receiverId,
      metadata: metadata
    });
    socket.on("fs-share", function () {
      let chunk = buffer.slice(0, metadata.buffer_size);
      buffer = buffer.slice(metadata.buffer_size, buffer.length);
      if (chunk.length !== 0) {
        socket.emit("file-raw", {
          uid: receiverId,
          buffer: chunk
        });
      }
    })
  }
  return (
    <div id="join-id">
      {!joinId ? <button onClick={click}>Create Room</button> :
        <div><p>Room id : {joinId}</p>
          <input type="file" onChange={handleFileUpload}></input>
        </div>
      }
    </div>
  )
}

export default CreateRoom
