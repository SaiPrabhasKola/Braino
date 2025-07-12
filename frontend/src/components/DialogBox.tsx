import { CrossIcon } from "../icons/CrossIcon";
import { BACKEND_URL } from "../config";
import { Button } from "./Button";
import { Copy } from "../icons/Copy";
import axios from "axios";
import { useState } from "react";

interface DialogBoxProps {
    open: boolean;
    onClose: () => void;
}

export function DialogBox({ open, onClose }: DialogBoxProps) {
    const [shareLink, setShareLink] = useState<string | null>(null);

    const share = async () => {
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/brain/share`,
                { share: true },
                {
                    headers: {
                        Authorization: localStorage.getItem("token"), // Directly include the token
                    },
                }
            );
            const shareId = response.data.hash;
            const link = `${BACKEND_URL}/api/v1/brain/${shareId}`;
            setShareLink(link); // Set the share link in state
        } catch (error) {
            console.error("Error generating share link:", error);
        }
    };


    return (
        <div>
            {open && (
                <div>
                    <div
                        className="w-screen h-screen bg-slate-100 fixed top-0 left-0 flex justify-center"
                        style={{ opacity: 0.4 }}
                    ></div>
                    <div className="w-screen h-screen flex fixed top-0 left-0 justify-center items-center">
                        <div className="bg-white p-4 rounded shadow-lg">
                            <div onClick={onClose} className="cursor-pointer flex justify-end">
                                <CrossIcon />
                            </div>
                            <div className="flex justify-center">
                                <Button variant="primary" onClick={share} text={"Generate Link"} />
                            </div>
                            <div className="flex gap-2 mt-4 items-center">
                                {shareLink ? (
                                    <>
                                        <Copy share={shareLink} />
                                        <div>{shareLink}</div>

                                    </>
                                ) : (
                                    <div>No link generated yet.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
