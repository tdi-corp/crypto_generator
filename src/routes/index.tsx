import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.tsx";
import Home from "../pages/Home.tsx";
import Coins from "../pages/Coins.tsx";


const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '',
                element: <Home />
            },
            {
                path: 'coins',
                element: <Coins />
            }
        ]
    }
], {
    basename: '/'
})

export default router