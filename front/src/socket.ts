import { io, Socket } from "socket.io-client";
// export const socket: Socket = io("http://localhost:3001", {transports: ['websocket']});
export let gameSocket: Socket = io("http://localhost:3001/game", {transports: ['websocket']});
export let chatSocket: Socket = io("http://localhost:3001/chat", {transports: ['websocket']});
export let statusSocket: Socket = io("http://localhost:3001/status", {transports: ['websocket']});

export function reload_socket() {
    gameSocket = io("http://localhost:3001/game", {transports: ['websocket']});
    chatSocket = io("http://localhost:3001/chat", {transports: ['websocket']});
    statusSocket = io("http://localhost:3001/status", {transports: ['websocket']});
}