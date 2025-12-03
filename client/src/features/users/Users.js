import { useGetUsersQuery } from "./userApiSlice";
import User from './User'

const Users = () => {

    const {
        data: users,
        isLoading,
        isSuccess,
        error
    } = useGetUsersQuery()

    if(isLoading) return <p>Loading...</p>

    if(error) return <p>Error: {error.message}</p>

    if(isSuccess) {
        const { ids } = users
        //console.log(ids)
        
        return (ids.map(id=>(<User key={id} id={id}/>)))
        
    }
    
}

export default Users