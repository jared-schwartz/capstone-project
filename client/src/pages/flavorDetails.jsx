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
    const [reviews, setReviews] = useState(testReviews)
    const [userReview, setUserReview] = useState()
    const [flavorData, setFlavorData] = useState( {} )
    const { flavor_id } = useParams();
    let params = useParams();


  

    useEffect(() => {
    async function FetchData(id) {
        setFlavorData ( await FetchFlavor(id));
        console.log(flavorData);
    }
    FetchData(params.id);
        }, []);


    return (
        <div id="flavorsDetailsPage">
            <div class="split-view">
                <div>
                    <p>{flavorData}</p>
                    <p>ID: {flavor_id}</p>
                    <img src={singleFlavor.photo_url} />
                </div>
                <div>
                    <p>{singleFlavor.description}</p>
                    <p>Average Rating: {singleFlavor.score}</p>
                </div>
            </div>
            <div id="reviews-and-comments">
                {reviews ? (
                    <>
                        {console.log(reviews)}
                        {userReview ? (
                            <>
                                {console.log("Have the review!", userReview)}
                                <p>See your review</p>
                                <Review review={userReview} editable={true} edit={false} />
                                {reviews.map((review) => (
                                    <Review review={review} />
                                ))}
                            </>
                        ) : (
                            <>
                                {console.log("Don't have the review")}
                                <Review editing={true} review={{ score: 0.0, content: "" }} editable={true} />
                                {reviews.map((review) => (
                                    <Review review={review} />
                                ))}
                            </>
                        )

                        }
                    </>
                ) : <p>Sorry, no reviews were found</p>}
            </div>
        </div>
    )
}