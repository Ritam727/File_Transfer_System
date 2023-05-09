import os
from flask import Flask, send_from_directory
from flask_socketio import SocketIO, join_room, emit

app = Flask(__name__, static_folder='build')
socketio = SocketIO(app, logger = False)

@socketio.on('connect')
def on_connect():
    print('Client connected')

@socketio.on('sender-join')
def on_sender_join(data):
    join_room(data['uid'])

@socketio.on('receiver-join')
def on_receiver_join(data):
    join_room(data['uid'])
    emit('init', data['uid'], room=data['sender_uid'])

@socketio.on('file-meta')
def on_file_meta(data):
    emit('fs-meta', data['metadata'], room=data['uid'])

@socketio.on('fs-start')
def on_fs_start(data):
    emit('fs-share', {}, room=data['uid'])

@socketio.on('file-raw')
def on_file_raw(data):
    emit('fs-share', data['buffer'], room=data['uid'])

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    socketio.run(app, port=5000)
