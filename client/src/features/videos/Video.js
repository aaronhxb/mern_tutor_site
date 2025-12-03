import { useLocation, useNavigate } from "react-router-dom"
import useAuth from "../../hook/useAuth"
import { useDeleteVideoMutation, useGetVideoQuery } from "./videoApiSlice"
import { useEffect, useState } from "react"
import { useSavedForLaterMutation, useUpdateViewedMutation } from "../users/userApiSlice"



const Video = () => {

  const { username, userId } = useAuth()

  const id = useLocation().pathname.split('/')[2]

  const date = new Date()
  console.log(`date is ${date}`)
  console.log(date.getTime())
  
  console.log(`path is ${id}`)
  

  const {
    data,
    isLoading,
    error,
    isSuccess
  } = useGetVideoQuery({id})

  const [
    deleteVideo, {
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror
  }] = useDeleteVideoMutation()

  const [
    update, {
      isSuccess: isUpdateViewSuccess
  }] = useUpdateViewedMutation()

  const [
    save, {
      error:savedError,
      isSuccess: isSaveSuccess,
  }] = useSavedForLaterMutation()

  useEffect(()=>{
    const updateViewed = async() => {
      await update({userId, videoId:id, date})
    }
    if(userId){
      updateViewed()
    }
  },[userId, id, update])

  useEffect(()=>{
    if(savedError){
      if(savedError?.status === 400) {
        alert(savedError?.data.message)
      }
    }
    if(isSaveSuccess){
      alert("Successfully saved")
    }
  }, [savedError, isSaveSuccess])

  const navigate = useNavigate()
  

  if(isDelSuccess){
    navigate('/')
  }

  const handleDelete = async() => {
    await deleteVideo({id})
  }

  const handleSave = async() => {
    await save({ userId, videoId: id })
  }

  if(isLoading) return <p>Loading...</p>

  if(error) return <p>Error: {error.message}</p>

  if(isSuccess) {
    console.log('data')
    console.log(data)
    console.log(`username is ${username}`)
    console.log(`userId is ${userId}`)
    console.log(`data _id is ${data._id}`)
    console.log(`id is ${id}`)
    return ( 
      <div className="video__container">
        <h1 className="video__title">{data.title}</h1>
        <video className="video__frame"
          src={data.video_url}
          controls
        />
        <h2 className="video__user">Instructor: {data.username}</h2>
        <div className="video__details">
          <span>{data.views} views</span>
          {userId ? (
            <button className="video__button"
            onClick={handleSave}
            >Save</button>)
          : (<span></span>)
          }
          
        </div>
        
        <p>Course description:  {data.description}</p>
      
        <div>
        <div>
          {userId!==data.user ? null :
          (
            <div>
               <button>Edit</button>
               <button onClick={handleDelete}>Delete</button>
            </div>
          )}
           
          </div>
        </div>
      </div>
    )
  }
}

export default Video