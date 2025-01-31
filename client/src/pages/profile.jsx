import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile({ user, setUser, token, setToken }) {
    const [userdata, setUserdata] = useState();

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch(`/api/user/${user}`);
    //             if (!response.ok) {
    //                 throw new Error("Network response was not ok");
    //             }
    //             const jsonData = await response.json();
    //             setUserdata(jsonData);
    //         } catch (error) {
    //             console.error("Error fetching user.", error);
    //         }
    //     };
    //     fetchData();
    // }, []);
    return (
        <>
            <div>
                <h1>

                </h1>
            </div>
        </>
    )
}
