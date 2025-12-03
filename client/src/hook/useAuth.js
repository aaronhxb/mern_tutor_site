import { useSelector } from "react-redux"
import { jwtDecode } from "jwt-decode"

const useAuth = () => {
    const token = useSelector(state=>state.auth.token)
    
    if(token){
        const { username, userId } = jwtDecode(token)
        return { username, userId }
    }
    
    return { username:'', userId:'' }
}

export default useAuth