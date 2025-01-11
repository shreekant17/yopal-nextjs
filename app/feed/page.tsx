"use client";
import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Link,
    Image,
    User,
    Skeleton,
    useDisclosure,
    Dropdown,
    DropdownTrigger,
    DropdownItem,
    DropdownMenu,
    Avatar,
    AvatarGroup,
} from "@nextui-org/react";
import { HeartIcon } from "@/components/HeartIcon";
import { ShareIcon } from "@/components/ShareIcon";
import { CommentsIcon } from "@/components/CommentsIcon";
import { useSession } from "next-auth/react";
import CommentBox from "@/components/CommentBox";
import { SessionUser } from "@/types";
import { getRelativeTime } from "@/components/getRelativeTime";
import { ThreeDots } from "@/components/ThreeDots";


// Define the types for User and Post
type User = {
    avatar: string;
    email: string;
    fname: string;
    _id: string;
};

type Post = {
    user: User;
    media: string;
    content: string;
    _id: string;
    createdAt: string;
    likes: string[];
    likedByUser: boolean; // New property
    likers: [
        {
            _id: string, fname: string, lname: string, avatar: string
        }

    ]
};



const Feed: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]); // State for posts
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data: session, status } = useSession();
    const [commentPostId, setCommentPostId] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [token, setToken] = useState<string>("");



    // Function to fetch posts
    const getAllPosts = async (userId: string): Promise<void> => {
        try {
            const response = await fetch("/api/fetchPosts", { method: "POST", body: JSON.stringify({ userId }) });
            if (response.ok) {
                const data = await response.json();
                setPosts(data.posts || []);
                //console.log(posts)

            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    // Function to handle liking a post



    const handleLike = async (postId: string): Promise<void> => {

        try {
            const response = await fetch("/api/like", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postId, token }),
            });
            if (response.ok) {
                // Toggle like state locally
                const { likers } = await response.json();
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === postId
                            ? {
                                ...post,
                                likedByUser: !post.likedByUser, // Toggle the like state
                                likes: post.likedByUser
                                    ? post.likes.filter((id) => id !== userId) // Remove user ID
                                    : [...post.likes, userId], // Add user ID
                                likers: likers, // Update likers array with API response
                            }
                            : post
                    )
                );
                console.log("LikeButtonPressed");

            }
        } catch (error) {
            console.error("Error liking the post:", error);
        }

    };


    // Fetch posts when the component mounts
    useEffect(() => {
        const storedUserId = (session?.user as SessionUser)?.id || "";
        setToken((session?.user as SessionUser)?.jwtToken || "")
        setUserId(storedUserId);
        getAllPosts(storedUserId);
    }, [session]);

    return (
        <div className="flex flex-col justify-center items-center gap-5 p-0">
            <CommentBox isOpen={isOpen} onClose={onClose} postId={commentPostId} />
            {posts.length > 0 ? (
                posts.map((post) => (
                    <Card radius="none" key={post._id} className="w-auto">
                        <CardHeader className="flex gap-3 justify-between">
                            <User
                                avatarProps={{ src: post.user.avatar }}
                                description={
                                    getRelativeTime(post.createdAt)
                                }
                                name={post.user.fname}
                            />
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        className="border-none"
                                        radius="full"
                                        isIconOnly variant="bordered">
                                        <ThreeDots />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Static Actions">
                                    <DropdownItem key="shre">Share Post</DropdownItem>
                                    <DropdownItem key="edit">Edit Post</DropdownItem>
                                    {userId === post.user._id ? (
                                        <DropdownItem key="delete" className="text-danger" color="danger">
                                            Delete Post
                                        </DropdownItem>

                                    ) : (
                                        <></>
                                    )
                                    }
                                </DropdownMenu>
                            </Dropdown>
                        </CardHeader>
                        <Divider />
                        <CardBody className="overflow-visible p-0">
                            <Image

                                radius="none"
                                alt="Post image"
                                className="object-cover lg:w-[500px] w-screen"
                                src={post.media}
                            />
                        </CardBody>
                        <Divider />
                        <CardFooter className="flex gap-3">
                            <Button

                                className="border-none"
                                radius="full"
                                variant="ghost"
                                isIconOnly
                                aria-label="Like"
                                onPress={() => {
                                    handleLike(post._id);

                                }}
                            >
                                <HeartIcon
                                    filled={post.likedByUser}
                                    fill={post.likedByUser ? "red" : "currentColor"}
                                />
                            </Button>
                            <Button
                                className="border-none"
                                radius="full"
                                variant="ghost"
                                onPress={() => {
                                    setCommentPostId(post._id); // First action
                                    onOpen(); // Second action
                                }}
                                isIconOnly aria-label="Comments">
                                <CommentsIcon filled={false} />
                            </Button>
                            <Button

                                className="border-none"
                                radius="full"
                                variant="ghost"
                                isIconOnly aria-label="Share">
                                <ShareIcon />
                            </Button>
                        </CardFooter>

                        {
                            post.likes.length > 0 ? (
                                <AvatarGroup
                                    className="mx-4"
                                    isBordered
                                    max={3}
                                    renderCount={(count) => (
                                        <p className="text-small text-foreground font-medium ms-2">
                                            {post.likes.length === 1
                                                ? `liked by ${post.likers[0].fname}`
                                                : post.likes.length === 2
                                                    ? `liked by ${post.likers[0].fname} and ${count - 1} other`
                                                    : `liked by ${post.likers[0].fname} and ${count - 1} others`}
                                        </p>
                                    )}
                                    total={post.likes.length}
                                >
                                    {post.likers.map((liker, index) => (
                                        <Avatar
                                            key={index}
                                            size="sm"
                                            style={{ width: '20px', height: '20px' }}
                                            src={liker.avatar || ""}
                                            alt={liker.fname}
                                        />
                                    ))}
                                </AvatarGroup>
                            ) : (
                                <></>
                            )
                        }





                        <p className="text-xs p-4">{post.content}</p>
                    </Card>
                ))
            ) : (
                <>
                    <Card radius="none" className="w-screen lg:w-[500px] space-y-5 p-4" >
                        <div className="w-80  flex items-center gap-3">
                            <div>
                                <Skeleton className="flex rounded-full w-12 h-12" />
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <Skeleton className="h-3 w-3/5 rounded-lg" />
                                <Skeleton className="h-3 w-4/5 rounded-lg" />
                            </div>
                        </div>
                        <Skeleton className="rounded-lg">
                            <div className="h-48 rounded-lg bg-default-300" />
                        </Skeleton>
                        <div className="space-y-3 ">
                            <Skeleton className="w-3/5 rounded-lg">
                                <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                            </Skeleton>
                            <Skeleton className="w-4/5 rounded-lg">
                                <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                            </Skeleton>
                            <Skeleton className="w-2/5 rounded-lg">
                                <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                            </Skeleton>
                        </div>
                    </Card>
                    <Card radius="none" className="w-screen lg:w-[500px] space-y-5 p-4" >
                        <div className="w-80  flex items-center gap-3">
                            <div>
                                <Skeleton className="flex rounded-full w-12 h-12" />
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <Skeleton className="h-3 w-3/5 rounded-lg" />
                                <Skeleton className="h-3 w-4/5 rounded-lg" />
                            </div>
                        </div>
                        <Skeleton className="rounded-lg">
                            <div className="h-48 rounded-lg bg-default-300" />
                        </Skeleton>
                        <div className="space-y-3 ">
                            <Skeleton className="w-3/5 rounded-lg">
                                <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                            </Skeleton>
                            <Skeleton className="w-4/5 rounded-lg">
                                <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                            </Skeleton>
                            <Skeleton className="w-2/5 rounded-lg">
                                <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                            </Skeleton>
                        </div>
                    </Card>
                    <Card radius="none" className="w-screen lg:w-[500px] space-y-5 p-4" >
                        <div className="w-80  flex items-center gap-3">
                            <div>
                                <Skeleton className="flex rounded-full w-12 h-12" />
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <Skeleton className="h-3 w-3/5 rounded-lg" />
                                <Skeleton className="h-3 w-4/5 rounded-lg" />
                            </div>
                        </div>
                        <Skeleton className="rounded-lg">
                            <div className="h-48 rounded-lg bg-default-300" />
                        </Skeleton>
                        <div className="space-y-3 ">
                            <Skeleton className="w-3/5 rounded-lg">
                                <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                            </Skeleton>
                            <Skeleton className="w-4/5 rounded-lg">
                                <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                            </Skeleton>
                            <Skeleton className="w-2/5 rounded-lg">
                                <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                            </Skeleton>
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
};

export default Feed;
