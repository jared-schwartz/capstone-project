import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Flavors() {
    const [flavors, setFlavors] = useState([]);
    const navigate = useNavigate();
    const handleFlavorClick = (flavor_id) => {
        navigate(`/flavors/${flavor_id}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/flavors");
                const jsonData = await response.json();
                console.log(jsonData);
                setFlavors(jsonData.flavors);
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
                {flavors.map((flavor) => (
                    <li key={flavor.id} onClick={() => handleFlavorClick(flavor.id)}>
                        
                        <img src={flavor.img} alt={flavor.name} width="200px" />
                        {flavor.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
