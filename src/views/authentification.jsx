import LogIn from "./login";
import AgentRoot from "./agent_root.jsx";
import AgentForm from './AgentForm.jsx'
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, getUserInfoByEmail } from "../services/firebase.jsx";
import Dashboard from "../components/dashboard.jsx";
import Entries from "../components/entries.jsx";
import Cycle from "./Cycle.jsx";

const Auth = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            try {
                if (user !== null) {
                    const response = await getUserInfoByEmail(user.email);
                    if (response === null) {
                        console.log("Username was not found!");
                    } else {
                        setUserInfo(response);
                    }

                }
            } catch (error) {
                window.alert(error.message);
            }

        });

        return unsubscribe;
    }, []);

    const router = createBrowserRouter([
        {
            path: "/login",
            element: <LogIn />,
        },
        {
            path: "/",
            element: <AgentRoot context={userInfo} />,
            children: [
                {
                    path: "/",
                    element: currentUser !== null ? <Navigate to="/dashboard" /> : <Navigate to="/login" />,
                },
                {
                    path: "/dashboard",
                    element: currentUser !== null ? <Dashboard /> : <Navigate to="/login" />,
                },
                {
                    path: "/entries",
                    element: currentUser !== null ? <Entries /> : <Navigate to="/login" />,
                },
                {
                    path: "/add_cycle",
                    element: currentUser !== null ? <Cycle /> : <Navigate to="/login" />,
                },
            ]
        },
    ])

    return (<RouterProvider router={router} />
    );
}

export default Auth;