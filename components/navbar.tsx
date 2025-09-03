"use client";

import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Fragment } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Navbar() {
    const pathname = usePathname();
    const params = useParams();

    return (
        <div className="min-h-16 max-h-16 bg-card w-full px-6 flex items-center z-10">
            <Breadcrumb>
                <BreadcrumbList>
                    {pathname
                        .split("/")
                        .slice(1)
                        .map((item, i, arr) => (
                            <Fragment key={item}>
                                <BreadcrumbItem>
                                    {i === 0 ? (
                                        pathname.endsWith(pathname.split("/")[1]) ? (
                                            <BreadcrumbPage className="text-base font-display font-semibold">
                                                Home
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link href={`/${params.guild}`}>
                                                    <HomeIcon size={16} />
                                                </Link>
                                            </BreadcrumbLink>
                                        )
                                    ) : i === arr.length - 1 ? (
                                        <BreadcrumbPage className="text-base font-display font-semibold">
                                            {item.slice(0, 1).toUpperCase() + item.slice(1).toLowerCase()}
                                        </BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink asChild>
                                            <Link href={`/${params.guild}/${item}`}>
                                                {item.slice(0, 1).toUpperCase() + item.slice(1).toLowerCase()}
                                            </Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {i < arr.length - 1 && <BreadcrumbSeparator />}
                            </Fragment>
                        ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
}
