

export const ContainerFixed = function ({ children }) {
    return (<div>
        <div className="fixed-container">
            {children}
        </div>
        <style jsx>{`
            .fixed-container{
                position: absolute;
                bottom: 1rem;
                width: calc(100% - 1rem);
            }
            `}</style>
    </div>)
}
