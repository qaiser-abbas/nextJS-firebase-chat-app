"use client";

import { useState } from "react";
import Link from "next/link";
import { Api } from "@/src/services/service";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await Api.auth.registerUser(email, password, name);
            alert("Registration successful!");
            // Redirect to login page
            window.location.href = "/login";
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <section className="min-h-screen bg-purple-800 flex items-center justify-center px-4">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full ">
                <h2 className="text-2xl font-bold mb-6 text-center text-purple-800">
                    Create a New Account
                </h2>

                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
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

                    <button
                        type="submit"
                        className="w-full cursor-pointer bg-purple-800 hover:bg-purple-900 text-white py-2 rounded transition mt-4"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link href="/login" className="text-purple-600 hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </section>
    );
}
