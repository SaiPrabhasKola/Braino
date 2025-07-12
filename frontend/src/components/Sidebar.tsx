import { useNavigate } from "react-router-dom";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SidebarItem } from "./SideBarItem";
import { Icon } from "../icons/Icon";
import { Submit } from "../icons/Submit";
import { Braino } from "../icons/Braino";
import { UserIcon } from "../icons/UserIcon";
import { Button } from "./Button";
import { useEffect, useState } from "react";
import { useContentFilter } from "../hooks/useContentFilter";
import { AllLinks } from "../icons/AllLinks";

export function Sidebar({ open, onClose, setFilteredContents }: { open: boolean, onClose: () => void, setFilteredContents: (content: any[]) => void }) {
    const navigate = useNavigate();

    const [signInBtn, setSignInbtn] = useState("signin");
    const [filterType, setFilterType] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setSignInbtn("signout");
        }
    }, []);

    const handleClick = () => {
        if (signInBtn === "signin") {
            navigate('/signin');
        } else if (signInBtn === "signout") {
            localStorage.removeItem("token");
            window.location.reload();
        }
    };

    const filteredContents = useContentFilter(filterType);

    useEffect(() => {
        if (filteredContents && filteredContents.length > 0) {
            setFilteredContents(filteredContents);
        }
    }, [filteredContents]);


    useEffect(() => {
        console.log(`Filter type set to: ${filterType}`);
    }, [filterType]);

    return (
        open && (
            <>
                <div
                    className="w-screen h-screen bg-slate-100 fixed top-0 left-0 opacity-60 z-10"
                    onClick={onClose}
                ></div>

                <div className="fixed top-0 left-0 w-64 h-screen bg-white p-4 rounded z-20">
                    <div className="flex flex-col ml-2 ">
                        <div className="flex justify-center pt-4">
                            <Icon />
                            <Braino />
                        </div>
                        <div className="p-8 text-slate-600 font-semibold">
                            <div className="p-2">
                                <SidebarItem icon={<AllLinks />} text={"All"} onClick={() => setFilterType(null)} />
                            </div>
                            <div className="p-2">
                                <SidebarItem icon={<TwitterIcon />} text={"Twitter"} onClick={() => setFilterType("twitter")} />
                            </div>
                            <div className="p-2">
                                <SidebarItem icon={<YoutubeIcon />} text={"Youtube"} onClick={() => setFilterType("youtube")} />
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <Button
                                variant="primary"
                                text={signInBtn}
                                startIcon={signInBtn === "signin" ? <Submit /> : <UserIcon />}
                                onClick={handleClick}
                            />
                        </div>
                    </div>
                </div>
            </>
        )
    );
}
