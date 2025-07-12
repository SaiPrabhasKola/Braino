
import { Input } from "../components/input"
import { Button } from "../components/Button"
import { Submit } from "../icons/Submit"
import { useRef } from "react"
import axios from "axios"
import { BACKEND_URL } from "../config"
import { useNavigate } from "react-router-dom"
export function SignUp() {
    const signnav = useNavigate()

    const usernameRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();
    async function signup() {
        try {
            const username = usernameRef.current?.value;
            const password = passwordRef.current?.value;

            const response = await axios.post(BACKEND_URL + "/api/v1/signup", {
                username,
                password,
            });

            if (response.status === 200) {
                alert("You're signed up!");
                signnav('/signin');
            }
        } catch (error) {

            if (axios.isAxiosError(error)) {
                if (error.response) {

                    const status = error.response.status;
                    const errorMessage = error.response.data.error || "Something went wrong";

                    if (status === 422) {
                        alert("Validation failed: " + errorMessage);
                    } else if (status === 400) {
                        alert("Username already exists. Please choose another.");
                    } else {
                        alert(`Unexpected error: ${errorMessage}`);
                    }
                } else {

                    alert("No response from the server. Please try again later.");
                }
            } else {
                alert("An unexpected error occurred.");
            }
        }
    }



    return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white rounded-xl border min-w-48 p-8">
            <Input reference={usernameRef} placeholder="Username"></Input>
            <Input reference={passwordRef} placeholder="Password"></Input>
            <div className="flex justify-center pt-4">
                <Button loading={false} variant="primary" text={"SignUp"} startIcon={<Submit />} onClick={signup}></Button>
            </div>
        </div>
    </div>
}