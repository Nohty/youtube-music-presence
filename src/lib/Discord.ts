import { Client, Presence } from "discord-rpc";

export class Discord {
  private static clientId = "936999007530655785";
  private static ready = false;
  private static rpc: Client;

  public static login() {
    return new Promise<void>((resolve) => {
      this.rpc = new Client({ transport: "ipc" });
      this.rpc.login({ clientId: this.clientId }).catch(console.error);
      this.rpc.on("ready", () => {
        this.ready = true;
        resolve();
      });
    });
  }

  public static setActivity(activity: Presence) {
    if (!this.ready) return;
    this.rpc.setActivity(activity);
  }

  public static clearActivity() {
    if (!this.ready) return;
    this.rpc.clearActivity();
  }

  public static isLoggedIn() {
    return this.ready;
  }
}
