import { Link } from "react-router-dom"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { Button } from "./ui/Button"

const Navbar = () => {
    return (
        <>
            <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent">
                <div className="mx-auto max-w-7xl px-4 flex justify-between h-16 items-center">
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
                    <div className="flex justify-end">
                        <Button 
                            variant="ghost"
                            onClick={() => {}}
                        >
                            <Link to="https://github.com/tdi-corp/crypto_generator" target="_blank">
                                <GitHubLogoIcon className="w-4 h-4"/>
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Navbar