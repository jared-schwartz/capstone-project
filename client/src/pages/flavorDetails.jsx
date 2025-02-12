import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Review from "../components/reviews";

export default function FlavorDetails({ user, token }) {
    const [reviews, setReviews] = useState()
    //Used to refresh the page when sumbmiting items
    const [refresh, setRefresh] = useState(false)
    const [flavor, setFlavor] = useState();
    const [userReview, setUserReview] = useState()
    const { flavor_id } = useParams();

    useEffect(() => {
        const fetchFlavor = async () => {
            try {
                const response = await fetch(`/api/flavors/${flavor_id}`, {
                    headers: { "Content-Type": "application/json" }
                });
                if (!response.ok) throw new Error("Failed to fetch")
                const data = await response.json();
                setFlavor(data);
            }
            catch (ex) {
                throw new Error("empty  ");
            }
        }
        fetchFlavor();
    }, [refresh, user])

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`/api/flavors/reviews/${flavor_id}`, {
                    headers: { "Content-Type": "application/json" }
                });
                if (!response.ok) throw new Error("Failed to fetch");



                const data = await response.json();

                if (user && data.find((review) => review.user_id == user.id)) {
                    setUserReview(data.find((review) => review.user_id == user.id))
                    setReviews(data.filter((review) => review.user_id !== user.id))
                } else {
                    setReviews(data)
                }
            } catch (ex) {
                throw new Error("empty ")
            }
        };

        fetchReviews();
        setRefresh(false);
    }, []);


    return (
        <div id="flavor-details">
            <div className="split-view">
                {flavor ? (
                    <>
                        <div className="split-left">
                            <img src={flavor.photo_url} alt={flavor.name} />
                        </div>
                        <div className="split-right">
                            <h2>{flavor.name}</h2>
                            <p>Description: {flavor.description}</p>
                            <p>Average Rating: {flavor.average_score}</p>
                        </div>
                    </>
                ) : (
                    <p>Loading</p>
                )}
            </div>
            <div id="reviews-and-comments">
                <h2>Reviews</h2>
                {user && flavor && <>
                    {userReview ? (
                        <>
                            {console.log("flavor id", flavor_id)}
                            <Review setRefresh={setRefresh} refresh={refresh} user={user} review={userReview} token={token} editable={true} edit={false} />
                        </>
                    ) : (
                        <>
                            <Review
                                setRefresh={setRefresh}
                                refresh={refresh}
                                editing={true}
                                user={user}
                                review={{ score: 1, content: "", user_id: user.id, flavor_id: flavor.id, username: user.username }}
                                token={token}
                                editable={true}
                            />
                        </>
                    )}
                </> || <p>Login or register to create reviews!</p>}


                {reviews && reviews.map((review) => (
                    <Review setRefresh={setRefresh} key={review.id} user={user} review={review} token={token} />
                ))}

                <div style={{ display: reviews ? "none" : "block" }}>
                    <p>No Reviews</p>
                </div>
            </div>

        </div>
    );
}
