import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Review from "../components/reviews";

const flavor = {
    name: "Original Doctor Pepper",
    description: "It's the sweetest one you'll ever taste in your life!!!",
    score: 5,
    photo_url: "https://i5.walmartimages.com/seo/Doctor-Pepper-Soda-12oz-Cans-Pack-of-48_f311a391-8c1c-4b38-b7f7-788d26359f44.4eb13d8fade9191d2c4f05fdc7cca03f.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF"
}

const testReviews = [
    {
        id: 1,
        username: "Jessie",
        flavor: flavor.name,
        score: 5,
        content: "Wow it's so good. Dr. pepper is the best!"
    },
    {
        id: 2,
        username: "Jared",
        score: 5,
        content: "Wow it's so good. Dr. pepper is the best!"
    },
    {
        id: 3,
        username: "Karl",
        flavor: flavor.name,
        score: 5,
        content: "Wow it's so good. Dr. pepper is the best!"
    },
    {
        id: 4,
        username: "Johnathan",
        score: 5,
        content: "Wow it's so good. Dr. pepper is the best!"
    }
]

export default function FlavorDetails({ user, token }) {
    const [reviews, setReviews] = useState(testReviews)
    const [flavor, setFlavor] = useState();
    const [userReview, setUserReview] = useState()
    const { flavor_id } = useParams();


    useEffect(() => {
        const fetchFlavor = async () => {
            try{
                const response = await fetch(`/api/flavor/${flavor_id}`, {
                    headers: {"Content-Type": "application/json"}   } );
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
    }, [])


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
                {reviews.length > 0 ? (
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
                                    <Review key={review.id} review={review} />
                                ))}
                            </>
                        )}
                    </>
                ) : (
                    <p>Sorry, no reviews were found</p>
                )}
            </div>
        </div>
    );
}
