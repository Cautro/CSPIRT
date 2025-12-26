import React from 'react'

const Home: React.FC = () => {
    return (
        <main>
            <div className="card">
                <h2>Система социального рейтинга</h2>
                <p>Школьный проект по отслеживанию достижений и поведения учеников</p>
                <a href="/rating" className="btn">Посмотреть рейтинг →</a>
            </div>
        </main>
    )
}

export default Home