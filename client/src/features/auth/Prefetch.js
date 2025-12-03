import { store } from "../../app/store"
import { userApiSlice } from "../users/userApiSlice"
import { videoApiSlice } from "../videos/videoApiSlice"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"

const Prefetch = () =>{
    useEffect(()=>{
        console.log("Subscribing")
        const videos = store.dispatch(videoApiSlice.endpoints.getVideos.initiate())

        return(()=>{
            console.log("Unsubcribing")
            videos.unsubscribe()
        })
    },[])

    return <Outlet />
}

export default Prefetch