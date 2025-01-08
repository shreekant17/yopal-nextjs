"use client";

import React from "react";
import {
    Form,
    Input,
    Select,
    SelectItem,
    Checkbox,
    Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Link,
    Image,
} from "@nextui-org/react";

import { toast } from 'react-toastify';
import { signIn } from "next-auth/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";


export default function App() {
    const [password, setPassword] = React.useState("");
    const [submitted, setSubmitted] = React.useState<{ [key: string]: string | File } | null>(null);
    const [errors, setErrors] = React.useState({});
    const router = useRouter();
    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    // Real-time password validation
    const getPasswordError = (value: string): string | undefined => {
        if (value.length < 4 && value.length > 1) {
            return "Must be 4 characters or more";
        }
        return undefined;
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: { [key: string]: string | File } = {};

        // Convert FormData to a plain object
        formData.forEach((value, key) => {
            data[key] = value; // value is either string or File
        });

        //console.log("Form Data Submitted:", data);

        // Custom validation checks
        const newErrors: { [key: string]: string } = {};

        // Ensure password is treated as a string
        const password = data.password as string;
        const passwordError = getPasswordError(password);

        if (passwordError) {
            newErrors.password = passwordError;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Clear errors and proceed with submission
        setErrors({});
        setSubmitted(data);

        /*
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                toast.success("Login Successful");
                localStorage.setItem("token", `Bearer ${result.token}`);
                localStorage.setItem("userId", result.userId);

                router.push("/feed");
            } else {
                const result = await response.json();
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something Went Wrong");
        }
        */
        try {
            const email = data.email;
            const password = data.password;
            const remember = data.remember;
            const result = await signIn("credentials", {
                email,
                password,
                remember,
                redirect: false, // Prevent automatic redirect
            });

            if (result?.error) {
                toast.error(result.error); // Handle error if authentication fails
            } else {
                // Redirect to a secure page (e.g., dashboard) on success

                toast.success("Login Successfull");
                router.push("/feed");

            }

        } catch (err) {

        }
    };


    return (
        <div className="flex justify-center items-center w-full">
            <Card className="w-full max-w-sm p-6 shadow-2xl">
                <CardHeader className="flex gap-3">
                    <Image
                        alt="nextui logo"
                        height={40}
                        radius="sm"
                        src="./icon.png"
                        width={40}
                    />
                    <div className="flex flex-col">
                        <p className="text-md font-bold">Yo!Pal</p>
                        <p className="text-small text-default-500">yo-pal.in</p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Form
                        encType="multipart/form-data"
                        className="p-4 w-full space-y-6"
                        validationBehavior="native"
                        validationErrors={errors}
                        onReset={() => setSubmitted(null)}
                        onSubmit={onSubmit}
                    >
                        <div className="flex flex-col gap-6 w-full">
                            <Input
                                isRequired
                                className="w-full" // Ensure the input field takes the full width
                                errorMessage={({ validationDetails }) => {
                                    if (validationDetails.valueMissing) {
                                        return "Please enter your email";
                                    }
                                    if (validationDetails.typeMismatch) {
                                        return "Please enter a valid email address";
                                    }
                                }}
                                label="Email"
                                name="email"
                                type="email"
                            />
                            <Input
                                isRequired
                                className="w-full flex align-center" // Ensure the input field takes the full width
                                errorMessage={getPasswordError(password)}
                                isInvalid={!!getPasswordError(password)}
                                label="Password"
                                name="password"
                                type={isVisible ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                endContent={
                                    <Button
                                        aria-label="toggle password visibility"
                                        className="focus:outline-none"
                                        isIconOnly
                                        type="button"
                                        radius="full"
                                        variant="ghost"
                                        style={{
                                            background: "none",
                                            boxShadow: "none",
                                            border: "none", // Removes the border
                                        }}
                                        onPress={toggleVisibility}
                                    >
                                        {isVisible ? (
                                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        ) : (
                                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        )}
                                    </Button>
                                }
                            />
                            <Checkbox
                                isRequired
                                className="text-small"
                                name="remember"
                                validationBehavior="aria"
                                value="true"
                            >
                                Remember me
                            </Checkbox>
                            <div className="flex">
                                <Button
                                    className="w-full bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                                    type="submit"
                                    radius="full"
                                >
                                    Login
                                </Button>
                            </div>
                        </div>

                    </Form>
                </CardBody>
                <Divider />
                <CardFooter>
                    <Link showAnchorIcon href="#">
                        Caution! Site Under Construction
                    </Link>
                </CardFooter>
            </Card>
        </div>

    );
}
