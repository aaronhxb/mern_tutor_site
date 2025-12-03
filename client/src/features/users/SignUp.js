import { useEffect, useRef, useState } from "react"
import { useAddNewUserMutation } from "./userApiSlice"
import { useNavigate } from "react-router-dom"
import { useSignInMutation } from "../auth/authApiSlice"
import { useDispatch } from "react-redux"
import { signIn } from "../auth/authSlice"

const SignUp = () => {

    const [ addNewUser, { 
        isSuccess,
        error
    }] = useAddNewUserMutation()
    const [ Login ] = useSignInMutation()

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const errRef = useRef()

    const [errMsg, setErrMsg] = useState('')
    const [ username, setUsername ] = useState('')
    const [ password, setPwd ] = useState('')
    const [ email, setEmail ] = useState('')

    
    const handleSubmit = async(e) => {
        e.preventDefault()
        await addNewUser({ username, email, password })
    }

    
    const canSave = [ username, email, password ].every(Boolean) 

    useEffect(()=>{
        const autoLogIn = async()=>{
            const { accessToken } = await Login({ username, password }).unwrap()
            dispatch(signIn({ accessToken }))
            setUsername('')
            setEmail('')
            setPwd('')
            navigate('/')
        }
        if(error) {
            setErrMsg(error?.data?.message);
        }
        if(isSuccess){
            autoLogIn()
        }
    }, [isSuccess, error, navigate])

    
    return (
        <div className="signin_container">
            <h1 style={{ textAlign:"center" }}>SIGN UP</h1>
            <p ref={errRef} className="errmesssage" aria-live="assertive">{errMsg}</p>
            <form className="form" onSubmit={handleSubmit}>
                <label className="form__label"> username: 
                    <input 
                        className="form__input"
                        type="username"
                        autoComplete="off"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                    />
                </label>
                <label className="form__label"> email: 
                    <input 
                        type="email"
                        className="form__input"
                        autoComplete="off"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                </label>
                <label className="form__label"> password: 
                    <input 
                        type="password"
                        className="form__input"
                        autoComplete="off"
                        value={password}
                        onChange={(e)=>setPwd(e.target.value)}
                    />
                </label>
                <input className="form__submit" 
                disabled={!canSave}
                type="submit" value={"Submit"}/> 
            </form>
            
        </div>
    )


}

export default SignUp