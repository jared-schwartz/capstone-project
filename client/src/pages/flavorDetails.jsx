import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Review from "../components/reviews";

const testFlavor = {
    name: "Original Doctor Pepper",
    description: "It's the sweetest one you'll ever taste in your life!!!",
    score: 5,
    photo_url: "https://i5.walmartimages.com/seo/Doctor-Pepper-Soda-12oz-Cans-Pack-of-48_f311a391-8c1c-4b38-b7f7-788d26359f44.4eb13d8fade9191d2c4f05fdc7cca03f.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF"
}

const testReviews = [
    {
        id: 1,
        username: "Jessie",
        flavor: testFlavor.name,
        score: 5,
        content: "Wow it's so good. Dr. pepper is the best!"
    },
    {
        id: 2,
        username: "Jared",
        flavor: testFlavor.name,
        score: 5,
        content: "Wow it's so good. Dr. pepper is the best!"
    },
    {
        id: 3,
        username: "Karl",
        flavor: testFlavor.name,
        score: 5,
        content: "Wow it's so good. Dr. pepper is the best!"
    },
    {
        id: 4,
        username: "Johnathan",
        flavor: testFlavor.name,
        score: 5,
        content: "Wow it's so good. Dr. pepper is the best!"
    }
]

export default function FlavorDetails({ user, setUser, token, setToken }) {
    const [reviews, setReviews] = useState(testReviews)
    const [userReview, setUserReview] = useState()


    useEffect(() => {
        //Get the current user's id
        const name = "Karl"


        if (name) {
            // Check if the user has already posted a review
            const foundReview = reviews.find((review) => review.username === name);
            if (foundReview) {
                setUserReview(foundReview); // Save user's review
                setReviews(reviews.filter((review) => review.username !== name)); // Filter out the user's review
                console.log("Found the review!", foundReview)
            } else {
                setReviews(reviews);
                console.log("Did not find the review!")
            }
        }
    }, [])


    return (
        <div id="flavorsDetailsPage">
            <div class="split-view">
                <div>
                    <p>{testFlavor.name}</p>
                    <img src={testFlavor.photo_url} />
                </div>
                <div>
                    <p>{testFlavor.description}</p>
                    <p>Average Rating: {testFlavor.score}</p>
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