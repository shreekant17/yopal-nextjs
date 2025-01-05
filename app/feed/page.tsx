"use client";
import React, { useEffect } from "react";
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
} from "@nextui-org/react";
import { HeartFilledIcon } from "@/components/icons";
import { HeartIcon } from "@/components/HeartIcon";
import { ShareIcon } from "@/components/ShareIcon";
import { CommentsIcon } from "@/components/CommentsIcon";

// Define the types for User and Post
type User = {
    avatar: string;
    email: string;
    name: string;
};

type Post = {
    user: User;
    media: string;  // Added the media property (post image)
    content: string; // Added content property for the post content
};

const Feed = () => {
    const [posts, setPosts] = React.useState<Post[]>([]); // Explicitly typing the posts state

    // Function to fetch posts
    const getAllPosts = async () => {
        try {
            const response = await fetch("/api/fetchPosts", { method: "GET" });
            if (response.ok) {
                const data = await response.json();
                setPosts(data.posts || []); // Update state with posts
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    // Fetch posts when the component mounts
    useEffect(() => {
        getAllPosts();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center gap-5">
            {posts.length > 0 ? (
                posts.map((post, index) => (
                    <Card key={index} className="w-auto">
                        <CardHeader className="flex gap-3">
                            <User
                                avatarProps={{ src: post.user.avatar }}
                                description={
                                    <Link isExternal href={post.user.email} size="sm">
                                        {post.user.name}
                                    </Link>
                                }
                                name={post.user.name}
                            />
                        </CardHeader>
                        <Divider />
                        <CardBody className="overflow-visible py-2">
                            <Image
                                isZoomed
                                alt={"Post image"}
                                className="object-cover rounded-xl"
                                src={post.media}
                                width={500}
                            />
                        </CardBody>
                        <Divider />
                        <p className="p-4">{post.content}</p>
                        <CardFooter className="flex gap-3">
                            <Button isIconOnly aria-label="Like" color="danger">
                                <HeartFilledIcon />
                            </Button>
                            <Button isIconOnly aria-label="Comments" color="danger">
                                <CommentsIcon />
                            </Button>
                            <Button isIconOnly aria-label="Share" color="danger">
                                <ShareIcon />
                            </Button>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                <Card className="w-[500px]  space-y-5 p-4" radius="lg">
                    <div className="max-w-[300px] w-full flex items-center gap-3">
                        <div>
                            <Skeleton className="flex rounded-full w-12 h-12" />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <Skeleton className="h-3 w-3/5 rounded-lg" />
                            <Skeleton className="h-3 w-4/5 rounded-lg" />
                        </div>
                    </div>
                    <Skeleton className="rounded-lg">
                        <div className="h-[300px] rounded-lg bg-default-300" />
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
            )}
        </div>
    );
};

export default Feed;
