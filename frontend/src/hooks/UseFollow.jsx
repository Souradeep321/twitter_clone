import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useFollow = () => {
    const queryClient = useQueryClient();
    const { mutate: followMutation, isPending } = useMutation({
        mutationFn: async ({ userId }) => {
            try {
                const res = await fetch(`/api/v1/users/follow/${userId}`, {
                    method: "POST",
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
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["suggestedUser"] }),
                queryClient.invalidateQueries({ queryKey: ["authUser"] }),
            ])
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return { followMutation, isPending };
};

export default useFollow;

