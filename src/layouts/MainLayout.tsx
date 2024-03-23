import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
import Content from "../components/Content";
// import Delete from "@/components/Delete";
import { Toaster } from "@/components/ui/Toaster"
import docsDarkAVIF from "@/media/docs-dark.avif"
import docsDarkPNG from "@/media/docs-dark.png"

const MainLayout = () => {
    
    return (
        <>
            <div className="absolute z-10  top-0 inset-x-0 flex justify-center pointer-events-none">
                <div className="w-[108rem] flex-none flex justify-middle">
                    <picture>
                    <source type="image/avif" srcSet={docsDarkAVIF} />
                    <img src={docsDarkPNG} alt="" className="w-[90rem] flex-none max-w-none hidden dark:block" decoding="async" />
                    </picture>
                </div>


                <svg className="absolute opacity-30 h-[700px]" viewBox="0 0 960 637" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_f_1_167)">
                    <ellipse cx="479.5" cy="318.5" rx="118.5" ry="118.5" transform="rotate(-90 479.5 318.5)" fill="#3C459A" fillOpacity="0.5"></ellipse>
                    </g>
                    <mask id="mask0_1_167" style={{maskType: 'alpha'}} maskUnits="userSpaceOnUse" x="0" y="32" width="960" height="573">
                    <rect y="32" width="960" height="573" fill="url(#paint0_radial_1_167)"></rect>
                    </mask>
                    <g mask="url(#mask0_1_167)">
                    <rect x="123.5" y="41.5" width="79" height="79" stroke="white"></rect>
                    <rect x="202.5" y="41.5" width="79" height="79" stroke="white"></rect>
                    <rect x="281.5" y="41.5" width="79" height="79" stroke="white"></rect>
                    <rect x="360.5" y="41.5" width="79" height="79" stroke="white"></rect>
                    <rect x="439.5" y="41.5" width="79" height="79" stroke="white"></rect>
                    <rect x="518.5" y="41.5" width="79" height="79" stroke="white"></rect>
                    <rect x="597.5" y="41.5" width="79" height="79" fill="white" fillOpacity="0.25" stroke="white"></rect>
                    <rect x="676.5" y="41.5" width="79" height="79" stroke="white"></rect>
                    <rect x="755.5" y="41.5" width="79" height="79" stroke="white"></rect>
                    <rect x="123.5" y="120.5" width="79" height="79" stroke="white"></rect>
                    <rect x="202.5" y="120.5" width="79" height="79" stroke="white"></rect>
                    <rect x="281.5" y="120.5" width="79" height="79" stroke="white"></rect>
                    <rect x="360.5" y="120.5" width="79" height="79" stroke="white"></rect>
                    <rect x="439.5" y="120.5" width="79" height="79" stroke="white"></rect>
                    <rect x="518.5" y="120.5" width="79" height="79" stroke="white"></rect>
                    <rect x="597.5" y="120.5" width="79" height="79" stroke="white"></rect>
                    <rect x="676.5" y="120.5" width="79" height="79" stroke="white"></rect>
                    <rect x="755.5" y="120.5" width="79" height="79" stroke="white"></rect>
                    <rect x="123.5" y="199.5" width="79" height="79" stroke="white"></rect>
                    <rect x="202.5" y="199.5" width="79" height="79" stroke="white"></rect>
                    <rect x="281.5" y="199.5" width="79" height="79" stroke="white"></rect>
                    <rect x="360.5" y="199.5" width="79" height="79" stroke="white"></rect>
                    <rect x="439.5" y="199.5" width="79" height="79" fill="white" fillOpacity="0.25" stroke="white"></rect>
                    <rect x="518.5" y="199.5" width="79" height="79" stroke="white"></rect>
                    <rect x="597.5" y="199.5" width="79" height="79" fill="white" fillOpacity="0.25" stroke="white"></rect>
                    <rect x="676.5" y="199.5" width="79" height="79" stroke="white"></rect>
                    <rect x="755.5" y="199.5" width="79" height="79" stroke="white"></rect>
                    <rect x="123.5" y="278.5" width="79" height="79" stroke="white"></rect>
                    <rect x="202.5" y="278.5" width="79" height="79" stroke="white"></rect>
                    <rect x="281.5" y="278.5" width="79" height="79" stroke="white"></rect>
                    <rect x="360.5" y="278.5" width="79" height="79" stroke="white"></rect>
                    <rect x="439.5" y="278.5" width="79" height="79" stroke="white"></rect>
                    <rect x="518.5" y="278.5" width="79" height="79" stroke="white"></rect>
                    <rect x="597.5" y="278.5" width="79" height="79" stroke="white"></rect>
                    <rect x="676.5" y="278.5" width="79" height="79" stroke="white"></rect>
                    <rect x="755.5" y="278.5" width="79" height="79" stroke="white"></rect>
                    <rect x="123.5" y="357.5" width="79" height="79" stroke="white"></rect>
                    <rect x="202.5" y="357.5" width="79" height="79" stroke="white"></rect>
                    <rect x="281.5" y="357.5" width="79" height="79" stroke="white"></rect>
                    <rect x="360.5" y="357.5" width="79" height="79" fill="white" fillOpacity="0.25" stroke="white"></rect>
                    <rect x="439.5" y="357.5" width="79" height="79" stroke="white"></rect>
                    <rect x="518.5" y="357.5" width="79" height="79" stroke="white"></rect>
                    <rect x="597.5" y="357.5" width="79" height="79" stroke="white"></rect>
                    <rect x="676.5" y="357.5" width="79" height="79" stroke="white"></rect>
                    <rect x="755.5" y="357.5" width="79" height="79" stroke="white"></rect>
                    <rect x="123.5" y="436.5" width="79" height="79" stroke="white"></rect>
                    <rect x="202.5" y="436.5" width="79" height="79" stroke="white"></rect>
                    <rect x="281.5" y="436.5" width="79" height="79" stroke="white"></rect>
                    <rect x="360.5" y="436.5" width="79" height="79" stroke="white"></rect>
                    <rect x="439.5" y="436.5" width="79" height="79" stroke="white"></rect>
                    <rect x="518.5" y="436.5" width="79" height="79" stroke="white"></rect>
                    <rect x="597.5" y="436.5" width="79" height="79" stroke="white"></rect>
                    <rect x="676.5" y="436.5" width="79" height="79" stroke="white"></rect>
                    <rect x="755.5" y="436.5" width="79" height="79" stroke="white"></rect>
                    <rect x="123.5" y="515.5" width="79" height="79" stroke="white"></rect>
                    <rect x="202.5" y="515.5" width="79" height="79" stroke="white"></rect>
                    <rect x="281.5" y="515.5" width="79" height="79" stroke="white"></rect>
                    <rect x="360.5" y="515.5" width="79" height="79" stroke="white"></rect>
                    <rect x="439.5" y="515.5" width="79" height="79" stroke="white"></rect>
                    <rect x="518.5" y="515.5" width="79" height="79" stroke="white"></rect>
                    <rect x="597.5" y="515.5" width="79" height="79" stroke="white"></rect>
                    <rect x="676.5" y="515.5" width="79" height="79" stroke="white"></rect>
                    <rect x="755.5" y="515.5" width="79" height="79" stroke="white"></rect>
                    </g>
                    <defs>
                    <filter id="filter0_f_1_167" x="161" y="1.14441e-05" width="637" height="637" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                        <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_1_167"></feGaussianBlur>
                    </filter>
                    <radialGradient id="paint0_radial_1_167" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(480 318.5) rotate(90) scale(353.19 591.732)">
                        <stop stopColor="#D9D9D9" stopOpacity="0.2"></stop>
                        <stop offset="0.802083" stopColor="#D9D9D9" stopOpacity="0"></stop>
                    </radialGradient>
                    </defs>
                </svg>

            </div>        
            <Navbar />                         
            {/* <Sidebar /> */}
            <Content>
                <Outlet />
            </Content>
            
            {/* <Delete /> */}
            <Toaster />
        </>
    )
}

export default MainLayout;