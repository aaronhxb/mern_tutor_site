import { Link, useLocation } from "react-router-dom"
import { useGetTagQuery } from "../features/videos/videoApiSlice"
import Card from "./Card"


const Tag = () => {

  const tag = useLocation().search

  const {
    data,
    isLoading,
    error,
    isSuccess
  } = useGetTagQuery({tag})

  if(isLoading) return <p>Loading...</p>

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

  if(isSuccess) {
    return (
      <div className='home'>
          <div className='home__row'>
              {data.ids.map((id)=><Card key={id} id={id} />)}
          </div>
      </div>
  )
  }
}

export default Tag