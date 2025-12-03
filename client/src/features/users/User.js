import { Link } from "react-router-dom"
import Card from "../../components/Card"
import useAuth from "../../hook/useAuth"
import { useGetUserQuery } from "./userApiSlice"


const User = () => {
    const { username, userId } = useAuth()
    
    const {
        data: user,
        isLoading,
        error,
        isSuccess 
    } = useGetUserQuery({id:userId})
    

    if(isLoading) return <p>Loading...</p>

    if(error) return <p>Error: {error.message}</p>

    if(isSuccess) {
        console.log("user.viewed")
        console.log(user.viewed)
        const newArray = [...user.viewed]
        newArray.sort((a, b) => 
            new Date(b.watchDate).getTime() - new Date(a.watchDate).getTime());
        
        let displyArray 
        if(newArray?.length > 3) {
            displyArray = newArray.slice(0,3)
        } else{
            displyArray = newArray
        }
        console.log(displyArray);
        return (
            <div className="user__container">
                <div className="user__info">
                    <h1>Hello, {user.username}</h1>
                    <h2>profile: </h2>
                    <p>Email: {user.email}</p>
                    <p>
                    
                    </p>
                    <button> Edit profile </button>
                </div>
                { newArray?.length > 0 ? <div className="user__viewed">
                    <h3>Watched: </h3>
                    <div style={{display:"flex"}}>
                        <div className='user__viewed--row'>
                        {displyArray.map(
                            view=>(
                                <Card type="sm"
                                key={view._id} id={view.videoId} />
                            )
                        )}
                        </div>
                        { newArray?.length > 3 ? <Link style={{fontSize:"30px",
                             marginLeft:"10px"}}> Show More</Link> : " "}
                    </div>
                    
                </div> : <span style={{height:"80px", marginTop:"50px", fontSize:"30px"}}
                >No videos watched</span>}

                <div className="user__saved">
                    <h3>Saved videos: </h3>
                    <div className='user__viewed--row'>
                    {user.saved.map(
                        id=>(
                            <Card type="sm"
                            key={id} id={id} />
                        )
                    )}
                    </div>
                    
                </div>
            </div>
        )
    }
    
}


export default User