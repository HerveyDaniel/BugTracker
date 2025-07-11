import './NavBar.css'
import { Link } from 'react-router-dom'
import useAuth from '../../Hooks/useAuth'


export const NavBar = () => {
    const { auth } : any = useAuth();
    const currentUser = auth?.username;
    const { setAuth } : any = useAuth();
    const authRole = ["ADMIN"];

    const logout = () => {
        setAuth({});
    }

    return (
        <div className="headerBar">
            <div className="linkContainer">
                <Link to='/home' className='link'>Home</Link>
                <Link to='/projects' className='link'>Projects</Link>
                <Link to='/tickets' className='link'>Tickets</Link>
                {auth?.userRoles?.find((role : any) => authRole.includes(role))
                    ? <Link to='/admin' className='link'>Admin</Link>
                    : <div></div>
                    }
            </div>
            <div className="projectName">
                <h2>Bug Tracker</h2>
            </div>
            <div className="logoutContainer">
                <div className="displayUser">Hello, {currentUser}</div>
                <button className="logoutButton" onClick={logout}>Logout</button>
            </div>
        </div>
    )
}
