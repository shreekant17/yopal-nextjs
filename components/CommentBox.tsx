"use client";

import React, { FormEvent, useEffect, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Form,
    Input,
    User,
    ScrollShadow,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { SendIcon } from "@/components/SendIcon";

// Typing for the props passed to the UploadPost component
type CommentProps = {
    isOpen: boolean;
    onClose: () => void;
    postId: string;
};

type CommentType = {
    comments: { _id: string; text: string, createdAt: string }
    userDetails: { avatar: string; fname: string };

};

interface SessionUser {
    id: string;
    name?: string;
    jwtToken: string;
}

const CommentBox = ({ isOpen, onClose, postId }: CommentProps) => {
    const size = "5xl";

    // Typing the state variables
    const [comments, setComments] = useState<CommentType[]>([]); // State for comments
    const [token, setToken] = useState<string>("");
    const { data: session } = useSession();

    const getComments = async () => {
        try {
            const response = await fetch("/api/getComments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postId }),
            });

            if (response.ok) {
                const result = await response.json();

                setComments(result.comments || []);
            } else {
                const error = await response.json();
                console.error(error);
                //setComments([])
                // toast.error("Failed to fetch comments.");
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
            toast.error("Something went wrong.");
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (token) {
            formData.append("token", token);
            formData.append("postId", postId);
        }

        try {
            const res = await fetch("/api/comment", {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                toast.success("Comment added successfully!");
                // Refresh comments
                getComments();
            } else {
                const error = await res.json();
                toast.error(error);
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Failed to add comment.");
        }
    };

    useEffect(() => {
        if (session) {
            const token = (session.user as SessionUser)?.jwtToken || "";
            setToken(token);
        }
    }, [session]);

    useEffect(() => {
        if (isOpen && postId) {
            getComments(); // Fetch comments when the modal is opened
        }
    }, [isOpen, postId]);

    return (
        <div>
            <Modal isOpen={isOpen} size={size} onClose={onClose}>
                <ModalContent>
                    <>
                        <ModalHeader className="flex justify-start flex-col gap-1">Comments</ModalHeader>
                        <ScrollShadow hideScrollBar className="w-full h-[60vh] overflow-auto">
                            <ModalBody className="h-full flex flex-col gap-4">
                                {comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <div className="comment bg-default p-2 rounded-lg" key={comment.comments._id}>
                                            <div className="top flex justify-between items-center">
                                                <User
                                                    avatarProps={{ src: comment.userDetails?.avatar || "" }}
                                                    description="Commenter"
                                                    name={comment.userDetails?.fname || "Anonymous"}
                                                />
                                                <p className="text-xs text-gray-500">{comment.comments.createdAt}</p>
                                            </div>
                                            <p className="mt-2">{comment.comments.text || "No content"}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center">No comments yet.</p>
                                )}
                            </ModalBody>
                        </ScrollShadow>
                        <Form className=" p-4 w-full space-y-4" onSubmit={handleSubmit}>
                            <Input
                                isRequired
                                className="w-full"
                                label="Write a comment..."
                                name="commentText"
                                type="text"
                                endContent={
                                    <Button isIconOnly radius="full" color="danger" type="submit">
                                        <SendIcon />
                                    </Button>
                                }
                            />
                        </Form>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default CommentBox;
