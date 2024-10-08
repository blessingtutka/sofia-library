/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/providers/auth-provider";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import socialDate from "@/lib/social-date";

type Notification = {
  _id: string;
  _creationTime: number;
  userId: string;
  message: string;
  isRead: boolean;
};

export default function Notifications() {
  const { user } = useAuth();
  if (!user.id) return;
  const { toast } = useToast();
  const notis = useQuery(api.notification.getNotifications, {
    userId: user.id as Id<"users">,
  });
  const setAllAsRead = useMutation(api.notification.markAllNotificationAsRead);
  const setAsRead = useMutation(api.notification.markNotificationAsRead);

  const markAllAsRead = async () => {
    try {
      if (user && user.id) {
        await setAllAsRead({ userId: user._id as Id<"users"> });
        toast({
          title: "Mark all as read",
          description: "All notifications marked as read",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Error marking notifications as read",
      });
    }
  };

  // Mark a single notification as read
  const markAsRead = async (notiId: Id<"notification">) => {
    try {
      if (user && user.id) {
        await setAsRead({ notificationId: notiId });
        toast({
          title: "Mark as read",
          description: "Notification marked as read",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Error marking notification as read",
      });
    }
  };

  return (
    <div className="flex items-center justify-center">
      {/* max-w-[380px] */}
      <Card className="w-full max-w-[600px]">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            {notis && notis.length > 0
              ? `You have ${notis.length} notifications.`
              : "No notifications available."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* Push Notification toggle */}
          {/* <div className="flex items-center space-x-4 rounded-md border p-4">
            <BellIcon />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                Push Notifications
              </p>
              <p className="text-sm text-muted-foreground">
                Send notifications to device.
              </p>
            </div>
            <Switch />
          </div> */}
          <div className="">
            {notis && notis.length > 0 ? (
              <ScrollArea className="w-full h-[200px] overflow-y-auto">
                {/* mb-3 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0 */}
                {notis.map((noti) => (
                  <Button
                    key={noti._id}
                    size="lg"
                    className="grid grid-cols-[25px_1fr] items-start pb-4 h-auto p-4 w-full mb-3"
                    onClick={() => markAsRead(noti._id)}
                    disabled={noti.isRead}
                    variant="outline"
                  >
                    <span
                      className={`flex h-2 w-2 translate-y-1 rounded-full ${
                        noti.isRead ? "bg-transparent" : "bg-sky-500"
                      }`}
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {noti.message}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {socialDate(noti._creationTime)}
                      </p>
                    </div>
                  </Button>
                ))}
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground">No notifications.</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={markAllAsRead}
            disabled={!notis || notis.length === 0}
          >
            <CheckIcon className="mr-2 h-4 w-4" /> Mark all as read
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
