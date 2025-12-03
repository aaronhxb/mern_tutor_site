import { useSelector } from "react-redux"
import usePersist from "../../hook/usePersist"
import { useEffect, useRef, useState } from "react"
import { useRefreshMutation } from "./authApiSlice"
import { Link, Outlet } from "react-router-dom"

const PersistLogIn = () => {

    const [persist] = usePersist()
    const token = useSelector(state=>state.auth.token)
    //const effectRan = useRef()

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [ refresh,{
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()

    useEffect(()=>{
        /*if (effectRan.current === true || 
            process.env.NODE_ENV !== 'development') {}*/

        const verifyRefreshToken = async() =>{
            try{
                await refresh()
                setTrueSuccess(true)
            } catch(err) {
                console.log(err)
            }
        }
        if (!token && persist) verifyRefreshToken()
    },[])

    if(!token ) {
        console.log('no token')
        return <Outlet />
    }

    if (!persist) {
        console.log('no persist')
        return <Outlet />
    }

    if (isLoading) {
        console.log('loading')
        return <p>Loading...</p>
    }

    if (token || isUninitialized) {
        console.log('token and uninit')
        console.log(isUninitialized)
        return <Outlet />
    }

    if (isError) {
        console.log('error')
        return (<p className="errmesssage">
            {`${error?.data?.message}  `}
            <Link to="signIn">Please Sign In </Link>
        </p>)
    }

    if (isSuccess && trueSuccess) {
        console.log('success')
        return <Outlet />
    }

    
}

export default PersistLogIn 