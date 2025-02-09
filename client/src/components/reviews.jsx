import React, { useState, useEffect } from "react";

export default function Review({ review, token, editing = false, editable = false }) {
    const [edit, setEdit] = useState(editing)
    const [tempReview, setTempReview] = useState(review)
    const [thisReview, setThisReview] = useState(review)

    useEffect(() => {
        console.log(review)
    }, [])

    async function onSubmit(event) {
        event.preventDefault()

        try {
            console.log(tempReview)

            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    "user_id": tempReview.user_id,
                    "flavor_id": tempReview.flavor_id,
                    "content": tempReview.content,
                    "score": tempReview.score
                })
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            console.log("Success:", data);
            setThisReview(data)
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
                        onChange={(e) => setTempReview((prevReview) => ({
                            ...prevReview,
                            score: e.target.value,
                        }))}
                        value={tempReview.score} />
                    <input
                        placeholder="Write a review!"
                        onChange={(e) => setTempReview((prevReview) => ({
                            ...prevReview,
                            content: e.target.value,
                        }))}
                        value={tempReview.content} />
                    <button
                        type="submit">Submit</button>
                </form>

            ) : (
                <>
                    <p>{thisReview.username} gave {thisReview.flavor} a {thisReview.score}/5</p >
                    <p>{thisReview.content}</p>
                    {editable && <button onClick={() => { setEdit(true) }}>Edit</button>}
                </>
            )
            }
        </div>

    )
}