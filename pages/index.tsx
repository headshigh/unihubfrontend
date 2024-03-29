import React, { useEffect } from "react";
import Posts from "@/components/Posts";
import CreatePost from "@/components/CreatePost";
import { useDispatch } from "react-redux";
import { login } from "@/features/user";
import { useState } from "react";
import { fetchPosts } from "@/apicalls/apicalls";
import cookie from "js-cookie";
function Index() {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  let user = {};
    if(cookie.get('user')){
      var currentUser = JSON.parse(cookie.get("user") || "");
    }
    console.log(currentUser)
    {currentUser!=undefined && dispatch(
      login({
        username: currentUser.username,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        acess_token: cookie.get("acess_token"),
        refresh_token: cookie.get("refresh_token"),
        userid: currentUser.userid,
      })
    );}
  const [postsData, setPostsData] = useState();
  console.log(postsData);
  const fetchPostsUtility = async (userid: string, page: Number) => {
    const res = await fetchPosts(userid, page);
    setPostsData(res.msg);
  };
  return (
    <div className="min-h-screen ">
      <CreatePost />
      <Posts
        userid={ currentUser?currentUser.userId : ""}
        forSearch={false}
        forUser={false}
        forSaved={false}
      />
    </div>
  );
}
export default Index;
