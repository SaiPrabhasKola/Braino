
import { DeleteIcon } from "../icons/DeleteIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";

interface CardProps {
    title: string;
    link: string;
    type: "twitter" | "youtube" | "pdf";
    contentId: string;
}


export function Card({ title, link, type, contentId }: CardProps) {



    if (!link) {
        return <div>No valid link provided</div>;
    }

    let videoId: string | null = null;

    if (link.includes("youtube.com") || link.includes("youtu.be")) {
        videoId = link.includes("youtu.be")
            ? link.split("/").pop() || null
            : new URLSearchParams(new URL(link).search).get("v") || null;
    }


    return (
        <div>
            <div className="p-4 bg-white rounded-md border-slate-300 max-w-72 border min-h-72
             max-h-78 min-w-72 bg-gray-100 rounded-lg shadow-md ">
                <div className="flex justify-between">
                    <div className="flex items-center text-md">
                        <div className="text-gray-500 pr-4">
                            {type === "twitter" && <TwitterIcon />}
                            {type === "youtube" && <YoutubeIcon />}
                        </div>
                        {title}
                    </div>
                    <div className="flex items-center">


                        <div className="text-gray-500 cursor-pointer">
                            <DeleteIcon contentId={contentId} />
                        </div>
                    </div>
                </div>
                <div className="pt-4 flex justify-center content-center ">
                    {type === "youtube" && (
                        <div className="flex justify-center items-center p-4 bg-white rounded-lg shadow-md">
                            <iframe
                                className="w-full flex content-center"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            />
                        </div>
                    )}
                    {type === "twitter" && (

                        <blockquote className="twitter-tweet">
                            <a href={link} target="_blank" rel="noopener noreferrer">
                                view tweet
                            </a>
                        </blockquote>


                    )}
                </div>
            </div>
        </div>
    );
}
