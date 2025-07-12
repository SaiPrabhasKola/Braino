import "../index.css"
import { Button } from "../components/Button"
import { ShareIcon } from "../icons/ShareIcon"
import { PlusIcon } from "../icons/PlusIcon"
import { Icon } from "../icons/Icon"
import { MenuIcon } from "../icons/MenuIcon"

import { ContentModal } from "../components/ContentModal"
import { Sidebar } from "../components/Sidebar"
import { useEffect, useState } from "react"
import { Braino } from "../icons/Braino"
import { useNavigate } from "react-router-dom"
import { Submit } from "../icons/Submit"
import { Card } from "../components/Card"
import { DialogBox } from "../components/DialogBox"


export default function Dashboard() {


    const navigate = useNavigate();

    const navi = () => {
        navigate('/signin')
    }

    const token = localStorage.getItem("token")
    const [login, setLogin] = useState(false)

    useEffect(() => {
        if (token) {
            setLogin(true)
        }
    })
    const [filteredContents, setFilteredContents] = useState<any[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [sideBarOpen, setSideBarOpen] = useState(false)
    const toggleSideBar = () => setSideBarOpen(prevState => !prevState);
    const closeSideBar = () => setSideBarOpen(false)

    return (
        <div>
            <div>
                <Sidebar open={sideBarOpen} onClose={closeSideBar} setFilteredContents={setFilteredContents} />
            </div>
            <div className="p-6">
                <ContentModal open={modalOpen} onClose={() => {
                    setModalOpen(false)
                }} />

                <div>
                    <DialogBox open={dialogOpen} onClose={() => {
                        setDialogOpen(false)
                    }} />
                </div>

                <div className="flex justify-between">
                    <div className="cursor-pointer" onClick={toggleSideBar}>
                        <MenuIcon />
                    </div>
                    <div className="flex items-center justify-center pl-60 gap-2 ml-8">
                        <span className="pl-2"><Icon /></span>
                        <span className="pt-2"><Braino /></span>

                    </div>
                    <div className="flex justify-end gap-4 pb-2">
                        <Button onClick={() => setModalOpen(true)} variant="primary" text="add content" startIcon={<PlusIcon />}></Button>
                        <Button variant="secondary" text="share brain" startIcon={<ShareIcon />} onClick={() => {

                            setDialogOpen(true)



                        }}></Button>
                    </div>
                </div>



                <div>
                    {login && (<div className="flex gap-16 p-8 flex-wrap content-between">
                        {filteredContents.map((content, index) => (
                            <Card key={index} title={content.title} link={content.link} type={content.type} contentId={content._id} />
                        ))}

                    </div>)}
                    {!login && (<div><div className="flex justify-center pt-72 pb-2">
                        <p>Not Logged In yet..</p>
                    </div>
                        <div className="flex content-center justify-center pt-2 pr-2 pb-4"><Button variant="primary" text="signin" startIcon={<Submit />} onClick={navi}></Button></div></div>
                    )}

                </div>

            </div>
        </div>

    )
}