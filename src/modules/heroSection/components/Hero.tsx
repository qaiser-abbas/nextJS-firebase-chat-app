import { HeroSectionType } from "@/src/types/type";
import Image from "next/image";
import Link from "next/link";

export default function Hero({
    title,
    subtitle,
    imageUrl,
    buttonText,
    buttonLink,
}: HeroSectionType) {
    return (
        <section className="bg-purple-800 text-white py-16 relative overflow-hidden">
            {/* Decorative background (optional) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-700 via-purple-800 to-purple-900 opacity-30 z-0"></div>

            <div className="relative z-10 container mx-auto flex flex-col-reverse md:flex-row items-center justify-between ">
                {/* Left Content */}
                <div className="w-full md:w-1/2 text-center md:text-left flex flex-col gap-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        {title}
                    </h1>
                    <p className="text-xl mb-6">{subtitle}</p>
                    <Link
                        href={buttonLink}
                        className="inline-block w-[200px] bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded transition"
                    >
                        {buttonText}
                    </Link>
                </div>

                {/* Right Image */}
                <div className="w-full md:w-1/2 mb-8 md:mb-0">
                    <Image
                        src="/banner-img.png"
                        alt="App Showcase"
                        width={600}
                        height={400}
                        className="mx-auto drop-shadow-xl"
                    />
                </div>
            </div>
        </section>
    );
}
