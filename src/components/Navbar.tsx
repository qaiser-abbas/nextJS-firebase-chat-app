"use client";
import Link from "next/link";
import { Api } from "../services/service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
    const router = useRouter();
    const [userName, setUserName] = useState<string | null>(null);
    console.log("userName", userName);


    const handleLogout = async () => {
        try {
            await Api.auth.logoutUser();

            // ✅ Option A: reload to force all states to refresh
            window.location.href = "/login";

            // OR ✅ Option B: manually redirect and refresh Sidebar logic
            // router.push("/login");
            // setUsers([]); // or force a getAllUsers call
        } catch (err) {
            console.error("Logout failed", err);
        }
    };




    // get user name
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const user = await Api.auth.getCurrentUserData();
                if (user?.name) setUserName(user.name);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
            }
        };
        fetchUserName();
    }, []);


    return (
        <nav className="bg-white shadow-md text-black px-6 py-4 z-50 relative">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="text-2xl font-bold">Developer<span className="text-red-500">.</span></div>
                <div className="flex items-center space-x-8">
                    <div className="space-x-6 hidden md:flex">
                        <Link href="/" className="hover:underline">Home</Link>
                        {/* <Link href="#" className="hover:underline">Pages</Link>
                        <Link href="#" className="hover:underline">Blog</Link>
                        <Link href="#" className="hover:underline">Portfolio</Link> */}
                        <Link href="/chat" className="hover:underline">Chat</Link>
                        <Link href="/login" className="hover:underline">
                            Login
                        </Link>
                        <button onClick={handleLogout} className="hover:underline">
                            Logout
                        </button>

                    </div>
                    {userName && (
                        <div className="bg-white text-purple-800 px-3 py-1 rounded-md font-semibold">
                            {userName}
                        </div>
                    )}
                    {/* <div className="relative">

                        <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 21h6"></path>
                        </svg>
                    </div> */}
                </div>
            </div>
        </nav>
    );
}
