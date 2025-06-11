import '../../Components/PageComponents/NavBar.css'
import { Link } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';


export const DemoNavBar = () => {
    const { auth } : any = useAuth();
    const currentUser = auth?.username;
    const { setAuth } : any = useAuth();
    const authRole = ["DEMOADMIN"];/* Temporary fix; find out how to get prop from App.tsx */

    const logout = () => {
        setAuth({});
    }

    return (
        <div className="headerBar">
            <div className="linkContainer">
                <Link to='/demohome' className='link'>Home</Link>
                <Link to='/demoprojects' className='link'>Projects</Link>
                <Link to='/demotickets' className='link'>Tickets</Link>
                {auth?.userRoles?.find((role : any) => authRole.includes(role))
                    ? <Link to='/demoadmin' className='link'>Admin</Link>
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