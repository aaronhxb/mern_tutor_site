import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useUploadVideoMutation } from "./videoApiSlice"
import useAuth from "../../hook/useAuth"
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import app from "../../firebase"
import { TAGS } from "../../config/tags";

const UploadVideo = ({ setOpen }) => {

    const { userId } = useAuth()

    const [title, setTitle] = useState('')
    const [des, setDes] = useState('')
    const [image, setImage] = useState(undefined)
    const [video, setVideo] = useState(undefined)
    const [imgPerc, setImgPerc] = useState(0)
    const [videoPerc, setVideoPerc] = useState(0)
    const [videoUrl, setVideoUrl] = useState('')
    const [imgUrl, setImgUrl] = useState('')
    //const [inputs, setInputs] = useState({})
    const [tags, setTags] = useState([])

    const navigate = useNavigate()

    const [ uploadVideo, {
        isLoading, 
        error, 
    }] = useUploadVideoMutation()

    /*const handleChange = (e) => {
        setInputs((prev) => {
            return { ...prev,
                [e.target.id]: e.target.value
            }
        })
    }*/
   //console.log(inputs)
   const canUpload = [ title, des, userId ].every(Boolean) 
   && videoPerc === 100 && imgPerc === 100 && !isLoading && 
   tags.length == 1
    
    const uploadToFirebase = (file, urlType) => {
        const storage = getStorage(app)
        const fileName = new Date().getTime() + file.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              urlType === "img_url" ? setImgPerc(Math.round(progress)) : setVideoPerc(Math.round(progress));
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
                default:
                  break;
              }
            },
            (error) => {},
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                urlType === "video_url" ? setVideoUrl(downloadURL) : setImgUrl(downloadURL);
              });
            }
        )
    }

    useEffect(()=>{
        video && uploadToFirebase(video, "video_url")
    },[video])

    useEffect(()=>{
        image && uploadToFirebase(image, "img_url")
    },[image])



    if(isLoading) return <p>Uploading...</p>

    if(error) return <p>ERROR: {error.message}</p>

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(canUpload) {
            const video = await uploadVideo({ 
                user: userId, tags, title, 
                description: des, 
                video_url: videoUrl, img_url: imgUrl  })
            if(video) {
                setTitle('')
                setDes('')
                setTags([])
                setImage(undefined)
                setVideo(undefined)
                setImgPerc(0)
                setVideoPerc(0)
                setVideoUrl('')
                setImgUrl('')
                setOpen(false)
                navigate(`/Video/${video.data._id}`)
            }
        }
        
    }

    const onTagsChange = (e) => {
        const values = Array.from(
            e.target.selectedOptions, //HTMLCollection 
            (option) => option.value
        )
        setTags(values)
        console.log(tags)
    }
    const options = TAGS.map(tag => {
        return (
            <option
                key={tag}
                value={tag}
            > {tag}</option >
        )
    })
    return (
        <div className="upload__container">

        <div className="upload__wrapper">
            <h1 style={{textAlign:"center"}}>
                Upload a new video</h1>
            <div className="close"
                onClick={()=>setOpen(false)}>X</div>
            

            <form className="form" onSubmit={handleSubmit}>
                <label className="form__label"> Title: 
                    <input 
                    className="form__input"
                    id="title"
                    type="text"
                    placeholder="title"
                    onChange={e=>setTitle(e.target.value)}
                    />
                </label>
                <label className="form__label"> description: 
                    <input 
                    className="form__input"
                    id="description"
                    type="text"
                    placeholder="description"
                    onChange={e=>setDes(e.target.value)}
                    />
                </label>
                <label className="form__label"> Image: 
                    <input 
                    className="form__input"
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={e=>setImage(e.target.files[0])}
                    />
                </label>
                <label className="form__label"> Video: 
                    { videoPerc > 0 ? (
                        "Uploading:" + videoPerc + "%"
                        ) : (<input 
                            className="form__input"
                            id="videoUrl"
                            type="file"
                            accept="video/*"
                            onChange={e=>setVideo(e.target.files[0])}
                            />) }
                </label>
                <label className="form__label"> tags: 
                
                    <select className="form__select"
                        id="tags"
                        name="tags"
                        multiple={true}
                        value={tags}
                        onChange={onTagsChange}
                    >
                        {options} 
                    </select>
                
                </label>
                
                <input 
                    className="form__submit"
                    type="submit" 
                    disabled={!canUpload} 
                    value="Upload"
                />
            </form>

        </div>
        </div>
    )
}

export default UploadVideo