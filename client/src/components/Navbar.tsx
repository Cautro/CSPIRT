const Navbar = () => {
    return (
        <div className="navbar">
            <span>CSPIRT</span>
            <button
                onClick={() => {
                    localStorage.removeItem('user')
                    location.href = '/login'
                }}
            >
                Выйти
            </button>
        </div>
    )
}

export default Navbar
