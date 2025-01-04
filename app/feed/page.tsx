"use client";
import React, { useEffect } from "react";
import { Button, Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, User } from "@nextui-org/react";
import { HeartFilledIcon } from "@/components/icons";
import { HeartIcon } from "@/components/HeartIcon";
import { ShareIcon } from "@/components/ShareIcon";
import { CommentsIcon } from "@/components/CommentsIcon";

const Feed = () => {
    const [posts, setPosts] = React.useState([]);

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
                                src={"posts/" + post.media}
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
                <p>No posts available.</p>
            )}
        </div>
    );
};

export default Feed;
