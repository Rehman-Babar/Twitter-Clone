// import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
// import useFollow from "../../hooks/useFollow";
// import LoadingSpinner from "./LoadingSpinner";
import UsersForRightPanel from "./UsersForRightPanel";

const RightPanel = () => {
	const {data:suggestedUser, isLoading} =useQuery({
		queryKey:["suggestedUser"],
		queryFn:async() => {
			try {
				const res =await fetch('/api/users/suggested')
				const data =await res.json();
				if (data.error) {
					toast.error(data.error)
					console.log(data.error)
				}
				return data;
			} catch (error) {
				throw new Error(error)
			}
		}
	})
	// const {follow, isPending} = useFollow()
	if (suggestedUser?.length === 0) return <div className="md:w-64 sm:w-0"></div>
	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						suggestedUser?.map((user) => (
							<UsersForRightPanel key={user?._id} user={user}/>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;