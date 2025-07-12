import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
export function useShareHash() {

    const [share, setShare] = useState("")
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
                    headers: {
                        "Authorization": localStorage.getItem("token"),
                        "share": true
                    },
                });
                setShare(response.data.hash)
            } catch (error) {
                console.error("Error fetching content:", error);
            }

        };

        fetchData();
    }, []);

    return share
}