'use client'

import "stream-chat-react/dist/css/v2/index.css"
import { useEffect, useState } from "react"
import { StreamChat, User } from "stream-chat"
import {
    Channel, ChannelHeader, Chat, MessageInput, MessageList, Thread, Window
} from "stream-chat-react"
import { AlbyUser } from "@/lib/useAlby"
import { useStreamUserToken } from "@/lib/useStreamUserToken"

export const ChatBox = ({ user }: { user: AlbyUser }) => {

  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<any>(null);
  const { token, userId } = useStreamUserToken()

  const initChannel = async (chatClient: any) => {
    if (!user || !userId || !token) return

    const channel = chatClient.channel('messaging', 'trollbox1b', {
      // add as many custom fields as you'd like
      image: 'https://pbs.twimg.com/profile_images/1695156914156392448/FTpOVV3s_400x400.jpg',
      name: 'Chat',
      members: [],
    });

    await channel.watch();

    setChannel(channel);
    setChatClient(chatClient)
  }

  useEffect(() => {
    if (!user || !userId || !token) return
    const lightning_address = "someusername@getalby.com";
    const userName = lightning_address.split('@')[0];

    const image = user?.avatar ?? `https://getstream.io/random_png/?id=${userId}&name=${userName}`;

    const streamUser: User = {
      id: userId,
      name: userName,
      image: image,
    };
    const apiKey = process.env.NEXT_PUBLIC_STREAM_APP_KEY as string;
    const userToken = token

    const chatClient = new StreamChat(apiKey);
    chatClient.connectUser(streamUser, userToken);

    initChannel(chatClient)

    return () => {
      chatClient?.closeConnection();
    };
  }, [user, token, userId])

  if (!chatClient || !channel) return null

  return (
    <Chat client={chatClient} theme='str-chat__theme-dark'>
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        {/* <Thread /> */}
      </Channel>
    </Chat>
  );
}
