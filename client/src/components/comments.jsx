import React, { useState, useEffect } from "react";

export default function Comment({ setRefresh, comment, token, reviewer, editing = false, editable = false }) {
    const [edit, setEdit] = useState(editing)
    const [tempComment, setTempComment] = useState(comment)
    const [thisComment, setThisComment] = useState(comment)

    async function onSubmit(event) {
        event.preventDefault()
        console.log("Comment Token:", token, "Comment Data;", comment)
        try {
            const response = await fetch("/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    "user_id": tempComment.user_id,
                    "review_id": tempComment.review_id,
                    "content": tempComment.content
                })
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            console.log("Success:", data);
            setThisComment({ ...data, username: tempComment.username })
            setRefresh(true)
            setEdit(false)

        } catch (ex) {
            throw new Error("empty ");
        }
    }


    return (
        <div>
            {edit ? (

                <form onSubmit={onSubmit}>
                    <input
                        placeholder="Write a response!"
                        onChange={(e) => setTempComment((prevComment) => ({
                            ...prevComment,
                            content: e.target.value,
                        }))}
                        value={tempComment.content} />
                    <button
                        type="submit">Submit</button>
                </form>
            ) : (
                <>
                    <p>{thisComment.username} responded to {reviewer}</p >
                    <p>{thisComment.content}</p>
                    {editable && <button onClick={() => { setEdit(true) }}>Edit</button>}
                </>
            )
            }
        </div>

    )
}