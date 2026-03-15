import * as signalR from "@microsoft/signalr";
import Cookies from "js-cookie";
import { SensorData } from "@/domain/entities/SensorData";
import { ISensorHubService } from "@/domain/interfaces/ISensorHubService ";

export class SensorHubService implements ISensorHubService {

  async connectToHub(
    username: string,
    onReceiveUpdate: (data: SensorData) => void,
    onReconnected: (() => void) | null = null
  ): Promise<signalR.HubConnection> {

    const url = process.env.NEXT_PUBLIC_SIGNALR_HUB_URL;

    if (!url) {
      throw new Error("SIGNALR URL is not defined");
    }

    const hub = new signalR.HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: () => Cookies.get("token") || "",
      })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    if (onReconnected) {
      hub.onreconnected(async () => {
        console.log("Reconnected. Reregistering user.");
        await hub.invoke("RegisterConnection", username);
        onReconnected();
      });
    }

    hub.on("ReceiveLiveUpdate", (data: SensorData) => {
      onReceiveUpdate(data);
    });

    await hub.start();

    try {
      await hub.invoke("RegisterConnection", username);
      console.log("Registered:", username);
    } catch (err) {
      console.error("Register failed:", err);
    }

    return hub;
  }

  disconnectHub(hub: signalR.HubConnection | null): void {
    if (hub) {
      hub.stop();
    }
  }
}