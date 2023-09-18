import Pusher from "pusher-js"
import { useEffect } from "react"

export const PusherConnector = () => {
  useEffect(() => {
    console.log("Let's do it.")

    Pusher.logToConsole = true;

    var pusher = new Pusher('b05a0412d32eaefa65e5', {
      cluster: 'mt1'
    });

    var channel = pusher.subscribe('my-channel');
    channel.bind('my-event', function (data: any) {
      console.log(data)
    });
  }, [])
  return null
}
