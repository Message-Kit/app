import type { APIMediaGalleryComponent, APIMediaGalleryItem } from "discord-api-types/v10";
import {
    EyeClosedIcon,
    EyeIcon,
    FileWarningIcon,
    ImageIcon,
    ImagePlusIcon,
    LinkIcon,
    UploadIcon,
    XIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { motionProps } from "@/lib/motion-props";
import { useFiles } from "@/lib/stores/files";
import { cn, sanitizeFileName } from "@/lib/utils";
import NewBuilder from "../new-builder";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";

export default function MediaGallery({
    onMoveUp,
    onMoveDown,
    onRemove,
    images,
    setImages,
    component,
}: {
    onMoveUp: () => void;
    onMoveDown: () => void;
    onRemove: () => void;
    images: APIMediaGalleryItem[];
    setImages: (images: APIMediaGalleryItem[]) => void;
    component: APIMediaGalleryComponent;
}) {
    const isAtLimit = images.length >= 10;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const reuploadFileInputRef = useRef<HTMLInputElement>(null);

    const [tab, setTab] = useState<"link" | "upload">("link");
    const [linkUrl, setLinkUrl] = useState("");
    const [linkDescription, setLinkDescription] = useState("");

    const { files, setFiles } = useFiles();

    const handleFileUpload = () => {
        const newFiles = fileInputRef.current?.files;
        if (!newFiles) return;

        if (newFiles.length >= 10) {
            toast.error("You can only upload a maximum of 10 files.");
            return;
        }

        setFiles([...files, ...Array.from(newFiles)]);
        setImages([
            ...images,
            ...Array.from(newFiles).map((file) => ({
                media: { url: `attachment://${sanitizeFileName(file.name)}` },
                description: linkDescription,
            })),
        ]);

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleLinkUpload = () => {
        setImages([...images, { media: { url: linkUrl }, description: linkDescription }]);

        setLinkUrl("");
        setLinkDescription("");
    };

    const handleHandle = () => {
        if (tab === "link") {
            handleLinkUpload();
        } else if (tab === "upload") {
            handleFileUpload();
        }
    };

    return (
        <NewBuilder
            name="Media"
            tag={component.id ?? null}
            icon={<ImageIcon />}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onRemove={onRemove}
            helperText={`(${images.length}/10)`}
            extraButton={
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant={"ghost"}
                            size={"sm"}
                            className="h-7 text-xs font-medium"
                            disabled={isAtLimit}
                            onClick={() => {
                                fileInputRef.current?.click();
                            }}
                        >
                            <UploadIcon />
                            Upload
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload Media</DialogTitle>
                            <DialogDescription>Upload images to the media gallery</DialogDescription>
                        </DialogHeader>
                        <div>
                            <Tabs
                                defaultValue="link"
                                value={tab}
                                onValueChange={(value) => setTab(value as "link" | "upload")}
                            >
                                <TabsList className="mb-4 w-full">
                                    <TabsTrigger value="link">
                                        <LinkIcon />
                                        Link
                                    </TabsTrigger>
                                    <TabsTrigger value="upload">
                                        <ImagePlusIcon />
                                        Upload
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="link" className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <Label>
                                            Image
                                            <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            placeholder="Enter your image URL"
                                            value={linkUrl}
                                            onChange={(e) => setLinkUrl(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Description (Alt Text)</Label>
                                        <Input
                                            placeholder="Add a description"
                                            onChange={(e) => setLinkDescription(e.currentTarget.value)}
                                            value={linkDescription}
                                        />
                                    </div>
                                </TabsContent>
                                <TabsContent value="upload">
                                    <div className="flex flex-col gap-2">
                                        <Label>
                                            Image(s)
                                            <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            type="file"
                                            ref={fileInputRef}
                                            disabled={isAtLimit}
                                            multiple
                                            accept=".png,.jpg,.jpeg,.webp"
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant={"outline"}>Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button onClick={handleHandle}>Upload</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            }
        >
            {images.length !== 0 ? (
                <div
                    className="flex flex-col gap-2"
                    style={{ gridTemplateColumns: `repeat(${Math.max(3, Math.min(images.length, 5))}, 1fr)` }}
                >
                    <AnimatePresence>
                        {images.map((image, index) => {
                            let foundFile: File | undefined;

                            if (image.media.url.startsWith("attachment://")) {
                                foundFile = files.find(
                                    (f) => sanitizeFileName(f.name) === image.media.url.split("/").pop(),
                                );
                            }

                            return (
                                <motion.div
                                    {...motionProps}
                                    key={`${image.media.url}-${image.description}-${image.spoiler}`}
                                >
                                    <div
                                        className={cn(
                                            "bg-input/30 rounded-md border p-4 w-full flex gap-4",
                                            image.media.url.startsWith("attachment://") &&
                                                !foundFile &&
                                                "border-destructive",
                                        )}
                                    >
                                        <div className="size-[44px] overflow-hidden rounded-md bg-accent relative">
                                            {/** biome-ignore lint/performance/noImgElement: dm me if u read this */}
                                            <img
                                                src={
                                                    image.media.url.startsWith("attachment://")
                                                        ? foundFile
                                                            ? URL.createObjectURL(foundFile)
                                                            : "/question-mark-accent.png"
                                                        : image.media.url
                                                }
                                                className="object-cover size-full"
                                                alt={image.description || "No description"}
                                                width={256}
                                                height={256}
                                            />

                                            {/* <button
                                                type="button"
                                                className={cn(
                                                    "absolute inset-0 flex items-center justify-center group cursor-pointer",
                                                    image.spoiler !== undefined && image.spoiler
                                                        ? "hover:bg-black/65 hover:backdrop-blur-xs"
                                                        : "bg-black/65 backdrop-blur-xs",
                                                )}
                                                onClick={() =>
                                                    setImages(
                                                        images
                                                            .filter((_, i) => i !== index)
                                                            .concat([
                                                                {
                                                                    ...image,
                                                                    spoiler: !image.spoiler,
                                                                },
                                                            ]),
                                                    )
                                                }
                                            >
                                                {image.spoiler ? (
                                                    image.spoiler ? (
                                                        <EyeClosedIcon
                                                            size={16}
                                                            className="text-muted-foreground group-hover:text-foreground"
                                                        />
                                                    ) : (
                                                        <EyeIcon
                                                            size={16}
                                                            className="text-muted-foreground group-hover:text-foreground"
                                                        />
                                                    )
                                                ) : (
                                                    <EyeClosedIcon size={16} className="text-muted-foreground opacity-0" />
                                                )}
                                            </button> */}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-medium flex items-center gap-2">
                                                {image.media.url.split("/").pop()}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {image.description || "No description"}
                                            </span>
                                        </div>
                                        <div className="ml-auto my-auto flex gap-2 items-center">
                                            {image.media.url.startsWith("attachment://") && !foundFile && (
                                                <Button
                                                    variant={"destructive"}
                                                    onClick={() => reuploadFileInputRef.current?.click()}
                                                >
                                                    <FileWarningIcon />
                                                    Re-upload
                                                    <input
                                                        type="file"
                                                        ref={reuploadFileInputRef}
                                                        accept=".png,.jpg,.jpeg,.webp"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const newFile = e.target.files?.[0];
                                                            if (!newFile) return;

                                                            if (image.media.url.split("/").pop() !== newFile.name) {
                                                                console.log("The name of the new file doesn't match!");
                                                                toast.error("The name of the new file doesn't match!");
                                                            } else {
                                                                setFiles([...files, newFile]);
                                                            }
                                                        }}
                                                    />
                                                </Button>
                                            )}
                                            <Button
                                                variant={"ghost"}
                                                size={"icon"}
                                                className="size-7"
                                                onClick={() => {
                                                    setFiles(
                                                        files.filter(
                                                            (f) => f.name !== image.media.url.split("/").pop(),
                                                        ),
                                                    );
                                                    setImages(images.filter((_, i) => i !== index));
                                                }}
                                            >
                                                <XIcon />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="text-muted-foreground text-sm flex items-center justify-center p-4">
                    Upload images to the media gallery
                </div>
            )}
        </NewBuilder>
    );
}
