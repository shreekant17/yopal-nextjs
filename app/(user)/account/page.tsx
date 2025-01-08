"use client";

import React, { FormEvent, useEffect, useState } from "react";
import {
    Card,
    Button,
    Form,
    Input,
    Select,
    SelectItem,
    Checkbox,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Link,
    Avatar,
    Image
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { SessionUser } from "@/types/index";
import { link } from "fs";
import { toast } from 'react-toastify';

export default function App() {
    const [userData, setUserData] = useState({
        fname: "",
        lname: "",
        email: "",
        password: "",
        country: "",
    });

    const [imagePreview, setImagePreview] = React.useState<string>("/icon.png");

    const { data: session, status } = useSession();

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (session) {

                const { id } = session.user as SessionUser;

                try {
                    const userInfo = await getUserinfo(id); // Await the result of getUserinfo
                    if (userInfo) {
                        const { fname, lname, email, avatar, country } = userInfo as SessionUser;

                        setUserData((prevData) => ({
                            ...prevData,
                            fname: fname || prevData.fname,
                            lname: lname || prevData.lname,
                            email: email || prevData.email,
                            country: country || prevData.country,

                        }));
                    }
                } catch (error) {
                    console.error("Failed to fetch user info:", error);
                }
            }
        };

        fetchUserInfo(); // Call the async function
    }, [session]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files ? e.target.files[0] : null;

        if (file) {
            // Create a preview URL for the selected file
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string); // Set the image preview URL
                console.log(imagePreview)
            };
            reader.readAsDataURL(file); // Read the file as data URL

        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const { jwtToken } = session?.user as SessionUser;

        if (jwtToken) {
            console.log(jwtToken)
            formData.append("token", jwtToken);
        }
        const { id } = session?.user as SessionUser;
        formData.append("id", id)


        try {
            const res = await fetch("/api/update", {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                toast.success("Account Updated successfully!");
            } else {
                const error = await res.json();
                toast.error(error.Message);
            }
        } catch (error) {
            //console.error("Upload error:", error);
            toast.error("Something Went Wrong");
        }


        console.log(formData)
    };

    const getUserinfo = async (id: string) => {
        try {
            const response = await fetch("api/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: id }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);
                return result.account;
            } else {
                const result = await response.json();
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex justify-center items-center w-full">
            <Card className="lg:w-1/2">
                <Form className="p-2 w-full space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
                    <CardHeader className="flex gap-3 justify-between px-12">
                        <div className="profile flex items-center gap-x-4">
                            <div className="avatar flex-col justify-center">
                                <label htmlFor="file-input" className="cursor-pointer">


                                    <Avatar
                                        className="lg:w-32 lg:h-32 w-24 h-24 text-large"
                                        src={imagePreview}
                                    />
                                </label>
                                <Input
                                    id="file-input"
                                    type="file"
                                    name="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className="flex flex-col">
                                <p className="text-md">NextUI</p>
                                <p className="text-small text-default-500">nextui.org</p>
                            </div>
                        </div>
                        <Button size="md"
                            color="danger"
                            as={Link}

                        >
                            Logout
                        </Button>
                    </CardHeader>
                    <Divider />
                    <CardBody>

                        <div className="flex flex-col gap-6 w-full">
                            <Input
                                isRequired
                                label="Firstname"
                                name="fname"
                                value={userData.fname}
                                onChange={handleChange}
                            />
                            <Input
                                isRequired
                                label="Lastname"
                                name="lname"
                                value={userData.lname}
                                onChange={handleChange}
                            />
                            <Input
                                isRequired
                                errorMessage={({ validationDetails }) =>
                                    validationDetails.valueMissing
                                        ? "Please enter your email"
                                        : "Please enter a valid email address"
                                }
                                label="Email"
                                name="email"
                                type="email"
                                value={userData.email}
                                onChange={handleChange}
                            />
                            <Input
                                isRequired
                                isDisabled
                                label="Password"
                                name="password"
                                type="password"
                                value={userData.password}
                                onChange={handleChange}
                            />
                            <Select isRequired label="Country" name="country">
                                <SelectItem value="ar">Argentina</SelectItem>
                                <SelectItem value="au">Australia</SelectItem>
                                <SelectItem value="ca">Canada</SelectItem>
                                <SelectItem value="in">India</SelectItem>
                                <SelectItem value="us">United States</SelectItem>
                                <SelectItem value="uk">United Kingdom</SelectItem>
                            </Select>

                            <Button
                                className="w-full bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg hover:shadow-xl"
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>

                    </CardBody>
                    <Divider />

                    <CardFooter>
                        <Link
                            isExternal
                            showAnchorIcon
                            href=""
                        >
                            Update at your own risk
                        </Link>
                    </CardFooter>
                </Form>
            </Card>
        </div >
    );
}
