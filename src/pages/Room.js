import React, { useEffect, useState } from 'react'
import io from "socket.io-client";
import download from 'downloadjs';

function generateId() {
  return `${Math.trunc(Math.random() * 999)}-${Math.trunc(Math.random() * 999)}-${Math.trunc(Math.random() * 999)}`;
}

const Room = () => {
  const [senderId, setSenderId] = useState(null);
  let sender = null;
  let receiverId = null;
  const [socket, setSocket] = useState(null);
  let transmittedData = 0;
  let bufferData = [];
  let metadata = {};
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
        bufferData = []
        socket.emit("fs-start", { uid: sender });
      });
      socket.on("fs-share", function (buffer) {
        bufferData.push(buffer);
        transmittedData += buffer.byteLength;
        if (transmittedData === metadata.total_buffer_size) {
          download(new Blob(bufferData), metadata.filename);
        } else {
          socket.emit('fs-start', { uid: sender });
        }
      });
    }
  }, [socket]);
  return (
    <div>
      {!senderId ?
        <form method="GET" onSubmit={submitForm}>
          <input type='text' name="join-id" id='join-id'></input>
          <button type="submit">Submit</button>
        </form> :
        <p>Room id : {senderId}</p>
      }
    </div>
  )
}

export default Room
