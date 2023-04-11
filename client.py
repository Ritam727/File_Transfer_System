# Python program to implement client side of chat room.
import socket
import select
import sys
from os import getpid

server : socket.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
if len(sys.argv) != 3:
    print("Correct usage: script, IP address, port number")
    exit()
IP_address : str = str(sys.argv[1])
Port : int = int(sys.argv[2])
server.connect((IP_address, Port))

def send_file(file_name : str):
    f = open(file_name[:-1], mode = "rb").read()
    print(f)

while True:

    # maintains a list of possible input streams
    sockets_list : list = [sys.stdin, server]

    """ There are two possible input situations. Either the
	user wants to give manual input to send to other people,
	or the server is sending a message to be printed on the
	screen. Select returns from sockets_list, the stream that
	is reader for input. So for example, if the server wants
	to send a message, then the if condition will hold true
	below.If the user wants to send a message, the else
	condition will evaluate as true"""
    read_sockets, write_socket, error_socket = None, None, None
    try:
        read_sockets, write_socket, error_socket = select.select(
            sockets_list, [], [])

        for socks in read_sockets:
            if socks == server:
                message : str = socks.recv(1024)
                print(message.decode())
            else:
                message : str = sys.stdin.readline()
                send_file(message)
                server.send(message.encode())
                sys.stdout.write("<You>")
                sys.stdout.write(message)
                sys.stdout.flush()
    except KeyboardInterrupt:
        print("Exiting", getpid())
        break
server.close()
