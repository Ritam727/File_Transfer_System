import os
from flask import Flask, send_from_directory, request
from flask_socketio import SocketIO, join_room, emit, leave_room
from engineio.payload import Payload

Payload.max_decode_packets = 100000
app = Flask(__name__, static_folder='build')
socketio = SocketIO(app, async_mode = 'eventlet', async_handlers = True, ping_interval = 50000, ping_timeout = 50000)
senders = {}

@socketio.on('connect')
def on_connect():
    print('Client connected')

@socketio.on('sender-join')
def on_sender_join(data):
    join_room(data['uid'])
    senders[request.sid] = data['uid']

@socketio.on('receiver-join')
def on_receiver_join(data):
    join_room(data['uid'])
    if data['sender_uid'] in senders.values():
        join_room(data['sender_uid'])
        emit('init', data['uid'], room=data['sender_uid'], broadcast = True)
    else:
        emit('wrong-room-id', None, room=data['uid'])
    leave_room(data['uid'])

@socketio.on('file-meta')
def on_file_meta(data):
    emit('fs-meta', data['metadata'], room=data['uid'], broadcast = True)

@socketio.on('fs-start')
def on_fs_start(data):
    emit('fs-share', None, room=data['uid'])

@socketio.on('file-raw')
def on_file_raw(data):
    emit('fs-share', {'buffer': data['buffer'], 'metadata': data['metadata']}, room=data['uid'], broadcast = True)

@socketio.on("disconnect")
def on_disconnect():
    if request.sid in senders.keys():
        emit('sender-left', None, room=senders[request.sid], broadcast = True)
        del senders[request.sid]
    print("Client disconnected")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    socketio.run(app, port=5000, host="0.0.0.0")
