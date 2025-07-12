import { useNavigate } from "react-router-dom"
import { Input } from "../components/input"
import { useRef } from "react"
import { Button } from "../components/Button"
import { Submit } from "../icons/Submit"
import axios from "axios"
import { BACKEND_URL } from "../config"
export function SignIn() {
    const usernameRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();
    const signnav = useNavigate();
    async function signin() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        console.log(username)
        const response = await axios.post(BACKEND_URL + "/api/v1/signin", {
            username: username,
            password: password
        })
        const jwt = response.data.token;
        localStorage.setItem("token", jwt)

        if (response.status === 200) {
            signnav('/home')

        }
    }
    const navigate = useNavigate();
    const handleClick = () => navigate('/signup')
    return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white rounded-xl border min-w-48 p-8">
            <Input reference={usernameRef} placeholder="Username"></Input>
            <Input reference={passwordRef} placeholder="Password"></Input>
            <div className="flex justify-center pt-4">
                <Button loading={false} variant="primary" text={"SignIn"} startIcon={<Submit />} onClick={signin}></Button>
            </div>
            <div className="flex justify-center p-2 cursor-disabled">new user?</div>
            <div className="flex justify-center pr-2 cursor-pointer underline">
                <a onClick={handleClick}>signup</a>
            </div>
        </div>
    </div>
}