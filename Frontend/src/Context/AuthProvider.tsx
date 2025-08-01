import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({children}: any) => {
    const [auth, setAuth] = useState({}); /* Global state that will
    hold user info (including JWT) upon authentication */


    return (
        <AuthContext.Provider value = {{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;