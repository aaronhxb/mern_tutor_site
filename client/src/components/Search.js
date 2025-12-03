import { Link, useLocation } from "react-router-dom"
import { useSearchVideosQuery } from "../features/videos/videoApiSlice"
import Card from "./Card"


const Search = () => {

    const query =  useLocation().search
    console.log(query)
    const {
        data,
        isLoading,
        error,
        isSuccess 
    } = useSearchVideosQuery({query})

    if (isLoading) return <p>Loading...</p>

    if(error) {
        if(error?.status === 400){
            return (
                <div>
                    <p>No videos found...</p>
                    <Link to='/' style={{ textDecoration: "none" }}>
                        Go Home</Link>
                </div>
        )
        } else{
            return (
                <div>
                <p>OOPS, Something is wrong...</p>
                <Link to='/' style={{ textDecoration: "none" }}>
                    Go Home</Link>
            </div>
            )
        }
    }


    if(isSuccess){
        console.log(data)
        return (
            <div className='home'>
                <div className='home__row'>
                    {data.ids.map((id)=><Card key={id} id={id} />)}
                </div>
            </div>
        )
    }

}

export default Search