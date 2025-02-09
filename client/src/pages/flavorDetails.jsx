import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Review from "../components/reviews";
import { FetchFlavor } from "../components/FetchFlavor";

const singleFlavor = {
    name: "Jesse",
    description: "",
    score: "",
    photo_url: ""
}

const testReviews = [
    {
        id: 1,
        username: "Jessie",
        flavor: singleFlavor.name,
        score: 5,
        content: "Wow it's so good. Dr. pepper is the best!"
    },
    {
        id: 2,
        username: "Jared",
        flavor: singleFlavor.name,
        score: 5,
        content: "Wow it's so good. Dr. pepper is the best!"
    },
    {
        id: 3,
        username: "Karl",
        flavor: singleFlavor.name,
        score: 5,
        content: "Wow it's so good. Dr. pepper is the best!"
    },
    {
        id: 4,
        username: "Johnathan",
        flavor: singleFlavor.name,
        score: 5,
        content: "Wow it's so good. Dr. pepper is the best!"
    }
]

export default function FlavorDetails({ user, token }) {
    const [reviews, setReviews] = useState()
    const [flavor, setFlavor] = useState();
    const [userReview, setUserReview] = useState()
    const [flavorData, setFlavorData] = useState({})
    const { flavor_id } = useParams();
    let params = useParams();




    useEffect(() => {
        const fetchFlavor = async () => {
            try {
                const response = await fetch(`/api/flavor/${flavor_id}`, {
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
        console.log(token, user, "Revealing Important information")
        fetchFlavor();
    }, [])

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`/api/reviews/${flavor_id}`, {
                    headers: { "Content-Type": "application/json" }
                });
                if (!response.ok) throw new Error("Failed to fetch")
                const data = await response.json();
                console.log(data);
                setReviews(data)

            } catch (ex) {
                throw new Error("empty ");

            }
        }
        fetchReviews()
    }, [])

    useEffect(() => {
        const auth = async () => {
            try {

            } catch (ex) {
                throw new Error("empty")
            }
        }
    }, [reviews])

    return (
        <div id="flavorsDetailsPage">
            <div className="split-view">
                {flavor ? (
                    <div>
                        <p>{flavor.name}</p>
                        <p>ID: {flavor_id}</p>
                        <img src={flavor.photo_url} alt={flavor.name} />
                        <p>{flavor.description}</p>
                        <p>Average Rating: {flavor.average_Score}</p>
                    </div>
                ) : (
                    <p>Loading</p>
                )}
            </div>
            <div id="reviews-and-comments">
                {reviews ? (
                    <>
                        {userReview ? (
                            <>
                                <p>See your review</p>
                                <Review review={userReview} editable={true} edit={false} />
                                {reviews.map((review) => (
                                    <Review key={review.id} review={review} />
                                ))}
                            </>
                        ) : (
                            <>
                                <Review editing={true} review={{ score: 0.0, content: "" }} editable={true} />
                                {reviews.map((review) => (
                                    <Review review={review} />
                                ))}
                            </>
                        )}
                    </>
                ) : (
                    <p>Sorry could not find the review</p>
                )}
            </div>
        </div>
    );
}
