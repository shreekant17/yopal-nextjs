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

import { toast } from "react-toastify";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/register";

export default function App() {
    const [password, setPassword] = React.useState("");
    const [submitted, setSubmitted] = React.useState(null);
    const [errors, setErrors] = React.useState({});
    const router = useRouter();

    // Password validation
    const getPasswordError = (value) => {
        if (value.length < 4 && value.length > 1) {
            return "Password must be at least 4 characters long";
        }
        return null;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));

        // Custom validation
        const newErrors = {};
        if (data.name === "admin") {
            newErrors.name = "Choose a different username";
        }

        const passwordError = getPasswordError(data.password);
        if (passwordError) {
            newErrors.password = passwordError;
        }

        if (data.terms !== "true") {
            newErrors.terms = "You must accept the terms to continue";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Clear errors and proceed with submission
        setErrors({});
        setSubmitted(data);

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success("Account created successfully");
                router.push("/login");
            } else {
                const result = await response.json();
                toast.error(result.message);
            }
        } catch (error) {
            //console.error("Error:", error);
            toast.error("Error creating account");
        }
    };

    return (
        <div className="flex justify-center items-center w-full">
            <Card className="w-full max-w-lg p-6 shadow-2xl">
                <CardHeader className="flex gap-3 items-center">
                    <Image
                        alt="NextUI logo"
                        height={40}
                        radius="sm"
                        src="./icon.png"
                        width={40}
                    />
                    <div className="flex flex-col">
                        <p className="text-lg font-bold">Yo!Pal</p>
                        <p className="text-sm text-gray-500">yo-pal.in</p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Form
                        className="p-2 w-full space-y-6"
                        onSubmit={onSubmit}
                    >
                        <div className="flex flex-col gap-6 w-full">
                            <Input
                                isRequired
                                errorMessage={({ validationDetails }) =>
                                    validationDetails.valueMissing
                                        ? "Please enter your name"
                                        : errors.name
                                }
                                label="Name"
                                name="name"

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
                            />

                            <Input
                                isRequired
                                errorMessage={getPasswordError(password)}
                                isInvalid={!!getPasswordError(password)}
                                label="Password"
                                name="password"

                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <Select
                                isRequired
                                label="Country"
                                name="country"

                            >
                                <SelectItem value="ar">Argentina</SelectItem>
                                <SelectItem value="au">Australia</SelectItem>
                                <SelectItem value="ca">Canada</SelectItem>
                                <SelectItem value="in">India</SelectItem>
                                <SelectItem value="us">United States</SelectItem>
                                <SelectItem value="uk">United Kingdom</SelectItem>
                            </Select>

                            <Checkbox
                                isRequired
                                isInvalid={!!errors.terms}
                                name="terms"
                                value="true"
                                onChange={() =>
                                    setErrors((prev) => ({
                                        ...prev,
                                        terms: undefined,
                                    }))
                                }
                            >
                                I agree to the terms and conditions
                            </Checkbox>

                            {errors.terms && (
                                <span className="text-red-500 text-sm">
                                    {errors.terms}
                                </span>
                            )}

                            <Button
                                className="w-full bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg hover:shadow-xl"
                                type="submit"
                            >
                                Register
                            </Button>
                        </div>

                        {submitted && (
                            <div className="text-sm text-gray-600 mt-4">
                                Submitted data:{" "}
                                <pre>{JSON.stringify(submitted, null, 2)}</pre>
                            </div>
                        )}
                    </Form>
                </CardBody>
                <Divider />
                <CardFooter>
                    <Link isExternal href="#">
                        Caution! Site Under Construction
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
