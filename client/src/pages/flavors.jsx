import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Flavors({user, setUser, token, setToken}){ 
    const [catalog, setCatalog] = useState([]);
    const navigate = useNavigate();
    const handleFlavorClick = (flavorId) => {
        navigate(`/flavors/${flavorId}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch();
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
    })

    return (
        <>
        <h1>Dr Pepper Flavors</h1>
        </>
    )
}
