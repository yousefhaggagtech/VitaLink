const trimValue = (value: string | undefined): string => value?.trim() ?? "";

const envNames = {
  signalRHubUrl: "NEXT_PUBLIC_SIGNALR_HUB_URL",
} as const;

type RequiredClientEnvKey = keyof typeof envNames;

export const clientEnv = {
  signalRHubUrl: trimValue(process.env.NEXT_PUBLIC_SIGNALR_HUB_URL),
  forceSignalRWebSockets:
    trimValue(process.env.NEXT_PUBLIC_SIGNALR_FORCE_WEBSOCKETS).toLowerCase() ===
    "true",
} as const;

export function requireClientEnv(name: RequiredClientEnvKey): string {
  const value = clientEnv[name];
  const envName = envNames[name];

  if (!value) {
    throw new Error(
      `${envName} is not defined. Set it in .env, then restart next dev or rebuild the app.`
    );
  }

  return value;
}
