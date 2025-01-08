import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/userSchema";
import connectMongoDB from "@/libs/db";
import { cookies } from "next/headers";
import { generateToken } from "@/libs/jwt";
import bcrypt from "bcrypt";

const authOptions = {
    providers: [
        // Credentials Provider
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { email, password, remember } = credentials;

                // Perform your user validation logic
                await connectMongoDB();
                const user = await User.findOne({ email });

                const isMatch = await bcrypt.compare(password, user.password);

                if (user && email === user.email && isMatch) {
                    const userId = user._id.toString();
                    const jwtToken = generateToken({ userId, password, email, name: user.name });
                    if (remember) {
                        const cookieStore = await cookies();
                        cookieStore.set("token", jwtToken);
                    }

                    return { ...user.toObject(), userId, jwtToken };
                }
                return null;
            },
        }),

        // Google Provider
        /*
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        */
    ],
    session: {
        strategy: "jwt", // Use JWT strategy for session
    },
    callbacks: {
        async jwt({ token, account, user }) {
            // Persist the user ID and JWT token to the token after signin
            if (account) {
                token.accessToken = account.access_token;
            }

            // For CredentialsProvider, store user data in the JWT token
            if (user) {
                token.userId = user.userId; // Store the userId in the token
                token.jwtToken = user.jwtToken; // Store the JWT token in the token
            }
            return token;
        },
        async session({ session, token }) {
            // Add token info (userId, jwtToken) to the session
            session.user.id = token.userId;
            session.user.jwtToken = token.jwtToken;

            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
