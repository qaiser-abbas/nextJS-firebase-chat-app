"use client";

import { useState } from "react";
import Link from "next/link";
import { Api } from "@/src/services/service";
import { useRouter } from "next/navigation";


export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // const handleLogin = async (e: React.FormEvent) => {
    //     e.preventDefault();

    //     if (!email || !password) {
    //         setErrorMsg("Email and password are required.");
    //         return;
    //     }

    //     try {
    //         await Api.auth.loginUser(email, password);
    //         setErrorMsg("");
    //         alert("Login successful!");
    //     } catch (error: any) {
    //         setErrorMsg(error.message);
    //     }
    // };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setErrorMsg("Email and password are required.");
            return;
        }

        try {
            // 1. Login the user
            await Api.auth.loginUser(email, password);

            // 2. Get current user data
            const user = await Api.auth.getCurrentUserData();

            // 3. Save FCM token to Firestore
            if (user?.id) {
                await Api.PushNoti.saveTokenInUserDoc(user.id);
            }
            console.log("User data:", user);

            setErrorMsg("");
            alert("Login successful!");
            // ✅ Navigate to home page
            router.push("/");
        } catch (error: any) {
            setErrorMsg(error.message);
        }
    };

    return (
        <section className="min-h-screen bg-purple-800 flex items-center justify-center px-4">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full h-[400px]">
                <h2 className="text-2xl font-bold mb-6 text-center text-purple-800">
                    Sign In to Your Account
                </h2>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    {errorMsg && (
                        <p className="text-red-500 text-sm text-center">{errorMsg}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full cursor-pointer bg-purple-800 hover:bg-purple-900 text-white py-2 mt-4 rounded transition"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-purple-600 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </section>
    );
}
