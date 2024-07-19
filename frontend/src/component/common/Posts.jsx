import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffect } from "react";

const Posts = ({ feedType, userName, id }) => {
  const getPostsEndPoints = () => {
    switch (feedType) {
      case "foryou":
        return "/api/posts/all";
      case "posts":
        return userName ? `/api/posts/getPosts/${userName}` : null;
      case "likes":
        return `/api/posts/getLikes/${id}`;
      case "following":
        return "/api/posts/following";
      default:
        return "/api/posts/all";
    }
  };

  const PostsEndPoints = getPostsEndPoints();

  const { data: posts = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      if (!PostsEndPoints) return [];
      try {
        const res = await fetch(PostsEndPoints);
        const data = await res.json();
        if (data.error) {
          console.log(data.error);
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    enabled: !!PostsEndPoints, // Only enable the query if PostsEndPoints is valid
  });

  useEffect(() => {
    if (PostsEndPoints) {
      refetch();
    }
  }, [feedType, refetch, userName]);

  return (
    <>
      {(isLoading || isFetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isFetching && posts.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && posts.length > 0 && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
