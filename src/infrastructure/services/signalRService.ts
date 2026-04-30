import * as signalR from "@microsoft/signalr";
import Cookies from "js-cookie";
import { SensorData } from "@/domain/entities/SensorData";
import { ISensorHubService } from "@/domain/interfaces/ISensorHubService ";
import { clientEnv, requireClientEnv } from "@/infrastructure/config/clientEnv";

export interface SensorHubCallbacks {
  onReceiveUpdate: (data: SensorData) => void;
  onReconnecting?: (error?: Error) => void;
  onReconnected?: () => void;
  onClosed?: (error?: Error) => void;
}

export class SensorHubService implements ISensorHubService {
  createHubConnection(
    username: string,
    callbacks: SensorHubCallbacks
  ): signalR.HubConnection {
    const url = this.getValidatedHubUrl();
    const connectionOptions: signalR.IHttpConnectionOptions = {
      accessTokenFactory: () => Cookies.get("token") || "",
    };

    if (clientEnv.forceSignalRWebSockets) {
      connectionOptions.transport = signalR.HttpTransportType.WebSockets;
      connectionOptions.skipNegotiation = true;
    }

    const hub = new signalR.HubConnectionBuilder()
      .withUrl(url, connectionOptions)
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .build();

    hub.on("ReceiveLiveUpdate", callbacks.onReceiveUpdate);

    hub.onreconnecting((error) => {
      callbacks.onReconnecting?.(error);
    });

    hub.onreconnected(async () => {
      await this.registerConnection(hub, username);
      callbacks.onReconnected?.();
    });

    hub.onclose((error) => {
      callbacks.onClosed?.(error);
    });

    return hub;
  }

  async startHub(
    hub: signalR.HubConnection,
    username: string
  ): Promise<void> {
    await hub.start();
    await this.registerConnection(hub, username);
  }

  async connectToHub(
    username: string,
    onReceiveUpdate: (data: SensorData) => void,
    onReconnected: (() => void) | null = null
  ): Promise<signalR.HubConnection> {
    const hub = this.createHubConnection(username, {
      onReceiveUpdate,
      onReconnected: onReconnected || undefined,
    });

    await this.startHub(hub, username);

    return hub;
  }

  disconnectHub(hub: signalR.HubConnection | null): void {
    if (!hub || hub.state === signalR.HubConnectionState.Disconnected) {
      return;
    }

    hub.off("ReceiveLiveUpdate");
    void hub.stop().catch((error) => {
      console.error("SignalR stop failed:", error);
    });
  }

  private getValidatedHubUrl(): string {
    const url = requireClientEnv("signalRHubUrl");

    try {
      new URL(url);
    } catch {
      throw new Error(`NEXT_PUBLIC_SIGNALR_HUB_URL is invalid: ${url}`);
    }

    return url;
  }

  private async registerConnection(
    hub: signalR.HubConnection,
    username: string
  ): Promise<void> {
    try {
      await hub.invoke("RegisterConnection", username);
      console.log("Registered:", username);
    } catch (err) {
      console.error("Register failed:", err);
    }
  }
}
