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
                console.log(data);
                setFlavor(data);
            }
            catch (ex) {
                throw new Error("empty  ");
            }
        }
        fetchFlavor();
    }, [refresh, user])

    useEffect(() => {
        console.log(user);

        const fetchReviews = async () => {
            try {
                const response = await fetch(`/api/flavors/reviews/${flavor_id}`, {
                    headers: { "Content-Type": "application/json" }
                });
                if (!response.ok) throw new Error("Failed to fetch");

                const data = await response.json();
                console.log(data);

                if (user) {
                    const userRevExists = data.find((review) => review.user_id == user.id);
                    setUserReview(userRevExists || null); // Make sure it's either a review or null
                    setReviews(data.filter((review) => review.user_id !== user.id));
                } else {
                    setReviews(data);
                }
            } catch (ex) {
                console.error("Error fetching reviews:", ex);
            }
        };

        fetchReviews();
        setRefresh(false);
    }, [refresh, user]); // Added `user` as a dependency so it updates when user changes


    return (
        <div id="flavorsDetailsPage">
            <div className="split-view">
                {flavor ? (
                    <div>
                        <p>{flavor.name}</p>
                        <p>ID: {flavor_id}</p>
                        <img src={flavor.photo_url} alt={flavor.name} />
                        <p>{flavor.description}</p>
                        <p>Average Rating: {flavor.average_score}</p>
                    </div>
                ) : (
                    <p>Loading</p>
                )}
            </div>
            <div id="reviews-and-comments">

                {user && flavor && <>
                    {console.log(userReview)}
                    {userReview ? (
                        user && flavor && <Review setRefresh={setRefresh} review={userReview} token={token} editable={true} edit={false} />
                    ) : (
                        user && flavor && (

                            <Review
                                setRefresh={setRefresh}
                                editing={true}
                                user={user}
                                review={{ score: 0.0, content: "", user_id: user.id, flavor_id: flavor.id, id: 0 }}
                                token={token}
                                editable={true}
                            />
                        )
                    )}
                </> || <p>Login or register to create reviews!</p>}

                <div style={{ display: reviews ? "block" : "none" }}>
                    {reviews && reviews.map((review) => (
                        <Review setRefresh={setRefresh} key={review.id} user={user} review={review} token={token} />
                    ))}
                </div>

                <div style={{ display: reviews ? "none" : "block" }}>
                    <p>No Reviews</p>
                </div>
            </div>

        </div>
    );
}
