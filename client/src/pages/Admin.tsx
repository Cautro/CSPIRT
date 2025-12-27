import { useEffect, useState } from 'react'
import { api } from '../api/api'

export default function Admin() {
    const [users, setUsers] = useState<any[]>([])

    useEffect(() => {
        api.get('/users').then(res => setUsers(res.data))
    }, [])

    return (
        <div className="container">
            <div className="box">
                <h1>Пользователи</h1>

                {users.map(u => (
                    <div className="user-row" key={u._id}>
                        <div className="user-info">
                            <div>{u.username}</div>
                            <span>{u.role} • рейтинг {u.rating}</span>
                        </div>

                        <input type="range" min="0" max="200" defaultValue={u.rating} />
                    </div>
                ))}
            </div>
        </div>
    )
}
