import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Register({ user, setUser, token, setToken }) {
    const navigate = useNavigate();

    return (
        <>
            <div id="register-form">
                <form id="form">
                    <h3>Register User</h3>
                </form>
            </div>

        </>
    )
}