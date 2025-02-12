import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Comment from "./comments";
import '@fortawesome/fontawesome-free/css/all.min.css';


export default function Review({ review, token, user, editing = false, editable = false }) {
    const [edit, setEdit] = useState(editing)
    const [tempReview, setTempReview] = useState(review)
    const [thisReview, setThisReview] = useState(review)
    const [userComment, setUserComment] = useState()
    const [comments, setComments] = useState([])
    const [showComments, setShowComments] = useState(false)

    useEffect(() => {
        async function getComments() {
            try {
                const response = await fetch(`/api/reviews/comments/${review.id}`, {
                    headers: { "Content-Type": "application/json" }
                });
                if (!response.ok) throw new Error("Failed to fetch")

                const data = await response.json();

                if (user && data.find((comment) => comment.user_id == user.id)) {
                    const userComExits = data.find((comment) => comment.user_id == user.id)
                    setUserComment(userComExits)
                    setComments(data.filter((comment) => comment.user_id !== user.id))
                } else if (data) {
                    setComments(data)
                }
            } catch (ex) {
                throw new Error("empty ");

            }
        }
        getComments();
    }, [review])

    async function onDelete() {
        try {
            const response = await fetch("/api/reviews", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    "user_id": user.id,
                    "review_id": thisReview.id,
                })

            })
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            setTempReview({ score: 1, content: "", user_id: user.id, flavor_id: review.flavor_id, username: user.username })

            setEdit(true);

        } catch (error) {
            throw new Error("empty ")
        }
    }

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
                        <p className="username"><NavLink to={`/flavors/${review.flavor_id}`}>{review.flavor}</NavLink> review by {user.username}</p>
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

            {!edit &&
                <div className={`revCom ${editable ? "own-review" : ""}`}>
                    <div className="review-header">
                        <div className="score-circle">
                            <span className="score">{thisReview.score}</span>
                            <span className="out-of">/5</span>
                        </div>
                        <p className="username"><NavLink to={`/flavors/${review.flavor_id}`}>{review.flavor}</NavLink> review by {review.username}</p>
                    </div>

                    <div className="review-content">
                        <p>{thisReview.content}</p>
                        {editable && (
                            <div className="review-controls">
                                <button className="edit-btn" onClick={() => setEdit(true)}>
                                    <i className="fas fa-pencil-alt"></i>
                                </button>
                                <button className="delete-btn" onClick={onDelete}>
                                    <i className="fas fa-trash" ></i>
                                </button>
                            </div>
                        )}
                    </div>

                    <button className="toggle-comments-btn" onClick={() => setShowComments(!showComments)}>
                        {showComments ? "Hide Comments" : `Show ${comments.length + (userComment && 1 || 0)} Comments`}
                        <i className={`fas fa-chevron-${showComments ? "up" : "down"}`}></i>
                    </button>
                </div>
            }
            {showComments && (
                <>
                    {user && (
                        <>
                            {userComment ? (
                                <Comment comment={userComment} token={token} reviewer={review.username} editable={true} />
                            ) : (
                                <Comment
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

    )
}