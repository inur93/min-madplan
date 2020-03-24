


export default function MenuContainer({ children }) {
    return <div className="menu-container">
        {children}

        <style jsx>{
            `.menu-container{
                width: 100%;
                height: 100vh;
                top: 0;
                left: 0;
                position: absolute;
                display: flex;
                flex-direction: column;
            }
    `}</style>
    </div>
}