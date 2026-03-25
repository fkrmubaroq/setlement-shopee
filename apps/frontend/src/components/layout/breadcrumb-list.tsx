import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

type HeaderTextItem = {
    text: string;
    href: string;
};
const headerText: Record<string, HeaderTextItem[]> = {
    "/admin/articles/create": [
        {
            text: "Article",
            href: "/admin/articles",
        },
        {
            text: "Create",
            href: "#",
        }
    ],
};
export default function BreadcrumbList() {
    const location = useLocation();
    const pathname = location.pathname;
    return (
        <div className="flex items-center gap-2">
            {headerText[pathname]?.map((item, index) => {
                const isLast = index === headerText[pathname].length - 1;
                return (
                    <div key={item.text} className="flex items-center gap-2">
                        {isLast ? <TextItem item={item} /> : <LinkItem item={item} />}
                        {index < headerText[pathname].length - 1 && (
                            <ChevronRight
                                className="size-3"
                                color="var(--muted-foreground)"
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function LinkItem({ item }: { item: HeaderTextItem }) {
    return (
        <Link to={item.href} className="text-sm">
            {item.text}
        </Link>
    );
}

function TextItem({ item }: { item: HeaderTextItem }) {
    return <div className="text-sm text-muted-foreground">{item.text}</div>;
}
