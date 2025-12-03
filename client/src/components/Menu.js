import { Link, Outlet, useLocation } from "react-router-dom"
import logo from "../img/tutoring.png"
import useAuth from "../hook/useAuth"
import { useLogOutMutation } from "../features/auth/authApiSlice"
import { useEffect, useState } from "react"
import { TAGS } from "../config/tags"


const Menu = () => {

  const  {username,userId} = useAuth()
  const location = useLocation()
  const [showMore, setShowMore] = useState(false)
  const [tags,setTags] = useState(TAGS.slice(0,3))

  const [
    logOut, {
        isLoading,
        error,
        isSuccess
    }] = useLogOutMutation()

  const handleShowMoreButton = () =>{
    if(!showMore) {
      setTags(TAGS)
    }else{
      setTags(TAGS.slice(0,3))
    }
    setShowMore(!showMore)
  }

  useEffect(()=>{
    if (isLoading){
      return <p>Loading...</p>
    }
    if(error){
      return <p>Error: {error.message}</p>
    }  
    if (isSuccess){
      return <Outlet />
    }
  },[])

  return (
    <div className="menu__container">
       <div className="logo">
          <Link to="/">
              <img height="100px" src={logo} />
          </Link> 
        </div>
        <div className="menu__item">
          {!username ? (
           <Link 
           to='/signin'
           id="link_Styles"
           state={{ from: location.pathname }}
           style={{ textDecoration: "none" }}>
            SIGN IN</Link>  
          ) : (
            <div  className="menu__user--item">
              <h2>Welcome: {username} </h2>
              <p>
                <Link to={`User/${userId}`} id="link_Styles"
                style={{ textDecoration: "none" }}>
                Account</Link>
              </p>
              <button 
                onClick={logOut}>sign out</button>
            </div>

          )}
        </div>
        <hr className="menu__hr">
        </hr>
        <Link to="/" 
        id="link_Styles"
        style={{ textDecoration: "none" }}>
          Home</Link> 
        <div>
        <ul className='menu__list'>
          {tags.map((tag)=>(
            <li className="menu__list-item">
             <Link to={`/tag?tag=${tag}`} 
             id="link_Styles"
             style={{ textDecoration: "none" }}>
             {tag}</Link>   
           </li>
         )) }
        </ul>
          <button onClick={handleShowMoreButton}>
          {showMore ? "show less" : "show more"}
          </button>
        </div>
        <hr className="menu__hr">
        </hr>
        <Link id="link_Styles"
             style={{ textDecoration: "none" }}>
        Online tutoring 
        </Link>
    </div>
  )
}

export default Menu