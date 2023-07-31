import React from "react";
type TotalRatingProps = {
    ratingId: number;
    totalScore: number;
    isForCourse: boolean;
};
const TotalRating: React.FC<TotalRatingProps> = (props) => {
    const score = props.totalScore;
    const isForCourse = props.isForCourse;
    const ratingName = isForCourse ? "rating-total" : `rating-comment-${props.ratingId}`;
    return (
        <div className={`  rating ${isForCourse ? "rating-lg" : "rating-xs"} rating-half   `}>
            <input id="0" type="radio" name={ratingName} className="rating-hidden" checked />
            <input
                id="1"
                type="radio"
                name={ratingName}
                disabled
                className="bg-yellow-300 mask-star-2 mask-half-1"
                checked={score > 0}
            />
            <input
                id="2"
                type="radio"
                name={ratingName}
                disabled
                className="bg-yellow-300 mask-star-2 mask-half-2"
                checked={score > 0.5}
            />
            <input
                id="3"
                type="radio"
                name={ratingName}
                disabled
                className="bg-yellow-300 mask-star-2 mask-half-1"
                checked={score > 1}
            />
            <input
                id="4"
                type="radio"
                name={ratingName}
                disabled
                className="bg-yellow-300 mask-star-2 mask-half-2"
                checked={score > 1.5}
            />
            <input
                id="5"
                type="radio"
                name={ratingName}
                disabled
                className="bg-yellow-300 mask-star-2 mask-half-1"
                checked={score > 2}
            />
            <input
                id="6"
                type="radio"
                name={ratingName}
                disabled
                className="bg-yellow-300 mask-star-2 mask-half-2"
                checked={score > 2.5}
            />
            <input
                id="7"
                type="radio"
                name={ratingName}
                disabled
                className="bg-yellow-300 mask-star-2 mask-half-1"
                checked={score > 3}
            />
            <input
                id="8"
                type="radio"
                name={ratingName}
                disabled
                className="bg-yellow-300 mask-star-2 mask-half-2"
                checked={score > 3.5}
            />
            <input
                id="9"
                type="radio"
                name={ratingName}
                disabled
                className="bg-yellow-300 mask-star-2 mask-half-1"
                checked={score > 4}
            />
            <input
                id="10"
                type="radio"
                name={ratingName}
                disabled
                className="bg-yellow-300 mask-star-2 mask-half-2"
                checked={score > 4.5}
            />
        </div>
    );
};
export default TotalRating;
