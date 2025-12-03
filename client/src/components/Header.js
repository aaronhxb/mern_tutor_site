import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hook/useAuth";
import { useState } from "react";
import Upload from "../features/videos/UploadVideo"

const Header = () => {

    const { username } = useAuth()
    const navigate = useNavigate()

    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')

    const handleSearchButton = () => {
        let content
        if(query) {
            content = query
            setQuery('')
            navigate(`/search?query=${content}`)
        }
    }

    return (
        <header className="header">
           
            <div className="header__search">
                <input className="header__searchInput" 
                type="search"
                placeholder="Search Video"
                value={query}
                onChange={e=>(setQuery(e.target.value))}
                />
                <button type="submit" className="search__button"
                onClick={handleSearchButton}
                >
                    search
                </button>
            </div>
            <div className="header__nav">
                { username ? (<div className="header__login">
                    <p>Welcome: {username}</p> 
                    <button onClick={() => setOpen(true)}>
                        Upload</button>
                    </div>) :
                 <Link id="link_Styles" to="SignIn" style={{ textDecoration: "none" }}>Sign in</Link>}
            </div>
            {open && <Upload setOpen={setOpen} />}
        </header>
    )
}

export default Header