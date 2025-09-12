"use client";

import { useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Phone, Video, ArrowLeft, Send } from "lucide-react";

function ContactPageInner() {
  const params = useSearchParams();
  const modeParam = (params.get("mode") || params.get("action") || "chat").toLowerCase();
  const mode: "chat" | "call" | "video" = ["chat", "call", "video"].includes(modeParam)
    ? (modeParam as any)
    : "chat";
  const name = params.get("name") || params.get("with") || "Contact";
  const phone = params.get("phone") || "";
  const context = params.get("context") || undefined;

  const [message, setMessage] = useState("");
  const title = useMemo(() => {
    if (mode === "call") return `Call ${name}`;
    if (mode === "video") return `Video Call with ${name}`;
    return `Chat with ${name}`;
  }, [mode, name]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="icon">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
          {context && (
            <p className="text-xs md:text-sm text-muted-foreground">Context: {context}</p>
          )}
        </div>
      </div>

      {/* Action summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {mode === "chat" && <MessageCircle className="h-5 w-5" />}
            {mode === "call" && <Phone className="h-5 w-5" />}
            {mode === "video" && <Video className="h-5 w-5" />}
            <span>{mode === "chat" ? "Messaging" : mode === "call" ? "Phone" : "Video"} Action</span>
          </CardTitle>
          <CardDescription>
            {mode === "chat"
              ? "Send and receive messages. This is a placeholder UI – integrate your real-time chat provider here."
              : mode === "call"
              ? "Place a phone call using your device."
              : "Initiate a video call. Integrate your preferred SDK (e.g., WebRTC, Twilio)."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mode === "chat" && (
            <div className="space-y-3">
              <div className="h-72 border rounded-lg p-3 bg-muted/20 overflow-auto">
                <div className="text-sm text-muted-foreground text-center mt-24">
                  Chat messages will appear here
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder={`Message ${name}...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button disabled={!message.trim()}>
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>
          )}

          {mode !== "chat" && (
            <div className="space-y-4">
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Contact</Badge>
                  <span className="font-medium">{name}</span>
                </div>
                {phone && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Phone</Badge>
                    <span>{phone}</span>
                  </div>
                )}
              </div>
              <Separator />
              {mode === "call" && (
                <Button asChild className="w-full">
                  <a href={phone ? `tel:${phone.replace(/\s+/g, "")}` : "tel:"}>
                    <Phone className="mr-2 h-4 w-4" /> Start Call
                  </a>
                </Button>
              )}
              {mode === "video" && (
                <div className="space-y-2">
                  <Button className="w-full" variant="default">
                    <Video className="mr-2 h-4 w-4" /> Start Video Call
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    This is a placeholder. Connect to your video provider to enable calls.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Helpful links */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Need help?</CardTitle>
            <CardDescription>Visit support for live chat and docs</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/support">Open Support Center</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Live Tracking</CardTitle>
            <CardDescription>Monitor deliveries in real time</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/dashboard/track">Go to Tracking</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ContactPageInner />
    </Suspense>
  );
}
