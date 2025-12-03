import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { useSignInMutation, useGoogleAuthMutation } from "./authApiSlice"
import { useDispatch } from "react-redux"
import { signIn } from "./authSlice"
import { auth, provider } from "../../firebase"
import { signInWithPopup } from "firebase/auth"
import usePersist from "../../hook/usePersist"

const SignIn = () =>{

    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const errRef = useRef()
    const location = useLocation()

    const [errMsg, setErrMsg] = useState('')
    const [persist, setPersist] = usePersist()

    const [ Login, {
        isLoading,
    } ] = useSignInMutation()
    const [ googleLogin, {isLoadingGoogle} ] = useGoogleAuthMutation()

    const canSubmit = [ username, password ].every(Boolean) && !isLoading

    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const { accessToken } = await Login({ username, password }).unwrap()
            dispatch(signIn({ accessToken }))
            setUsername('')
            setPassword('')
            navigate(location?.state?.from)
        } catch (err) {
            if (!err.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg(err.data?.message);
            }
            errRef.current.focus();
        }
    }

    const signInWithGoogle = async () => {
        provider.setCustomParameters({ prompt: 'select_account' });
        signInWithPopup(auth, provider)
            .then(async(result)=>{
                console.log(result.user.displayName)
                console.log(result.user.email)
                const { accessToken } =  await googleLogin({ 
                    username: result.user.displayName, 
                    email: result.user.email
                }).unwrap()
                dispatch(signIn({ accessToken }))
                setUsername('')
                setPassword('')
                navigate(location?.state?.from)
        })
    }

    return (
    <>
        <div className="signin_container">
            <h1 style={{ textAlign:"center" }}>SIGN IN</h1>
            
            <form className="form" onSubmit={handleSubmit}>
                <label className="form__label"> username: 
                    <input
                        type="text"
                        className="form__input"
                        id="username"
                        autoComplete="off"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                    />
                </label>
                <label className="form__label">password: 
                    <input 
                    className="form__input"
                    id="password"
                    type="password"
                    autoComplete="off"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    />
                </label>
                <input className="form__submit" 
                    
                    type="submit" 
                    value={"Login"}
                />
                <label>
                    <input
                    type="checkbox"
                    onChange={()=>setPersist(prev=>!prev)}
                    checked={persist}
                    />
                    Remember me
                </label>
            </form>
            <p ref={errRef} className="errmesssage" aria-live="assertive">{errMsg}</p>
            <div className="signup__content">
                <button className="google__signin" 
                onClick={signInWithGoogle}>Sign in with Google account</button>
                <button className="signup__button" 
                    onClick={() => navigate(`/signin/signup`)}
                    >Sign Up</button>
                <span style={ {fontSize: "16px", padding: "8px", 
                    textAlign: "center"
                } }>Sign up if you do not have an account.</span>
            </div>
            <div>
                
                   
            </div>
        </div>
        
     </>
    )
}

export default SignIn