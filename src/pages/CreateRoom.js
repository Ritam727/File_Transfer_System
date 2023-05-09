import React, { useState } from 'react'
import io from "socket.io-client";

const socket = io();

function generateId() {
  return `${Math.trunc(Math.random() * 999)}-${Math.trunc(Math.random() * 999)}-${Math.trunc(Math.random() * 999)}`;
}

let genid;

const CreateRoom = () => {
  const [iid, setgenid] = useState(null);
  function click(genid) {
    genid = generateId();
    socket.emit("sender-join", { uid: genid });
    socket.on("init", function (uid) {

    });
    setgenid(genid);
  }
  console.log(iid);
  return (
    <div id="join-id">
      {!iid ? <button onClick={click}>Create Room</button> :
        <div><p>Room id : {iid}</p>
          <input type="file"></input>
        </div>
      }
    </div>
  )
}

export default CreateRoom
export { genid }
