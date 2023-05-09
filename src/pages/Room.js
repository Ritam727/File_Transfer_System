import React, { useState } from 'react'

const Room = () => {
  const [senderid, setsenderid] = useState(null);
  function submitForm(event) {
    event.preventDefault();
    setsenderid(event.target[0].value);
  }
  return (
    <div>
      {!senderid ?
        <form method="GET" onSubmit={submitForm}>
          <input type='text' name="join-id" id='join-id'></input>
          <button type="submit">Submit</button>
        </form> :
        <p>Room id : {senderid}</p>
      }
    </div>
  )
}

export default Room
