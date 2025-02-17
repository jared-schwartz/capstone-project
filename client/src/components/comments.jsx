import React, { useState, useEffect } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Comment({ comment, token, editing = false, editable = false }) {
    const [edit, setEdit] = useState(editing)
    const [tempComment, setTempComment] = useState(comment)
    const [thisComment, setThisComment] = useState(comment)

    async function onDelete() {
        try {
            const response = await fetch("/api/comments", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    "user_id": thisComment.user_id,
                    "comment_id": thisComment.id,
                })

            })
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            setTempComment({ content: "", user_id: comment.user_id, review_id: comment.review_id, username: thisComment.username })
            setEdit(true);

        } catch (error) {
            throw new Error("empty ")
        }
    }

    async function onSubmit(event) {
        event.preventDefault()
        try {
            const response = await fetch("/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    "user_id": comment.user_id,
                    "review_id": comment.review_id,
                    "content": tempComment.content
                })
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            setThisComment({ ...data, username: tempComment.username })
            setEdit(false)

        } catch (ex) {
            throw new Error("empty ");
        }
    }


    return (
        <div>
            <hr />
            {edit ? (

                <form
                    onSubmit={onSubmit}
                    className="revCom">
                    <textarea className="content-input"
                        placeholder="Comment"
                        onChange={(e) => setTempComment((prevComment) => ({
                            ...prevComment,
                            content: e.target.value,
                        }))}
                        value={tempComment.content}
                    ></textarea>

                    <button type="submit" className="submit-btn">Submit</button>
                </form>
            ) : (
                <div className={`revCom ${editable ? "own-review" : ""}`}>

                    <div className="review-content">
                        <p>{thisComment.content}</p>
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
                    <div className="review-header">
                        <p className="username">posted by {thisComment.username}</p>
                    </div>
                </div>
            )
            }
        </div>

    )
}