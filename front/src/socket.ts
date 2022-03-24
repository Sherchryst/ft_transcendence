import { io, Socket } from "socket.io-client";
export const socket: Socket = io("http://localhost:3001", {transports: ['websocket']});
export const gameSocket: Socket = io("http://localhost:3001/game", {transports: ['websocket']});