import userModel from "../../../../../backend/src/models/user.model";
import { login,register } from "../service/auth.api";
import { setUser,setError,setLoading } from "../state/auth.slice";
import { useDispatch } from "react-redux";

export const useAuth=()=>{
 
    const dispatch =useDispatch()


    async function handleRegister({email,contact,password,fullname,isSeller=false}){

        const data = await register({email,contact,password,fullname,isSeller=false})

        dispatch(setUser(data.user))


    }

    return {handleRegister}


}