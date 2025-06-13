
import type { ReactNode } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";

interface Props {
    children: ReactNode;
}

export default function CommonLayout({ children }: Props) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Navbar />
            <main className="flex-grow py-0">{children}</main>
            <Footer />
        </div>
    );
}
