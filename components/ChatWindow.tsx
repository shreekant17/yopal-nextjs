import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Form,
  Input,
  ScrollShadow,
  Textarea,
  User,
} from "@nextui-org/react";
import { SendIcon } from "@/components/SendIcon";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { ChatType } from "@/types";
import { LeftArrowIcon } from "@/components/LeftArrowIcon";
import { doc, collection, orderBy, onSnapshot, query, getDocs, limit, } from "firebase/firestore";

import { db } from "@/libs/firestore";

//import { db } from "@/app/firebaseConfig"

type ChatWindowProps = {
  selectedChat: ChatType | null; // Accept selectedChat as prop
  setSelectedChat: (chat: ChatType | null) => void; // New prop to pass selected chat to parent
  userId: string | null; // Accept selectedChat as prop
};

type Chat = {
  _id: string;
  sender: {
    _id: string;
    fname: string;
    lname: string;
    avatar: string;
  };
  receiver: {
    _id: string;
    fname: string;
    lname: string;
    avatar: string;
  };
  text: string;
  status: string;
  attachments: string[];
  deleted: boolean;
  createdAt: string;
  __v: number;
};

async function fetchDataFirestore(
  userPairId: string, uid: string, rid: string, fetchChats: (uid: string, rid: string, isRealtime: boolean) => Promise<void>, setChats: React.Dispatch<React.SetStateAction<Chat[]>>
) {
  // Reference to the "messages" subcollection
  const messagesRef = collection(db, "messages", userPairId, "message");

  // Query with ordering by timestamp in ascending order
  const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

  // Flag to skip the initial load
  let isInitialLoad = true;

  // Listen for real-time updates
  const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
    if (isInitialLoad) {
      // Skip processing on the first load
      isInitialLoad = false;
      return;
    }

    console.log("Snapshot received:", querySnapshot);

    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const newMessage = { _id: change.doc.id, ...change.doc.data() };

        // Process only newly added messages
        console.log("New message added:", newMessage);
        fetchChats(uid, rid, true);


        // Optionally call fetchChats if needed
        // await fetchChats(uid, rid);
      }
    });
  });


}
const ChatWindow = ({
  selectedChat,
  userId,
  setSelectedChat,
}: ChatWindowProps) => {
  const [message, setMessage] = useState<string>("");
  const [uid, setUid] = useState<string>("");
  const [rid, setRid] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [userPairId, setUserPairId] = useState("");



  const chatEndRef = useRef<HTMLDivElement | null>(null); // Ref for the end of the chat

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({});
  };

  const fetchChats = async (uid: string, rid: string, isRealtime: boolean) => {
    try {
      const response = await fetch("api/fetchChats", {
        method: "POST",
        body: JSON.stringify({ userId: uid, receiverId: rid }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const result = await response.json();

        console.log(result);

        // Add only new messages
        if (result.messages && result.messages.length > 0) {
          if (isRealtime) {
            setChats((prevChats: Chat[]) => {
              // Get IDs of current messages in state
              const existingIds = new Set(prevChats.map((chat) => chat._id));

              // Filter messages that are not already in the state
              const newMessages = result.messages.filter(
                (message: Chat) => !existingIds.has(message._id)
              );

              // Return the updated chat array with new messages
              return [...prevChats, ...newMessages];
            });

          } else {

            setChats(result.messages);
          }



        }
      } else {
        // Handle errors if the response isn't OK
        const result = await response.json();
        console.error("Error fetching chats:", result);
      }
    } catch (err) {
      console.error("Error in fetchChats:", err);
    }
  };


  useEffect(() => {
    const uid = userId || "";
    if (uid && selectedChat) {
      setUid(uid);
      setRid(selectedChat.userId);


    }
  }, [userId, selectedChat]);


  useEffect(() => {
    if (selectedChat) {
      const userPairId = uid < rid ? `${uid}-${rid}` : `${rid}-${uid}`;
      fetchChats(uid, rid, false);  // Assuming this fetches the initial messages

      fetchDataFirestore(userPairId, uid, rid, fetchChats, setChats);

    }
  }, [uid, rid]);


  useEffect(() => {
    // Scroll to bottom whenever chats change
    scrollToBottom();
  }, [chats]);





  if (!selectedChat) {
    return (
      <Card className="w-full h-full mx-auto flex-col justify-center align-center">
        <h1 className="text-center"> Select a chat to start messaging</h1>
      </Card>
    );
  }

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    formData.append("sender", uid);
    formData.append("receiver", rid);

    try {
      const response = await fetch("api/sendMessage", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setMessage("");
      }
    } catch (err) {
      console.log(err);
    }
  };



  return (
    <Card className="w-full h-full">
      <CardHeader className="flex align-center">
        <Button
          isIconOnly
          onPress={() => {
            setSelectedChat(null);
          }}
          className="border-none"
          radius="full"
          variant="ghost"
        >
          <LeftArrowIcon />
        </Button>
        <User
          avatarProps={{ src: selectedChat.avatar }}
          description="online"
          name={`${selectedChat.fname} ${selectedChat.lname}`}
        />
      </CardHeader>
      <Divider />
      <ScrollShadow hideScrollBar className="h-[70vh]">
        <CardBody className="h-full flex-col gap-3 p-8">
          {chats.length > 0 ? (
            chats.map((chat) =>
              chat.sender._id === uid ? (
                <div className="send flex  justify-end received" key={chat._id}>
                  <Textarea
                    value={chat.text || ""}
                    isRequired
                    className="lg:max-w-sm"
                    isReadOnly
                    rows={1}
                    minRows={1}
                    endContent={
                      <div className="absolute bottom-1 right-1 text-xs text-gray-500">
                        {new Date(chat.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    }
                  />
                </div>
              ) : (
                <div className="received" key={chat._id}>
                  <Textarea
                    value={chat.text || ""}
                    isRequired
                    className="max-w-sm"
                    isReadOnly
                    rows={1}
                    minRows={1}
                    endContent={
                      <div className="absolute bottom-1 right-1 text-xs text-gray-500">
                        {new Date(chat.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    }
                  />
                </div>
              ),
            )
          ) : (
            <></>
          )}
          <div ref={chatEndRef} />
        </CardBody>
      </ScrollShadow>
      <CardFooter>
        <Form className="p-4 h-min w-full space-y-4" onSubmit={sendMessage}>
          <div className="flex items-end w-full">
            <Input

              isRequired
              className="flex-grow"
              placeholder="Write a message..."
              name="text"
              value={message}
              onChange={(e: any) => setMessage(e.target.value)}
            />
            <Button
              isIconOnly
              radius="full"
              color="danger"
              type="submit"
              className="ml-2"
            >
              <SendIcon />
            </Button>
          </div>
        </Form>
      </CardFooter>
    </Card>
  );
};

export default ChatWindow;
