import { Outlet } from "react-router-dom";
import Header from "./Header";
import Menu from "./Menu";

const Layout = () => {
    return (
        <div className="container">
            <Menu />
            <div style={{flex:"8"}}>
                <Header />
                <div>
                    <Outlet />
                </div>
            </div>
        </div>
    )

}

export default Layout