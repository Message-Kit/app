import { ExternalLink, HandHelping, Users, Zap } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
}

interface Hero45Props {
    badge?: string;
    heading: string;
    description: string;
    imageSrc?: string;
    imageAlt?: string;
    features?: Feature[];
}

const Hero = ({
    badge = "Add Message Kit",
    heading,
    description,
    imageSrc = "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    imageAlt = "placeholder",
    features = [
        {
            icon: <HandHelping className="h-auto w-5" />,
            title: "Flexible Support",
            description: "Benefit from around-the-clock assistance to keep your business running smoothly.",
        },
        {
            icon: <Users className="h-auto w-5" />,
            title: "Collaborative Tools",
            description: "Enhance teamwork with tools designed to simplify project management and communication.",
        },
        {
            icon: <Zap className="h-auto w-5" />,
            title: "Lightning Fast Speed",
            description: "Experience the fastest load times with our high performance servers.",
        },
    ],
}: Hero45Props) => {
    return (
        <section className="py-32">
            <div className="container overflow-hidden">
                <div className="mb-20 flex flex-col items-center gap-6 text-center">
                    <Badge variant="outline" className="border-primary" asChild>
                        <Link href="">
                            <ExternalLink />
                            {badge}
                        </Link>
                    </Badge>
                    <h1 className="text-4xl font-semibold lg:text-5xl font-display">{heading}</h1>
                    <p className="text-muted-foreground -mt-2">{description}</p>
                </div>
                <div className="relative mx-auto max-w-5xl">
                    <Image
                        width={1920}
                        height={1080}
                        src={imageSrc}
                        alt={imageAlt}
                        className="aspect-video border-8 border-secondary max-h-full w-full rounded-xl object-top object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent"></div>
                    <div className="absolute -top-28 -right-28 -z-10 aspect-video h-72 w-96 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)] [background-size:12px_12px] opacity-40 sm:bg-[radial-gradient(hsl(var(--muted-foreground))_1px,transparent_1px)]"></div>
                    <div className="absolute -top-28 -left-28 -z-10 aspect-video h-72 w-96 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)] [background-size:12px_12px] opacity-40 sm:bg-[radial-gradient(hsl(var(--muted-foreground))_1px,transparent_1px)]"></div>
                </div>
                <div className="mx-auto mt-16 flex max-w-5xl flex-col md:flex-row">
                    {features.map((feature, index) => (
                        <React.Fragment key={feature.title}>
                            {index > 0 && (
                                <Separator
                                    orientation="vertical"
                                    className="mx-6 hidden h-auto w-[2px] bg-linear-to-b from-muted via-transparent to-muted md:block"
                                />
                            )}
                            <div key={index} className="flex grow basis-0 flex-col rounded-md bg-background p-4">
                                <div className="mb-6 flex size-10 items-center justify-center rounded-full bg-background drop-shadow-lg">
                                    {feature.icon}
                                </div>
                                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
};

export { Hero };
