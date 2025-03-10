import React, { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import commentpic from "../public/comment.png";
import { AccountCircle, CommentRounded } from "@mui/icons-material";
import "../styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { commentinterface } from "@/interfaces/commentinterface";
import Comment from "./Comment";
import cookie from "js-cookie";
import { useEffect } from "react";
import { userinterface } from "@/interfaces/userinterface";
import { Console } from "console";
import { handleLikeUtil, handleUnlikeUtil } from "@/apicalls/apicalls";
interface commentswithrefreshtoken extends commentinterface {
  refresh_token: string;
  compontenttype: string;
}
function SingleComment({
  _id,
  content,
  user,
  commentimage,
  refresh_token,
  compontenttype,
  replies,
  likes,
}: commentswithrefreshtoken) {
  const router = useRouter();
  const [comment, setcomment] = useState("");
  const [liked, setLiked] = useState<Boolean>(
    likes?.includes(user?._id.toString())
  ); //look from prop
  const [likedCount, setLikedCount] = useState<number>(likes?.length);
  const [commentCount, setCommentCount] = useState<number>(replies?.length);
  const [reply, setreply] = useState(false);
  ///check if the user has liked it or not previously ,do it while fetching the data in the backend check for the user requesting data lies in each of the posts liked array if liked then set liked state as true default & vice versa
  //or you can check it infront end with
  const topassuserinfo = {
    _id: user?._id,
    username: user.username,
    userid: user._id,
    lastName: user.lastName,
    firstName: user.firstName,
  };
  const handleLike = async () => {
    try {
      const response = await handleLikeUtil(_id, user._id, refresh_token);
      response?.status == 200 && setLiked(true);
      response?.status == 200 && setLikedCount((prev) => prev + 1);
    } catch (err) {}
  };
  const handleUnlike = async () => {
    const response = await handleUnlikeUtil(_id, user._id, refresh_token);
    response?.status == 200 && setLiked(false);
    response?.status == 200 && setLikedCount((prev) => prev - 1);
  };
  return (
    <div className="" style={{ width: "700px" }}>
      <div className="post__wrapper bg__black    flex rounded-lg gap-3 pl-2 pr-2 pb-2 pt-2 ">
        <div
          style={{ objectFit: "cover" }}
          className="profile__pic__content flex gap-3"
        >
          <div className="">
                          <AccountCircle className="w-12 h-12"/>
            
          </div>
          <div className="content__section flex flex-col gap-3 ">
            <div className="profilename flex flex-col gap-1  ">
              <h1 className="font-semibold text-xl ">
                {user.firstName} {user.lastName}
              </h1>
              <p
                className="font-ubuntu "
                style={{ fontSize: "18px", fontWeight: "200" }}
              >
                {content}
              </p>
              {/** TODO feature comments with images/ */}
              {/* {commentimage && (
                <div className="py-2 max-w-fit  ">
                  <Image className="rounded" src={post} alt="postimage"></Image>
                </div>
              )} */}
            </div>
            <div className="comment__details flex gap-4">
              <div className="comment flex items-center gap-2">
                {liked ? (
                  <div>
                    <FavoriteIcon
                      onClick={() => {
                        handleUnlike();
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    <FavoriteBorderIcon onClick={() => handleLike()} />
                  </div>
                )}
                <h1
                  className=" text-sm font-ubuntu "
                  style={{ color: "#8B8B8B" }}
                >
                  Like {likedCount}
                </h1>
              </div>
              {compontenttype !== "reply" && compontenttype !== "notes" && (
                <div
                  onClick={() => setreply((prev) => !prev)}
                  className="comment icon cursor-pointer  flex items-center gap-2"
                >
                  <CommentRounded/>
                  <h1
                    className="  text-sm font-ubuntu "
                    style={{ color: "#8B8B8B" }}
                  >
                    Reply {replies.length}
                  </h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {reply && (
        <div className="replies__section">
          <Comment
            compontenttype={"reply"}
            refid={_id}
            userinfo={topassuserinfo}
            refresh_token={refresh_token}
          />
        </div>
      )}
      {comment != "" && (
        <div className="flex ml-auto gap-5 font-ubuntu max-w-fit mb-3">
          <button
            onClick={() => setcomment("")}
            className="  flex justify-center items-center  px-3 py-1 rounded-3xl "
            style={{ backgroundColor: "#115e59" }}
          >
            Cancel
          </button>
          <button
            // onClick={makecomment}
            style={{ backgroundColor: "#4f46e5      " }}
            className="  flex justify-center items-center  px-3 py-1 rounded-3xl "
          >
            Reply
          </button>
        </div>
      )}
    </div>
  );
}
export default SingleComment;
