import React, { useState, useEffect } from "react";

export default function Comment({ comment, token, editing = false, editable = false }) {
    const [edit, setEdit] = useState(editing)
    const [tempComment, setTempComment] = useState(comment)
    const [thisComment, setThisComment] = useState(comment)

    useEffect(() => {
        console.log(review)
    }, [])

    async function onSubmit(event) {
        event.preventDefault()

        try {
            console.log(tempComment)

            const response = await fetch("/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    "user_id": tempComment.user_id,
                    "review_id": tempComment.flavor_id,
                    "content": tempComment.content,
                })
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            console.log("Success:", data);
            setThisComment(data)
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
                        placeholder="Enter a score out of 5"
                        onChange={(e) => setTempComment((prevReview) => ({
                            ...prevReview,
                            score: e.target.value,
                        }))}
                        value={tempComment.score} />
                    <input
                        placeholder="Write a review!"
                        onChange={(e) => setTempComment((prevReview) => ({
                            ...prevReview,
                            content: e.target.value,
                        }))}
                        value={tempComment.content} />
                    <button
                        type="submit">Submit</button>
                </form>

            ) : (
                <>
                    <p>{thisComment.username} gave {thisComment.flavor} a {thisComment.score}/5</p >
                    <p>{thisComment.content}</p>
                    {editable && <button onClick={() => { setEdit(true) }}>Edit</button>}
                </>
            )
            }
        </div>

    )
}