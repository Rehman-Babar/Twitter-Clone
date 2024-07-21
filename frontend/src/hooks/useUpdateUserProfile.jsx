import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


const useUpdateUserProfile = () => {

    const queryQlient = useQueryClient()

	const {data:updatedUser, mutateAsync:UpdateMutation,isPending} = useMutation({
		mutationFn: async (formData) => {
			try {
				const res = await fetch('/api/users/update', {
					method:"Post",
					headers:{
						"Content-Type":"application/json"
					},
					body:JSON.stringify(formData)
				})
				const data = await res.json();
				if (data.error) {
					toast.error(data.error)
				}
				
				return data
			} catch (error) {
				throw new Error(error)
			}
		},
		onSuccess: (data) =>{
			toast.success("Profile Updated successfully")
			Promise.all([
				queryQlient.invalidateQueries({queryKey:["userProfile"]}),
				queryQlient.invalidateQueries({queryKey:["posts"]}),
				queryQlient.invalidateQueries({queryKey:["authUser"]})
			])
		}
	})
    return {UpdateMutation, isPending}

}

export default useUpdateUserProfile