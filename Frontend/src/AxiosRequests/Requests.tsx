import useAuth from "../Hooks/useAuth";
import Axios from "axios";
import { useQuery } from "@tanstack/react-query";

const { auth } : any = useAuth();
const token = auth?.jwt;

export const getAllUsers = async () => {
    const response : any = await Axios.get("http://localhost:8080/api/users",
        {
            headers: {'Authorization': `Bearer ${token}`}
        }
    );
    console.log(JSON.stringify(response?.data));
    return response?.data;
}

export const allusers : any = useQuery({
    queryKey : ["allUsers"],
    queryFn : getAllUsers
  })
