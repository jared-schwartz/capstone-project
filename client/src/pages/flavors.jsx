import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Flavors() {
  const [flavors, setFlavors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [nameSortOrder, setNameSortOrder] = useState("asc");
  const [scoreSortOrder, setScoreSortOrder] = useState("asc");
  const navigate = useNavigate();

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

  // Filters and sorting
  const filteredAndSortedFlavors = flavors
    .filter((flavor) =>
      flavor.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {

      if (scoreSortOrder !== null) {
        return scoreSortOrder === "asc"
          ? a.average_score - b.average_score
          : b.average_score - a.average_score;
      }

      const compare = a.name.localeCompare(b.name);
      return nameSortOrder === "asc" ? compare : -compare;
    });

  const handleNameSortToggle = () => {
    setNameSortOrder(nameSortOrder === "asc" ? "desc" : "asc");
    setScoreSortOrder(null); 
  };

  const handleScoreSortToggle = () => {
    setScoreSortOrder(scoreSortOrder === "asc" ? "desc" : "asc");
    setNameSortOrder(null); 
  };

  const handleFlavorClick = async (flavor_id) => {
   
    navigate(`/flavors/${flavor_id}`);
};

  return (
    <div id="flavors-page">
      <h1><b>Dr Pepper Flavors</b></h1>
        <h3><u>Search for your favorite flavor!</u></h3>
        <div id="search-bar">
            <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        </div>
        <br />
        <br />
        <div id="sort-buttons">
            <button onClick={handleNameSortToggle}>
            Sort by Name: {nameSortOrder === "asc" ? "Descending" : "Ascending"}
            </button>
            <button onClick={handleScoreSortToggle}>
            Sort by Score: {scoreSortOrder === "asc" ? "Highest to Lowest" : "Lowest to Highest"}
            </button>
        </div>
      <ul id="flavors-catalog">
        {filteredAndSortedFlavors.length > 0 ? (
          filteredAndSortedFlavors.map((flavor) => (
            <li key={flavor.id} onClick={() => handleFlavorClick(flavor.id)}>
              <img src={flavor.photo_url} alt={flavor.name} width="200px" />
              <br />
              <br />
              <b>{flavor.name}</b>
              <br />
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
