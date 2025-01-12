import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Form, ScrollShadow, Textarea, User } from '@nextui-org/react';
import { SendIcon } from '@/components/SendIcon';
import React, { FormEvent, useEffect, useState } from 'react';
import { ChatType } from '@/types';
import { LeftArrowIcon } from './LeftArrowIcon';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from "@/libs/firestore";


type ChatWindowProps = {
    selectedChat: ChatType | null; // Accept selectedChat as prop
    setSelectedChat: (chat: ChatType | null) => void; // New prop to pass selected chat to parent
    userId: string | null; // Accept selectedChat as prop
};

type Chat = {
    _id: string,
    sender: {
        _id: string,
        fname: string,
        lname: string,
        avatar: string
    },
    receiver: {
        _id: string,
        fname: string,
        lname: string,
        avatar: string
    },
    text: string,
    status: string,
    attachments: string[],
    deleted: boolean,
    createdAt: string,
    __v: number
}

type Snap = {
    id: string;
    // Add other fields from doc.data() as needed, for example:
    // content: string;
}




const ChatWindow = ({ selectedChat, userId, setSelectedChat }: ChatWindowProps) => {

    const [message, setMessage] = useState<string>("");
    const [uid, setUid] = useState<string>("");
    const [rid, setRid] = useState<string>("");
    const [chats, setChats] = useState<Chat[]>([]);

    const fetchChats = async (uid: string, rid: string) => {
        try {
            const response = await fetch("api/fetchChats", {
                method: "POST",
                body: JSON.stringify({ userId: uid, receiverId: rid })
            });
            if (response.ok) {
                const result = await response.json();
                console.log(result);
                setChats(result.messages)
            } else {
                const result = await response.json();
                console.log(result);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const uid = userId || "";
        if (uid && selectedChat) {
            setUid(uid);
            setRid(selectedChat.userId);
        }
    }, [userId, selectedChat]);

    useEffect(() => {
        if (selectedChat)
            fetchChats(uid, rid);

    }, [uid, rid])




    if (!selectedChat) {

        return (
            <Card className="w-full h-full mx-auto flex-col justify-center align-center">
                <h1 className='text-center'> Select a chat to start messaging</h1>
            </Card>
        )
    }


    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        formData.append("sender", uid);
        formData.append("receiver", rid);

        try {
            const response = await fetch("api/sendMessage", {
                method: "POST",
                body: formData

            });
            if (response.ok) {
                const result = await response.json();
                console.log(result);
                setMessage("");
            }
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <Card className="w-full h-full">
            <CardHeader className='flex align-center'>
                <Button
                    isIconOnly
                    onPress={() => {
                        setSelectedChat(null);
                    }}
                    className='border-none'
                    radius='full'
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
                    {
                        chats.length > 0 ? (
                            chats.map((chat) => (
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
                                                (
                                                    <div className="absolute bottom-1 right-1 text-xs text-gray-500">
                                                        {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                )
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
                                                (
                                                    <div className="absolute bottom-1 right-1 text-xs text-gray-500">
                                                        {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                )
                                            }
                                        />
                                    </div>
                                )
                            ))
                        ) : (
                            <></>
                        )
                    }



                </CardBody>
            </ScrollShadow>
            <CardFooter>
                <Form className="p-4 h-min w-full space-y-4" onSubmit={sendMessage}>
                    <div className="flex items-end w-full">
                        <Textarea
                            rows={1}
                            minRows={1}
                            isRequired
                            className="flex-grow"
                            placeholder="Write a message..."
                            name="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
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
        </Card >
    );
}

export default ChatWindow;
