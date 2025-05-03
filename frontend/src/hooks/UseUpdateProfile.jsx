import { useMutation, useQueryClient } from "@tanstack/react-query"

const useUpdateProfile = () => { 
    const queryClient = useQueryClient()
    const { mutate: updateUserProfile, isPending: isUpdatingProfile} = useMutation({
		mutationFn: async (fromData) => {
			try {
				const res = await fetch(`/api/v1/users/update`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(fromData),
				});
				const data = await res.json();
				if (!res.ok || data.error) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["authUser"] }),
				queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
				queryClient.invalidateQueries({ queryKey: ["posts"] }),	
			])
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});
    return { updateUserProfile, isUpdatingProfile };
 }

export default useUpdateProfile