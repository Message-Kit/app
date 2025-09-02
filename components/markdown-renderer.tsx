import type { Root, Text } from "mdast";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import rehypeReact from "rehype-react";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { UserMention } from "./message-preview-components";

export function MarkdownRenderer({ content }: { content: string }) {
    const processor = unified()
        .use(remarkParse)
        // custom plugin to turn <@123> into an AST element
        .use(() => (tree: Root) => {
            visit(tree, "text", (node: Text, index, parent: any) => {
                if (!parent || typeof node.value !== "string") return;

                const parts = node.value.split(/(<@\d+>)/g);
                if (parts.length === 1) return;

                const newNodes = parts.map((part) => {
                    const match = part.match(/^<@(\d+)>$/);
                    if (match) {
                        return {
                            type: "element",
                            tagName: "usermention",
                            properties: { id: match[1] },
                            children: [],
                        };
                    }
                    return { type: "text", value: part };
                });

                parent.children.splice(index!, 1, ...newNodes);
            });
        })
        .use(remarkRehype)
        .use(rehypeReact, {
            Fragment,
            jsx,
            jsxs,
            components: {
                usermention: UserMention, // 👈 map lowercase tag to React component
            },
        });

    const rendered = processor.processSync(content).result;
    return <>{rendered}</>;
}
