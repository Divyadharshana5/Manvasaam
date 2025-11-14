import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TransportSettingsPage() {
  return (
    <div className="min-h-screen w-full overflow-auto">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Transport Settings</h1>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/transport">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Configure transport preferences and integrations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This page is under construction. Add settings controls here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
