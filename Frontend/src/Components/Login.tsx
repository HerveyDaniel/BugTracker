import { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from "../Hooks/useAuth";
import './Login.css'
import Axios from "axios";
import { useMutation } from '@tanstack/react-query';


export const Login = () => {
    const [state, setState] = useState("Log In");
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { auth, setAuth } : any = useAuth();
    const id = auth?.currentUserId;
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home";
    const demofrom = location.state?.from?.pathname || "/demohome";

    const loggingIn = async ({username, password} : any) => {
        try{
            const response = await Axios.post('http://localhost:8080/login', 
                JSON.stringify({username, password}),
                {
                    headers: {'Content-Type': 'application/json'}
                }
            );
            console.log(JSON.stringify(response?.data));
            const jwt = response?.data?.token;
            const userRoles = response?.data?.role;
            const currentUserId = response?.data?.id;
            setAuth({currentUserId, username, password, jwt, userRoles});
            setUserName('');
            setPassword('');
            navigate(from, { replace: true });
        } catch (err) {
            alert(err);
        }
    }

    const login = useMutation({
        mutationFn : loggingIn
    })

    const loggingInDemo = async () => {
        try{
            const response = await Axios.post('http://localhost:8080/demoadmin', 
                { 
                    username : "Demo", 
                    password : "Demo" 
                },
                {
                    headers: {'Content-Type': 'application/json'}
                }
            );
            console.log(JSON.stringify(response?.data));
            const username = response?.data?.username;
            const password = response?.data?.password;
            const jwt = response?.data?.token;
            const userRoles = response?.data?.role;
            const currentUserId = response?.data?.id;
            setAuth({currentUserId, username, password, jwt, userRoles});
            setUserName('');
            setPassword('');
            navigate(demofrom, { replace: true });
        } catch (err) {
            alert(err);
        }
    }

    const logindemo = useMutation({
        mutationFn : loggingInDemo
    })

        return (
        <>
        <div className = "flexboxbody">
        <div className="container">
            <div className="header">
                <div className="text">{state}</div>
                <div className="underline"></div>
            </div>
            <div className="inputContainer">

                
                <div className="input">
                    <input type="text" placeholder="Name..." onChange={(e) => setUserName(e.target.value)}/>
                </div>
                

                {state === "Sign Up" ?
                <div className="input">
                    <input type="email" placeholder="Email..." onChange={(e) => setEmail(e.target.value)}/>
                </div>
                :
                <div></div>
                }

                
                <div className="input">
                    <input type="password" placeholder="Password..." onChange={(e) => setPassword(e.target.value)}/>
                </div>

                {state === "Sign Up" ?
                <div className="input">
                    <input type="password" placeholder="Confirm Password..." onChange={(e) => setConfirmPassword(e.target.value)}/>
                </div>
                :
                <div></div>
                }
            </div>
            
            {state === "Log In" ? 
            <div className="ternaryButtons"> 
                <button onClick={() => login.mutate({username : username, password : password})} className="button">Log In</button>
                {/*<button onClick={() => setState("Sign Up")} className="button">Sign Up</button>*/}
                <button onClick={() => logindemo.mutate()} className="button">Demo As Admin</button>
            </div>
            :
            <div className="ternaryButtons">  
                <button className="button" onClick={() => setState("Log In")}>Create User</button>
                <button className="button" onClick={() => setState("Log In")}>Back to Log In</button>
            </div>
            }
            

        </div>
        <footer className="">
            <p className="copyright">&copy; 2024 HerveyDaniel Guerrero</p>
        </footer>
        </div>
        </>
        )
    }
