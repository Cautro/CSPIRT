const UserPanel = ({ user }: any) => {
    return (
        <div className="container">
            <div className="card">
                <h2>{user.name}</h2>
                <p>Класс: {user.class}</p>
                <p>Рейтинг: {user.rating}</p>
            </div>

            <div className="card">
                <h3>Анонимная жалоба</h3>
                <textarea placeholder="Текст жалобы" />
                <button>Отправить</button>
            </div>
        </div>
    )
}

export default UserPanel