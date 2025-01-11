import mongoose from "mongoose";


const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME
        })
    } catch (err) {
        console.log(err);
    }

}

export default connectMongoDB
