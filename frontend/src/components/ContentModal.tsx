import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Submit } from "../icons/Submit";
import { Button } from "./Button";
import { Input } from "./input";
import axios from "axios";
import { BACKEND_URL } from "../config";

enum ContentType {
    youtube = "youtube",
    twitter = "twitter",
}

interface ContentModalProps {
    open: boolean;
    onClose: () => void;
}

export function ContentModal({ open, onClose }: ContentModalProps) {
    const titleref = useRef<HTMLInputElement>(null);
    const linkref = useRef<HTMLInputElement>(null);
    const [type, setType] = useState(ContentType.youtube);
    const [error, setError] = useState<string | null>(null);

    async function postcontent() {
        const title = titleref.current?.value;
        const link = linkref.current?.value;

        if (!title || !link) {
            setError("Both title and link are required.");
            return;
        }

        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/content`,
                { title, link, type },
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );

            if (response.status === 200) {
                onClose();
                alert("Content added successfully!");
            }
        } catch (err) {
            setError("Failed to add content. Please try again.");
        }
    }

    return (
        <div>
            {open && (
                <div>
                    <div
                        className="w-screen h-screen bg-slate-100 fixed top-0 left-0 flex justify-center"
                        style={{ opacity: 0.4 }}
                    ></div>
                    <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center">
                        <div className="bg-white p-4 rounded shadow-lg">
                            <div className="flex justify-end">
                                <div onClick={onClose} className="cursor-pointer">
                                    <CrossIcon />
                                </div>
                            </div>
                            <div>
                                <Input reference={titleref} placeholder="Title" />
                                <Input reference={linkref} placeholder="Link" />
                                <div className="flex justify-center p-2 gap-2">
                                    <Button
                                        variant={type === ContentType.youtube ? "primary" : "secondary"}
                                        text="YouTube"
                                        onClick={() => setType(ContentType.youtube)}
                                    />
                                    <Button
                                        variant={type === ContentType.twitter ? "primary" : "secondary"}
                                        text="Twitter"
                                        onClick={() => setType(ContentType.twitter)}
                                    />
                                </div>
                            </div>
                            {error && <p className="text-red-500 text-center">{error}</p>}
                            <div className="flex justify-center">
                                <Button
                                    variant="primary"
                                    text="Submit"
                                    startIcon={<Submit />}
                                    onClick={postcontent}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
