import { Compare } from "@/components/compare";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/landing-navbar";
import { Separator } from "@/components/ui/separator";
import { Component, MessageSquare, Send } from "lucide-react";

function Yes({ children }: { children: React.ReactNode }) {
    return <div className="mx-auto px-6 md:px-8 max-w-6xl lg:border-x border-dashed">{children}</div>;
}

export default function Page() {
    return (
        <>
            <Yes>
                <Navbar />
            </Yes>
            <Separator className="border-dashed" />
            <Yes>
                <Hero
                    heading="Create Beautiful Messages"
                    description="Message Kit is the easiest way to personalize your Discord server with rich and interactive messages."
                    features={[
                        {
                            icon: <MessageSquare />,
                            title: "Message Builder",
                            description: "Create rich Discord messages with buttons, selects, and containers.",
                        },
                        {
                            icon: <Component />,
                            title: "Components v2",
                            description: "Take full control over the layout and design of your messages.",
                        },
                        {
                            icon: <Send />,
                            title: "Instant Send",
                            description: "Choose a channel and send your message instantly.",
                        },
                    ]}
                    imageSrc="/hero.png"
                />
            </Yes>
            <Separator className="border-dashed" />
            <Yes>
                <Compare />
            </Yes>
            <Separator className="border-dashed" />
            <Yes>
                <Footer />
            </Yes>
        </>
    );
}
