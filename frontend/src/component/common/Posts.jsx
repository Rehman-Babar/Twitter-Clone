import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
// import { POSTS } from "../../utils/db/dummy.js";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffect } from "react";


const Posts = ({feedType}) => {

	const getPostsEndPoints = () => {
		switch(feedType) {
			case "foryou" :
				return "/api/posts/all";
			case "following":
				return "/api/posts/following";
			default :
				return "/api/posts/all";
		}
	}

	const PostsEndPoints = getPostsEndPoints()
	const {data:posts, isLoading, refetch, isFetching} = useQuery({
		queryKey:["posts"],
		queryFn:async () => {
			try {
				const res = await fetch(PostsEndPoints)
				const data = await res.json()
				if (data.error) {
					toast.error(data.error.message)
				}
				return data
			} catch (error) {
				throw new Error(error)
			}
		}
	})
	useEffect(() => {
		refetch();
	}, [feedType])
	return (
		<>
			{(isLoading || isFetching ) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isFetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && posts && (
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