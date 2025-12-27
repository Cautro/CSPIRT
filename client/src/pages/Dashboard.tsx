import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
    const { role } = useAuth()

    return (
        <div className="container">
            <div className="box">
                <h1>Личный кабинет</h1>
                <p>Ваша роль: <b>{role}</b></p>
                <p>Социальный рейтинг: <b>100</b></p>
            </div>
        </div>
    )
}
