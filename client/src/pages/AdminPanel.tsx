const AdminPanel = ({ user }: any) => {
    return (
        <div className="container">
            <h2>Админ-панель</h2>

            <div className="card">
                <p>Пользователь: Иванов Иван</p>
                <input type="range" min="-10" max="10" />
                <button>Применить</button>
            </div>

            {user.isOwner && (
                <div className="card">
                    <h3>Логи (только овнер)</h3>
                    <p>admin → user +5</p>
                </div>
            )}
        </div>
    )
}

export default AdminPanel
