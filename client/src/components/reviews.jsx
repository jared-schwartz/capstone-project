import React, { useState, useEffect, useInsertionEffect } from "react";
import Comment from "./comments";
import { createPath } from "react-router-dom";

export default function Review({ setRefresh, review, token, user, editing = false, editable = false }) {
    const [edit, setEdit] = useState(editing)
    const [tempReview, setTempReview] = useState(review)
    const [thisReview, setThisReview] = useState(review)
    const [userComment, setUserComment] = useState()
    const [comments, setComments] = useState([])
    const [showComments, setShowComments] = useState(false)

    useEffect(() => {
        async function getComments() {
            try {
                const response = await fetch(`/api/comments/${review.id}`, {
                    headers: { "Content-Type": "application/json" }
                });
                if (!response.ok) throw new Error("Failed to fetch")

                const data = await response.json();
                console.log(data)
                if (user && data.find((comment) => comment.user_id == user.id)) {
                    const userComExits = data.find((comment) => comment.user_id == user.id)
                    setUserComment(userComExits)
                    setComments(data.filter((comment) => comment.user_id !== user.id))
                    console.log("User Comment:", userComment, "Other Comments:", comments)
                } else if (data) {
                    console.log("No user comment")
                    setComments(data)
                }
            } catch (ex) {
                throw new Error("empty ");

            }
        }
        getComments();
    }, [review])

    useEffect(() => {
        console.log(tempReview)
        console.log(token)
    }, [tempReview])

    async function onSubmit(event) {
        event.preventDefault()
        try {

            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    "user_id": user.id,
                    "flavor_id": review.flavor_id,
                    "content": tempReview.content,
                    "score": tempReview.score
                })
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);



            const data = await response.json();
            console.log("Success:", data);
            setRefresh(true)
            setThisReview(data)
            setEdit(false)

        } catch (ex) {
            throw new Error("empty ");
        }
    }


    return (
        <div>
            {edit &&
                <form
                    onSubmit={onSubmit}
                    className="revCom">
                    <div className="review-header">
                        <p>How good do you think this flavor is?</p>
                        <div className="score-container">
                            <input type="number" min="0" max="5" className="score-input"
                                placeholder="Enter a score out of 5"
                                onChange={(e) => setTempReview((prevReview) => ({
                                    ...prevReview,
                                    score: e.target.value,
                                }))}
                                value={tempReview.score}
                            />
                            <span>/5</span>
                        </div>
                        <p className="username">by {user.username}</p>
                    </div>

                    <hr />

                    <textarea className="content-input" placeholder="Write your review here..."
                        onChange={(e) => setTempReview((prevReview) => ({
                            ...prevReview,
                            content: e.target.value,
                        }))}
                        value={tempReview.content}
                    ></textarea>

                    <button type="submit" className="submit-btn">Submit</button>
                </form>
            }

            <div style={{ display: edit ? "none" : "block" }}>
                <div className="review-header">
                    <p>{thisReview.score}/5</p>
                    <p className="username">by {review.username}</p>
                </div>

                <hr />

                <p>{thisReview.content}</p>
                {editable && <button onClick={() => setEdit(true)}>Edit</button>}
                <button onClick={() => setShowComments(!showComments)}>
                    {showComments ? "Hide" : `Show ${comments.length + (userComment && 1 || 0)}`} Comments
                </button>
                {showComments && (
                    <>
                        {user && (
                            <>
                                {userComment ? (
                                    <Comment setRefresh={setRefresh} comment={userComment} token={token} reviewer={review.username} editable={true} />
                                ) : (
                                    <Comment
                                        setRefresh={setRefresh}
                                        comment={{ user_id: user.id, review_id: review.id, username: user.username, content: "" }}
                                        token={token} reviewer={review.username} editable={true} editing={true}
                                    />
                                )}
                            </>
                        ) || <p>Login or Register to make comments!</p>}
                        {
                            comments.map((comment) => <Comment comment={comment} reviewer={review.username} />)
                        }
                        {comments.length < 1 && !userComment && <p>Nobody has commented here</p>}
                    </>
                )}
            </div>
        </div>

    )
}