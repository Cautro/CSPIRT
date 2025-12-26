import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface Rating {
    id: number
    name: string
    score: number
}

const RatingPage: React.FC = () => {
    const [ratings, setRatings] = useState<Rating[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get('/api/ratings')
            .then(res => {
                const sorted = [...res.data].sort((a: Rating, b: Rating) => b.score - a.score)
                setRatings(sorted)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    const getMedal = (index: number) => {
        if (index === 0) return '🥇'
        if (index === 1) return '🥈'
        if (index === 2) return '🥉'
        return `${index + 1}.`
    }

    if (loading) return <div className="card"><h2>Загрузка...</h2></div>

    return (
        <main className="container">
            <h2 style={{textAlign: 'center', fontSize: '3rem', marginBottom: '40px'}}>Таблица социального рейтинга</h2>
            <table>
                <thead>
                <tr>
                    <th>Место</th>
                    <th>Ученик</th>
                    <th>Баллы</th>
                </tr>
                </thead>
                <tbody>
                {ratings.map((item, index) => (
                    <tr key={item.id}>
                        <td className="medal">{getMedal(index)}</td>
                        <td>{item.name}</td>
                        <td className="score">{item.score}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </main>
    )
}

export default RatingPage