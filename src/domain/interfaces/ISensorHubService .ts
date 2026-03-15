import * as signalR from "@microsoft/signalr";
import { SensorData } from "@/domain/entities/SensorData";

export interface ISensorHubService {
  connectToHub(
    username: string,
    onReceiveUpdate: (data: SensorData) => void,
    onReconnected?: (() => void) | null
  ): Promise<signalR.HubConnection>;

  disconnectHub(hub: signalR.HubConnection | null): void;
}