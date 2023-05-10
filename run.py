import os
from flask import Flask, send_from_directory
from flask_socketio import SocketIO, join_room, emit
from engineio.payload import Payload

Payload.max_decode_packets = 100000
app = Flask(__name__, static_folder='build')
socketio = SocketIO(app, async_mode = 'eventlet', async_handlers = True, ping_interval = 50000, ping_timeout = 50000)

@socketio.on('connect')
def on_connect():
    print('Client connected')

@socketio.on('sender-join')
def on_sender_join(data):
    join_room(data['uid'])

@socketio.on('receiver-join')
def on_receiver_join(data):
    join_room(data['sender_uid'])
    emit('init', data['uid'], room=data['sender_uid'], broadcast = True)

@socketio.on('file-meta')
def on_file_meta(data):
    emit('fs-meta', data['metadata'], room=data['uid'], broadcast = True)

@socketio.on('fs-start')
def on_fs_start(data):
    emit('fs-share', None, room=data['uid'])

@socketio.on('file-raw')
def on_file_raw(data):
    emit('fs-share', data['buffer'], room=data['uid'], broadcast = True)

@socketio.on("disconnect")
def on_disconnect():
    print("Client disconnected")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    socketio.run(app, port=5000)
