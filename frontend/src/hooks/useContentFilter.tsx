import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

export function useContentFilter(type: string | null) {
    const [contents, setContents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
                    headers: {
                        "Authorization": localStorage.getItem("token"),
                    },
                    params: {
                        type,
                    },
                });
                setContents(response.data.content);
            } catch (error) {
                console.error("Error fetching content:", error);
            }
        };

        fetchData();
    }, [type]);

    return contents;
}
