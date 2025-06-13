import { FeatureItem } from "@/src/types/type";
import Image from "next/image";

export default function FeatureCard({ icon, title, description }: FeatureItem) {
    return (
        <div className="bg-white shadow-md border rounded-lg p-6 text-center transition hover:shadow-xl">
            <div className="flex justify-center mb-4">
                <Image src={icon} alt={title} width={80} height={80} />
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    );
}
