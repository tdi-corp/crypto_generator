import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <>
            <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent">
                <div className="mx-auto max-w-7xl px-4 flex justify-between gap-4 h-16 items-center">
                    <div className="flex items-center gap-x-14">
                        <div>
                            logotype
                        </div>
                        <nav>
                            <ul className="flex items-center gap-x-6">
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="/coins">Available Coins</Link>                               
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div>
                     
                    </div>
                </div>
            </header>
        </>
    )
}

export default Navbar