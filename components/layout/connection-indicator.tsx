import { Badge } from "@/components/ui/badge";

export type ConnectionState = "disconnected" | "connecting" | "connected" | "reconnecting";

export function ConnectionIndicator({
  state,
  accountType,
}: {
  state: ConnectionState;
  accountType?: "demo" | "real";
}) {
  const map: Record<ConnectionState, { label: string; variant: "neutral" | "signal" | "amber" | "danger" }> = {
    disconnected: { label: "Not connected", variant: "neutral" },
    connecting: { label: "Connecting…", variant: "amber" },
    connected: { label: "Connected", variant: "signal" },
    reconnecting: { label: "Reconnecting…", variant: "amber" },
  };
  const { label, variant } = map[state];

  return (
    <div className="flex items-center gap-2">
      <Badge variant={variant}>
        <span
          className={
            variant === "signal"
              ? "h-1.5 w-1.5 rounded-full bg-signal"
              : variant === "amber"
                ? "h-1.5 w-1.5 rounded-full bg-amber"
                : "h-1.5 w-1.5 rounded-full bg-text-muted"
          }
        />
        {label}
      </Badge>
      {accountType && state === "connected" && (
        <Badge variant={accountType === "real" ? "danger" : "neutral"}>
          {accountType === "real" ? "REAL" : "DEMO"}
        </Badge>
      )}
    </div>
  );
}
