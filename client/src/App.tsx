import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        fetch('http://151.242.88.125:5000/api/health')
            .then(r => r.json())
            .then(() => setStatus('server connected'))
            .catch(() => setStatus('server offline'));
    }, []);

    return (
        <div className="container">
            <h1>CSPIRT</h1>
            <p>{status}</p>
        </div>
    );
}

export default App;
