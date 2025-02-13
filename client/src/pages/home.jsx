import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Home({ user, setUser, token, setToken }) {
  const navigate = useNavigate();
  ;

  return (
    <>
      <div id="home">
        <h1>What is your favorite flavor of Dr Pepper?</h1>
        <h4>Let us know by leaving some reviews and comments.</h4>
        <img
          src="https://s.wsj.net/public/resources/images/BN-MP782_0217dr_G_20160216103055.jpg"
          alt="Dr Pepper"/>

      <h3>Want to leave a review? Make an account then navigate to the flavors page.</h3>

      </div>
    </>
  );
}


