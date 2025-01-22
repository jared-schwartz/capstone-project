import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Flavors() {
    const [flavors, setFlavors] = useState([]); // Initialize with an empty array
    const navigate = useNavigate();

    const handleFlavorClick = (flavor_id) => {
        navigate(`/flavors/${flavor_id}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/flavors");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const jsonData = await response.json();
                setFlavors(jsonData); 
            } catch (error) {
                console.error("Error fetching flavors.", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div id="flavors-page">
            <h1><b>Dr Pepper Flavors</b></h1>
            <ul id="flavors-catalog">
                {flavors.length > 0 ? (
                    flavors.map((flavor) => (
                        <li key={flavor.id} onClick={() => handleFlavorClick(flavor.id)}>
                            <img src={flavor.photo_url} alt={flavor.name} width="200px" />
                            <br></br>{flavor.name}
                        </li>
                    ))
                ) : (
                    <p>No flavors available at the moment.</p>
                )}
            </ul>
        </div>
    );
}
