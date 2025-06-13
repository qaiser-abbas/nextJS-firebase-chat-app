import { FeatureItem } from "@/src/types/type";
import FeatureCard from "../components/FeatureCard";

const features: FeatureItem[] = [
    {
        icon: "/images/cloud.png",
        title: "Cloud Compatibility",
        description:
            "On the other hand we denounce with righteous indignation and dislike men beguiled.",
    },
    {
        icon: "/images/security.png",
        title: "Security Certified",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    },
    {
        icon: "/images/rocket.png",
        title: "On-Time Delivery",
        description:
            "On the other hand we denounce with righteous indignation and dislike men beguiled.",
    },
];

export default function FeaturesContainer() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">Our Application Features</h2>
                <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
                    On the other hand we denounce with righteous indignation and dislike men who are so beguiled
                    and demoralized by the charms of pleasure of the moment so blinded by desire that they cannot
                    foresee the pain.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <FeatureCard key={idx} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}
