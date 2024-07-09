import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"




const useFollow = () => {

    const queryQlient =useQueryClient()

    const {mutate:follow, isPending} = useMutation({
        mutationFn:async (userId) => {
            try {
                const res =await fetch(`/api/users/follow/${userId}`, {
                    method:"Post"
                })
                const data =await res.json();
                if (data.error) {
                throw new Error(data.error)
                }
                toast.success(data.message)
                return data;
            } catch (error) {
                // console.log(error)
                throw new Error(error.message)
            }
        },
        onSuccess: () => {
            Promise.all([
                queryQlient.invalidateQueries({queryKey:["suggestedUser"]}),
                queryQlient.invalidateQueries({queryKey:["authUser"]})
            ])
        },
        onError: (error) => {
            toast.error(error.message)
        }
    });
    
    return {follow, isPending};

}

export default useFollow