import { Link } from 'react-router-dom'
import { useGetVideosQuery } from "../features/videos/videoApiSlice"


import { useSelector } from "react-redux"
import { selectAllVideos } from '../features/videos/videoApiSlice'
import Card from './Card'

const Home = () => {
    const {
        data: videos,
        isLoading,
        error,
        isSuccess
    } = useGetVideosQuery()

    if(isLoading) return <p>Loading...</p>

    if(error) {
        if(error?.status === 400){
            return (
                <div>
                    <p>No videos found...</p>
                </div>
        )
        } else{
            return (
                <div>
                <p>OOPS, Something is wrong...</p>
            </div>
            )
        }
    }

    if(isSuccess) {
        //return <p><Link to="/Users">Users List</Link></p>
        return (
            <div className='home'>
                <div className='home__row'>
                    {videos.ids.map(id=>(<Card key={id} id={id} />))}
                </div>
            </div>
            
        )
    }
}
export default Home

