import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { verifyToken } from "@/libs/jwt";
import Post from "@/models/postSchema";
import connectMongoDB from "@/libs/db";
export const POST = async (req) => {

    const formData = await req.formData();

    const file = formData.get("file");
    if (!file) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replaceAll(" ", "_");
    console.log(filename);
    try {
        await writeFile(
            path.join(process.cwd(), "/tmp/" + filename),
            buffer
        );
        console.log(formData.get('token'));
        const token = formData.get('token');
        if (token) {
            const user = verifyToken(token);
            console.log(user);
            const email = user.email;
            const content = formData.get('content');
            const type = formData.get('type');
            const media = filename;

            const post = {
                email: email,
                content: content,
                type: type,
                media: media,
            }
            //await connectMongoDB();
            //await Post.create(post);
        }
        return NextResponse.json({ Message: "Success", status: 201 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }


};
