const Content = ({children}: React.PropsWithChildren) => {
    return (
        <div className="mx-auto max-w-5xl px-4 py-20 z-20 relative">
            {children}
        </div>
    )
}

export default Content