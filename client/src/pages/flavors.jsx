import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Flavors({ user, setUser, token, setToken }) {
    const [flavors, setFlavors] = useState([
        { id: 1, name: "Dr Pepper Original", img: "https://m.media-amazon.com/images/I/511ySdnIp0L._SX300_SY300_QL70_FMwebp_.jpg" },
        { id: 2, name: "Dr Pepper Cherry", img: "https://i5.walmartimages.com/seo/Dr-Pepper-Cherry-Soda-12-oz-12pk_aad84474-dab3-40c8-b319-11b71996b237.587d3b1d593b68b975e822cfe2850f9d.jpeg" },
        { id: 3, name: "Diet Dr Pepper", img: "https://olliesgreatbakery.com/cdn/shop/files/FINALDietDr.Pepper.png?v=1703885670&width=1946" },
        { id: 4, name: "Diet Dr Pepper", img: "https://olliesgreatbakery.com/cdn/shop/files/FINALDietDr.Pepper.png?v=1703885670&width=1946" },
        { id: 5, name: "Diet Dr Pepper", img: "https://olliesgreatbakery.com/cdn/shop/files/FINALDietDr.Pepper.png?v=1703885670&width=1946" },
        { id: 6, name: "Diet Dr Pepper", img: "https://olliesgreatbakery.com/cdn/shop/files/FINALDietDr.Pepper.png?v=1703885670&width=1946" },
        { id: 7, name: "Diet Dr Pepper", img: "https://olliesgreatbakery.com/cdn/shop/files/FINALDietDr.Pepper.png?v=1703885670&width=1946" },
        { id: 8, name: "Diet Dr Pepper", img: "https://olliesgreatbakery.com/cdn/shop/files/FINALDietDr.Pepper.png?v=1703885670&width=1946" },
        { id: 9, name: "Dr Pepper Original", img: "https://m.media-amazon.com/images/I/511ySdnIp0L._SX300_SY300_QL70_FMwebp_.jpg" },
        { id: 10, name: "Dr Pepper Cherry", img: "https://i5.walmartimages.com/seo/Dr-Pepper-Cherry-Soda-12-oz-12pk_aad84474-dab3-40c8-b319-11b71996b237.587d3b1d593b68b975e822cfe2850f9d.jpeg" },
        { id: 11, name: "Diet Dr Pepper", img: "https://olliesgreatbakery.com/cdn/shop/files/FINALDietDr.Pepper.png?v=1703885670&width=1946" },
        { id: 12, name: "Diet Dr Pepper", img: "https://olliesgreatbakery.com/cdn/shop/files/FINALDietDr.Pepper.png?v=1703885670&width=1946" },
        { id: 13, name: "Diet Dr Pepper", img: "https://olliesgreatbakery.com/cdn/shop/files/FINALDietDr.Pepper.png?v=1703885670&width=1946" },
        { id: 14, name: "Diet Dr Pepper", img: "https://olliesgreatbakery.com/cdn/shop/files/FINALDietDr.Pepper.png?v=1703885670&width=1946" },
        { id: 15, name: "Diet Dr Pepper", img: "https://olliesgreatbakery.com/cdn/shop/files/FINALDietDr.Pepper.png?v=1703885670&width=1946" },
        { id: 16, name: "Diet Dr Pepper", img: "https://olliesgreatbakery.com/cdn/shop/files/FINALDietDr.Pepper.png?v=1703885670&width=1946" }

    ]);

    const navigate = useNavigate();

    const handleFlavorClick = (flavor_id) => {
        navigate(`/flavors/${flavor_id}`);
    };

    return (
        <div id="flavors-page">
            <h1><b>Dr Pepper Flavors</b></h1>
            <ul id="flavors">
                {flavors.map((flavor) => (
                    <li key={flavor.id} onClick={() => handleFlavorClick(flavor.id)}>
                        
                        <img src={flavor.img} alt={flavor.name} width="200px" />
                        {flavor.name}{" "}
                    </li>
                ))}
            </ul>
        </div>
    );
}
