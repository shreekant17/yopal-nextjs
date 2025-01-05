import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { verifyToken } from "@/libs/jwt";
import Post from "@/models/postSchema";
import connectMongoDB from "@/libs/db";

// Configure Cloudinary
cloudinary.config({
    cloud_name: "dr28ndjfw",
    api_key: "356566361623378",
    api_secret: "f_l29kvSrVh5sEFJ-s9dZIaK6OU",
    secure: true,

});


export const POST = async (req) => {

    const data = await req.formData();
    const image = await data.get("file");
    const fileBuffer = await image.arrayBuffer();

    var mime = image.type;
    var encoding = 'base64';
    var base64Data = Buffer.from(fileBuffer).toString('base64');
    var fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

    try {

        const uploadToCloudinary = () => {
            return new Promise((resolve, reject) => {

                var result = cloudinary.uploader.upload(fileUri, {
                    invalidate: true
                })
                    .then((result) => {
                        console.log(result);
                        resolve(result);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                    });
            });
        };

        const result = await uploadToCloudinary();

        let imageUrl = result.secure_url;

        return NextResponse.json(
            { success: true, imageUrl: imageUrl },
            { status: 200 }
        );
    } catch (error) {
        console.log("server err", error);
        return NextResponse.json({ err: "Internal Server Error" }, { status: 500 });
    }
};
