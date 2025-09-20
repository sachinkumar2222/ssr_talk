import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../lib/api';
import toast from "react-hot-toast";
import { useSocketStore } from '../store/useSocketStore';


const useLogOut = () => {
    const queryClient = useQueryClient();
    const { disconnectSocket } = useSocketStore();

    const { mutate } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.setQueryData(["authUser"], null);

            toast.success("Logout successful");
            disconnectSocket();
        }
    });

    return { mutate };
};

export default useLogOut;