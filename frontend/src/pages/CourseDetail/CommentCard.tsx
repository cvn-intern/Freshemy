import React from "react";
import { TotalRating } from "@src/components";
import { RatingResponse } from "../../types/course";
import { DefaultAvatar } from "@src/assets";
type CommentCardProps = {
    rating: RatingResponse;
};
const CommentCard: React.FC<CommentCardProps> = (props) => {
    const date = props.rating.created_at.split(" ");
    return (
        <div>
            <div className={` flex items-center justify-between w-full rounded-lg my-0 `}>
                <div className="avatar mr-1">
                    <div className=" items-center justify-between w-14 rounded-full">
                        <img alt="1" src={(props.rating.url_avatar as string) || DefaultAvatar} />
                    </div>
                </div>
                <div className={`w-full py-2 px-6 h-full  bg-primary rounded-lg my-1 `}>
                    <div className="flex justify-between">
                        <p className="comment-author mb-1 font-bold">
                            {props.rating.first_name} {props.rating.last_name}
                        </p>
                        <p className="comment-date mb-1 italic">{date[1] + " " + date[2] + " " + date[3]}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="comment w-full flex flex-wrap line-height:1.5 max-height:1.5 ">
                            {props.rating.content}
                        </p>
                        <TotalRating ratingId={props.rating.id} totalScore={props.rating.ratings} isForCourse={false} />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CommentCard;
