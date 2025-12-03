import { selectVideoById } from "../features/videos/videoApiSlice"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const Card = ({ id, type }) => {
    const video = useSelector(state=>selectVideoById(state,id))
    //console.log(user)

    console.log(video)
    const cardClass = type === "sm" ? "card__sm" : "card"
    if(!video) {
        return <p>Video not available</p>
    }

    return (
        <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
            <div className={cardClass}>
                <img className="card__image" src={video.img_url}/>
                <div className="card__info">
                    <h1 className="card__title">{video.title}</h1>
                    <h2 className="card__username">{video.username}</h2>
                    {type!=="sm" ? <p>{video.views} views</p> : 
                        "" }                  
                </div>s
            </div>
      </Link>
    )
}

export default Card