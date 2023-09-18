import Pusher, * as PusherTypes from "pusher-js"
import { useEffect } from "react"
import { useStore } from "@/lib/store"

export const PusherConnector = () => {
  useEffect(() => {
    console.log("Let's do it.")

    Pusher.logToConsole = true;

    var pusher = new Pusher('b05a0412d32eaefa65e5', {
      cluster: 'mt1'
    });

    var channel1 = pusher.subscribe('my-channel');
    channel1.bind('my-event', function (data: any) {
      console.log(data)
    });

    const channel = pusher.subscribe('presence-my-channel');

    channel.bind('pusher:subscription_succeeded', (members: PusherTypes.Members) => {
      console.log('Subscription succeeded:', members);
      useStore.getState().setCount(members.count);
    });

    channel.bind('pusher:member_added', (member: any) => {
      console.log('Member added:', member);
    });

    channel.bind('pusher:member_removed', (member: any) => {
      console.log('Member removed:', member);
    });
  }, [])
  return null
}
