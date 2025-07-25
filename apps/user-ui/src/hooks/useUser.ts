import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";

const fetchUser=async()=>{
  const response=await axiosInstance.get('/api/logged-in-user');

  return response.data.user;
}

const userUser=()=>{
  const {data:user,isLoading,isError,refetch}=useQuery({
    queryKey:["user"],
    queryFn:fetchUser,
    staleTime:1000*60*5,
    retry:1
  })

  return {user,isLoading,isError,refetch};
}

export default userUser;