import EventEmitter from "events";
import { Server, Socket } from "socket.io";

export class SocketServer {
  private static io: Server;
  private static sockets = new Map<number, Socket>();
  private static events = new EventEmitter();

  public static start(port: number): void {
    this.io = new Server(port, { cors: { origin: "https://music.youtube.com" } });
    this.io.on("connection", (socket) => {
      const socketId = this.sockets.size;
      this.sockets.set(socketId, socket);

      socket.on("yt-music", (value: MusicInfo) => {
        this.events.emit("yt-music", value);
      });

      socket.on("disconnect", () => {
        this.sockets.delete(socketId);
        if (!this.hasConnections()) this.events.emit("yt-music-clear");
      });
    });
  }

  public static hasConnections(): boolean {
    return this.sockets.size > 0;
  }

  public static stop(): void {
    this.io.close();
    this.sockets.forEach((socket) => socket.disconnect());
    this.sockets.clear();
  }

  public static send(key: string, value: string): void {
    this.io.emit(key, value);
  }

  public static on(key: EventType, callback: (...args: any) => any): void {
    this.events.on(key, callback);
  }
}

type EventType = "yt-music" | "yt-music-clear";
