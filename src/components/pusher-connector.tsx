import Pusher, * as PusherTypes from "pusher-js"
import { useEffect } from "react"
import { useStore } from "@/lib/store"

export const PusherConnector = () => {
  // const userId = useStore(state => state.userId)
  const userId = 1

  useEffect(() => {
    if (!userId) return
    const pusher = new Pusher('b05a0412d32eaefa65e5', {
      cluster: 'mt1'
    });

    const commonRoomChannel = pusher.subscribe('common_room');
    commonRoomChannel.bind('my-event', function (data: any) {
      console.log(data);
    });

    const presenceChannel = pusher.subscribe('presence-common_room');
    presenceChannel.bind('pusher:subscription_succeeded', (members: PusherTypes.Members) => {
      useStore.getState().setCount(members.count);
    });
    presenceChannel.bind('pusher:member_added', (member: any) => console.log('Member added:', member));
    presenceChannel.bind('pusher:member_removed', (member: any) => console.log('Member removed:', member));

    // Subscribe to user-specific channel if userId is available
    if (userId) {
      const userChannel = pusher.subscribe(`private-user-${userId}`);
      userChannel.bind('JobAssigned', (data: any) => {
        console.log(`Received data on user channel:`, data);
      });
    }

  }, [userId]); // Dependency array includes userId so that effect runs again if userId changes

  return null
}
