import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home({user, setUser, token, setToken}){
    const navigate = useNavigate();

    return (
        <>
        <div id="home">
        <h1>Which is the highest rated Dr Pepper flavor?</h1>
        <img src="https://s.wsj.net/public/resources/images/BN-MP782_0217dr_G_20160216103055.jpg"></img>
        <h3>Highest Rated Flavor: (Answer Here)</h3>
        </div>
        </>
    )
}

