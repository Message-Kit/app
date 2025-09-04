"use client";

import "./preview.css";
import { ButtonStyle, ComponentType, SeparatorSpacingSize } from "discord-api-types/v10";
import { nanoid } from "nanoid";
import { useOutputStore } from "@/lib/stores/output";

/** Helpers */
function clsButtonVariant(style?: ButtonStyle) {
    switch (style) {
        case ButtonStyle.Primary:
            return "dc-button dc-button--primary";
        case ButtonStyle.Secondary:
            return "dc-button dc-button--secondary";
        case ButtonStyle.Success:
            return "dc-button dc-button--success";
        case ButtonStyle.Danger:
            return "dc-button dc-button--danger";
        case ButtonStyle.Link:
            return "dc-button dc-button--link";
        default:
            return "dc-button dc-button--secondary";
    }
}

function formatBytes(bytes?: number) {
    if (!bytes || Number.isNaN(bytes)) return "";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    let n = bytes;
    while (n >= 1024 && i < units.length - 1) {
        n /= 1024;
        i++;
    }
    return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

/** Button renderer */
function ButtonNode(btn: any) {
    const className = clsButtonVariant(btn.style);
    const common = {
        key: btn.custom_id || btn.url || nanoid(8),
        className,
        disabled: !!btn.disabled,
        title: btn.tooltip || btn.label,
    } as any;

    if (btn.style === ButtonStyle.Link && btn.url) {
        return (
            <a href={btn.url} target="_blank" rel="noreferrer" className={className}>
                {btn.emoji?.name ? `${btn.emoji?.name} ` : ""}
                {btn.label}
            </a>
        );
    }
    return (
        <button {...common}>
            {btn.emoji?.name ? `${btn.emoji?.name} ` : ""}
            {btn.label}
        </button>
    );
}

/** Select renderer (string select) */
function StringSelectNode(select: any) {
    const id = select.custom_id || nanoid(8);
    return (
        <select id={id} className="dc-select" defaultValue="">
            <option value="" disabled>
                {select.placeholder || "Select..."}
            </option>
            {(select.options || []).map((opt: any) => (
                <option key={opt.value} value={opt.value} title={opt.description} disabled={!!opt.disabled}>
                    {(opt.emoji?.name ? `${opt.emoji.name} ` : "") + opt.label}
                </option>
            ))}
        </select>
    );
}

/** Accessory renderer for Section (button or thumbnail) */
function SectionAccessory(acc: any) {
    if (!acc) return null;
    if (acc.type === ComponentType.Button) return <div className="dc-section-accessory">{ButtonNode(acc)}</div>;
    if (acc.type === "Thumbnail" || acc.thumbnail || acc.url) {
        const src = acc.url ?? acc.thumbnail?.url;
        return (
            <div className="dc-section-accessory">
                {/* biome-ignore lint/performance/noImgElement: preview */}
                <img className="dc-section-thumbnail" src={src} alt="" />
            </div>
        );
    }
    return null;
}

/** Main component */
export default function Preview() {
    const { output } = useOutputStore();

    return (
        <div className="dc-message">
            {output.map((component: any) => {
                /* TEXT DISPLAY */
                if (component.type === ComponentType.TextDisplay) {
                    return (
                        <div className="dc-text" key={nanoid(10)}>
                            {component.content}
                        </div>
                    );
                }

                /* SEPARATOR */
                if (component.type === ComponentType.Separator) {
                    const space = component.spacing === SeparatorSpacingSize.Small ? 8 : 16;
                    return (
                        <div key={nanoid(10)} style={{ margin: `${space}px 0` }}>
                            {component.divider ? <hr className="dc-separator" /> : null}
                        </div>
                    );
                }

                /* MEDIA GALLERY */
                if (component.type === ComponentType.MediaGallery) {
                    const count = Math.max(1, Math.min(4, component.items?.length || 1));
                    const cols = count === 1 ? 1 : count === 2 ? 2 : count === 3 ? 3 : 2; // Discord-ish layout
                    return (
                        <div
                            key={nanoid(10)}
                            className="dc-media-gallery"
                            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
                        >
                            {(component.items || []).map((item: any) => (
                                <div className="dc-media-item" key={nanoid(10)}>
                                    {/* biome-ignore lint/performance/noImgElement: preview */}
                                    <img src={item.media?.url || item.url} alt="" />
                                </div>
                            ))}
                        </div>
                    );
                }

                /* SECTION (with optional accessory) */
                if (component.type === ComponentType.Section) {
                    return (
                        <div className="dc-section" key={nanoid(10)}>
                            <div className="dc-section-body">
                                {typeof component.content === "string" ? (
                                    <div className="dc-text">{component.content}</div>
                                ) : null}
                                {/* If the section also has child components, render them inline */}
                                {(component.components || []).map((child: any) => {
                                    if (child.type === ComponentType.Button) return ButtonNode(child);
                                    if (child.type === ComponentType.StringSelect) return StringSelectNode(child);
                                    if (child.type === ComponentType.TextDisplay)
                                        return (
                                            <div className="dc-text" key={nanoid(8)}>
                                                {child.content}
                                            </div>
                                        );
                                    return null;
                                })}
                            </div>
                            {SectionAccessory(component.accessory)}
                        </div>
                    );
                }

                /* ACTION ROW (buttons or one select) */
                if (component.type === ComponentType.ActionRow) {
                    return (
                        <div className="dc-action-row" key={nanoid(10)}>
                            {(component.components || []).map((child: any) => {
                                if (child.type === ComponentType.Button) return ButtonNode(child);
                                if (child.type === ComponentType.StringSelect) return StringSelectNode(child);
                                return null;
                            })}
                        </div>
                    );
                }

                /* FILE */
                if (component.type === ComponentType.File) {
                    const name = component.file?.name || component.filename || "file";
                    const size = component.file?.size ?? component.size;
                    const url = component.file?.url ?? component.url ?? "#";
                    const ext = (name.split(".").pop() || "").slice(0, 4).toUpperCase() || "FILE";
                    return (
                        <a className="dc-file" href={url} target="_blank" rel="noreferrer" key={nanoid(10)}>
                            <span className="dc-file-icon">{ext}</span>
                            <span className="dc-file-meta">
                                <span className="dc-file-name" title={name}>
                                    {name}
                                </span>
                                <span className="dc-file-size">{formatBytes(size)}</span>
                            </span>
                        </a>
                    );
                }

                /* CONTAINER (wraps inner components) */
                if (component.type === ComponentType.Container) {
                    return (
                        <div className="dc-container" key={nanoid(10)}>
                            {(component.components || component.items || []).map((child: any) => {
                                // Reuse the same rendering logic by faking a single-item output
                                return <PreviewFragment key={nanoid(10)} component={child} />;
                            })}
                        </div>
                    );
                }

                /* Button (in case top-level) */
                if (component.type === ComponentType.Button) {
                    return (
                        <div className="dc-action-row" key={nanoid(10)}>
                            {ButtonNode(component)}
                        </div>
                    );
                }

                /* Single select (in case top-level) */
                if (component.type === ComponentType.StringSelect) {
                    return (
                        <div className="dc-action-row" key={nanoid(10)}>
                            {StringSelectNode(component)}
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
}

/* Small helper to render nested children inside Container without recursion mess */
function PreviewFragment({ component }: { component: any }) {
    if (!component) return null;

    if (component.type === ComponentType.TextDisplay) {
        return <div className="dc-text">{component.content}</div>;
    }
    if (component.type === ComponentType.Separator) {
        const space = component.spacing === SeparatorSpacingSize.Small ? 8 : 16;
        return (
            <div style={{ margin: `${space}px 0` }}>{component.divider ? <hr className="dc-separator" /> : null}</div>
        );
    }
    if (component.type === ComponentType.MediaGallery) {
        const count = Math.max(1, Math.min(4, component.items?.length || 1));
        const cols = count === 1 ? 1 : count === 2 ? 2 : count === 3 ? 3 : 2;
        return (
            <div className="dc-media-gallery" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                {(component.items || []).map((item: any) => (
                    <div className="dc-media-item" key={nanoid(8)}>
                        {/* biome-ignore lint/performance/noImgElement: preview */}
                        <img src={item.media?.url || item.url} alt="" />
                    </div>
                ))}
            </div>
        );
    }
    if (component.type === ComponentType.Section) {
        return (
            <div className="dc-section">
                <div className="dc-section-body">
                    {typeof component.content === "string" ? <div className="dc-text">{component.content}</div> : null}
                    {(component.components || []).map((child: any) => {
                        if (child.type === ComponentType.Button) return ButtonNode(child);
                        if (child.type === ComponentType.StringSelect) return StringSelectNode(child);
                        if (child.type === ComponentType.TextDisplay)
                            return (
                                <div className="dc-text" key={nanoid(8)}>
                                    {child.content}
                                </div>
                            );
                        return null;
                    })}
                </div>
                {SectionAccessory(component.accessory)}
            </div>
        );
    }
    if (component.type === ComponentType.ActionRow) {
        return (
            <div className="dc-action-row">
                {(component.components || []).map((child: any) => {
                    if (child.type === ComponentType.Button) return ButtonNode(child);
                    if (child.type === ComponentType.StringSelect) return StringSelectNode(child);
                    return null;
                })}
            </div>
        );
    }
    if (component.type === ComponentType.File) {
        const name = component.file?.name || component.filename || "file";
        const size = component.file?.size ?? component.size;
        const url = component.file?.url ?? component.url ?? "#";
        const ext = (name.split(".").pop() || "").slice(0, 4).toUpperCase() || "FILE";
        return (
            <a className="dc-file" href={url} target="_blank" rel="noreferrer">
                <span className="dc-file-icon">{ext}</span>
                <span className="dc-file-meta">
                    <span className="dc-file-name" title={name}>
                        {name}
                    </span>
                    <span className="dc-file-size">{formatBytes(size)}</span>
                </span>
            </a>
        );
    }
    if (component.type === ComponentType.Container) {
        return (
            <div className="dc-container">
                {(component.components || component.items || []).map((child: any) => (
                    <PreviewFragment key={nanoid(8)} component={child} />
                ))}
            </div>
        );
    }
    if (component.type === ComponentType.Button) return ButtonNode(component);
    if (component.type === ComponentType.StringSelect) return StringSelectNode(component);
    return null;
}
