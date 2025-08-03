import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit, MapPin, User as UserIcon } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          View and manage your personal information.
        </p>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">User Information</CardTitle>
            <CardDescription>
              Your details on the AgriLink platform.
            </CardDescription>
          </div>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit Profile</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://placehold.co/200x200.png" data-ai-hint="user portrait" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl font-bold">User Name</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserIcon className="h-4 w-4" />
                <span>Farmer</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Fresno, CA</span>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold text-lg mb-2">Farm Details</h4>
            <div className="text-sm text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-2">
              <p><span className="font-medium text-foreground">Farm Name:</span> Green Valley Farms</p>
              <p><span className="font-medium text-foreground">Land Size:</span> 150 Acres</p>
              <p><span className="font-medium text-foreground">Main Crops:</span> Tomatoes, Avocados</p>
              <p><span className="font-medium text-foreground">Member Since:</span> Jan 2022</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
