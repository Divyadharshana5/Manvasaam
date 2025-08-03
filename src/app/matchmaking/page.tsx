import MatchmakingClient from "./matchmaking-client";

export default function MatchmakingPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Intelligent Crop Matching
        </h2>
        <p className="text-muted-foreground">
          Let our AI find the perfect match for your crop needs.
        </p>
      </div>
      <MatchmakingClient />
    </div>
  );
}
