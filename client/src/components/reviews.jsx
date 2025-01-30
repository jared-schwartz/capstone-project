import React, { useState, useEffect } from "react";

export default function Review({ review, editing = false, editable = false, onSub }) {
    const [edit, setEdit] = useState(editing)
    const [tempReview, setTempReview] = useState({ score: review.score, content: review.content })



    return (
        <div>
            {edit ? (

                <form id="">
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
                    <button onClick={() => { setEdit(false) }}>Sumbit</button>
                </form>

            ) : (
                <>
                    <p>{review.username} gave {review.flavor} a {review.score}/5</p >
                    <p>{review.content}</p>
                    {editable && <button onClick={() => { setEdit(true) }}>edit</button>}
                </>
            )
            }
        </div>

    )
}