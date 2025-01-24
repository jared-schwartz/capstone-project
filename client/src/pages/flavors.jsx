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
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const jsonData = await response.json();6
                setFlavors(jsonData); 
            } catch (error) {
                console.error("Error fetching flavors.", error);
            }
        };
        fetchData();
    }, []);

    function searchFunction() {
        const searchTerm = document.getElementById('search-bar').ariaValueMax.toLowerCase();
        const flavors = document.querySelectorAll('flavors');

        flavors.forEach(item =>{
            const text = item.textContent.toLowerCase();
            if (text.includes(searchTerm)){
                item.computedStyleMap.display = 'block';
            } else {
                item.computedStyleMap.display = 'none';
            }
        });
    }
      

    return (
        <div id="flavors-page">
            <h1><b>Dr Pepper Flavors</b></h1>
            <div id="search-bar">
                <input type="text" placeholder="Search..."></input>
                <button onClick={searchFunction}>Search</button>
            </div>
            <ul id="flavors-catalog">
                {flavors.length > 0 ? (
                    flavors.map((flavor) => (
                        <li key={flavor.id} onClick={() => handleFlavorClick(flavor.id)}>
                            <img src={flavor.photo_url} alt={flavor.name} width="200px" />
                            <br></br>
                            <br></br>
                            <b>{flavor.name}</b>
                            <br></br>
                            {flavor.average_score} / 5
                        </li>
                    ))
                ) : (
                    <p>No flavors available at the moment.</p>
                )}
            </ul>
        </div>
    );
}