import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  User,
} from "@nextui-org/react";
import { Divider } from "@nextui-org/divider";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ChatType } from "@/types";
import { SearchIcon } from "@/components/icons";

type ChatListProps = {
  userId: string;
  setSelectedChat: (chat: ChatType | null) => void; // New prop to pass selected chat to parent
};

const ChatList = ({ userId, setSelectedChat }: ChatListProps) => {
  const [chatList, setChatList] = useState<ChatType[]>([]);
  const [searchResults, setSearchResults] = useState<ChatType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchChatList = async () => {
    try {
      const response = await fetch("/api/fetchChatList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const result = await response.json();
        setChatList(result.users);
      } else {
        const error = await response.json();
        //console.error(error);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Something went wrong.");
    }
  };

  const searchUsers = async (query: string) => {
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const result = await response.json();
        setSearchResults(result.users);
      } else {
        const error = await response.json();
        //console.error(error);
      }
    } catch (error) {
      // console.error("Error searching users:", error);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchChatList();
    }
  }, [userId]);

  useEffect(() => {
    if (searchQuery) {
      const delayDebounceFn = setTimeout(() => {
        searchUsers(searchQuery);
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleChatClick = (chat: ChatType) => {
    setSelectedChat(chat);
  };

  return (
    <Card className="w-full h-full p-0">
      <CardHeader>
        <Input
          aria-label="Search"
          classNames={{
            inputWrapper: "bg-default-100",
            input: "text-sm",
          }}
          labelPlacement="outside"
          placeholder="Search..."
          startContent={
            <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
          }
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </CardHeader>
      <Divider />

      <CardBody className=" p-0">
        {searchResults.length > 0 && (
          <div className=" bg-white shadow-lg w-full rounded-md">
            {searchResults.map((user) => (
              <Button
                key={user.userId}
                className="user w-full border-none h-max cursor-pointer p-4 flex justify-between align-top"
                onPress={() => handleChatClick(user)}
                onKeyDown={(e) => e.key === "Enter" && handleChatClick(user)}
                radius="none"
                color="default"
                variant="ghost"

              >
                <User
                  avatarProps={{ src: user.avatar }}
                  name={user.fname}
                  description={user.latestMessage?.text || "No recent messages"}
                />
              </Button>
            ))}
          </div>
        )}
        {chatList.length > 0 ? (
          <>
            {chatList.map((chat, index) => (
              <div key={chat.userId}>
                <Button
                  className="user w-full border-none h-max cursor-pointer p-4 flex justify-between align-top"
                  radius="none"
                  onPress={() => handleChatClick(chat)}
                  color="default"
                  variant="ghost"
                >
                  <User
                    avatarProps={{ src: chat.avatar }}
                    description={
                      chat.latestMessage.text.length > 50
                        ? chat.latestMessage.text.substring(0, 50) + "..."
                        : chat.latestMessage.text
                    }
                    name={chat.fname}
                  />
                  <div className="absolute bottom-1 right-1 text-xs text-gray-500">
                    {new Date(chat.latestMessage.createdAt).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </div>
                </Button>

              </div>
            ))}
          </>
        ) : (
          <p>No chats</p>
        )}
      </CardBody>
    </Card>
  );
};

export default ChatList;
