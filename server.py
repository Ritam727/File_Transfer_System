import socket
import threading
import sys

# Set up socket object and bind to a port
s : socket.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
if len(sys.argv) != 3:
    print("Correct usage: script, IP address, port number")
    exit()
IP_address : str = str(sys.argv[1])
Port : int = int(sys.argv[2])

s.bind((IP_address, Port))

# Create a list to store client connections
connections : list = []

# Define a function to handle incoming client connections
def handle_client(conn : socket.socket, addr : str):
    # Add the client's connection to the list of connections
    connections.append(conn)
    print(f'{addr} connected.')

    # Continuously receive messages from the client and broadcast them to all clients
    while True:
        try:
            data : str = conn.recv(1024)
            if data:
                message : str  = data.decode()
                print(f'Received message from {addr}: {message}')
                broadcast(conn, message)
            else:
                # If the client disconnects, remove their connection from the list of connections
                connections.remove(conn)
                print(f'{addr} disconnected.')
                conn.close()
                break
        except:
            continue

# Define a function to broadcast messages to all clients
def broadcast(cur : socket.socket, message : str):
    for connection in connections:
        if cur != connection:
            connection.sendall(message.encode())

# Listen for incoming connections
s.listen()
print('Server is listening...')

# Continuously accept incoming connections and spawn a new thread to handle each client
while True:
    conn, addr = None, None
    try:
        conn, addr = s.accept()
        thread : threading.Thread = threading.Thread(target=handle_client, args=(conn, addr))
        thread.start()
    except KeyboardInterrupt:
        print("Exiting Client")
        break
