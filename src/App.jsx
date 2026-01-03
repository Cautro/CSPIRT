import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import OwnerDashboard from './components/OwnerDashboard';
import AdminDashboard from './components/AdminDashboard';
import HelperDashboard from './components/HelperDashboard';
import UserDashboard from './components/UserDashboard';
import './App.css';

const LoginPage = ({ isDarkMode, toggleDarkMode, onLogin }) => (
  <div className="login-container" style={{
    background: isDarkMode ? '#0f0f0f' : '#f8f9fa',
    color: isDarkMode ? '#e0e0e0' : '#212529',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  }}>
    <button
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: isDarkMode ? '#ffc107' : '#2c3e50',
        color: isDarkMode ? '#000' : '#fff',
        border: 'none',
        padding: '10px 14px',
        borderRadius: '50px',
        cursor: 'pointer',
        fontSize: '18px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        fontWeight: 'bold'
      }}
      onClick={toggleDarkMode}
      title={isDarkMode ? 'Светлая тема' : 'Тёмная тема'}
    >
      {isDarkMode ? '○' : '●'}
    </button>

    <div style={{
      background: isDarkMode ? '#1a1a1a' : 'white',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      maxWidth: '400px',
      width: '90%'
    }}>
      <h1 style={{ textAlign: 'center', marginTop: 0, fontSize: '28px', fontWeight: 700, color: isDarkMode ? '#e0e0e0' : '#212529' }}>Система Рейтинга</h1>

      <form onSubmit={onLogin} style={{ marginTop: '30px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: isDarkMode ? '#e0e0e0' : '#212529' }}>Логин</label>
          <input
            type="text"
            placeholder="Введите логин"
            id="username"
            autoFocus
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: `1px solid ${isDarkMode ? '#404040' : '#e0e0e0'}`,
              background: isDarkMode ? '#0f0f0f' : '#fff',
              color: isDarkMode ? '#e0e0e0' : '#212529',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: isDarkMode ? '#e0e0e0' : '#212529' }}>Пароль</label>
          <input
            type="password"
            placeholder="Введите пароль"
            id="password"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: `1px solid ${isDarkMode ? '#404040' : '#e0e0e0'}`,
              background: isDarkMode ? '#0f0f0f' : '#fff',
              color: isDarkMode ? '#e0e0e0' : '#212529',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 600,
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Войти
        </button>
      </form>

      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: isDarkMode ? '#0f0f0f' : '#f8f9fa',
        borderRadius: '8px',
        fontSize: '13px',
        color: isDarkMode ? '#b0b0b0' : '#6c757d'
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: isDarkMode ? '#e0e0e0' : '#212529' }}>Тестовые учетные записи:</p>
        <p style={{ margin: '4px 0' }}>Admin: admin / admin123</p>
        <p style={{ margin: '4px 0' }}>Helper: helper / helper123</p>
        <p style={{ margin: '4px 0' }}>Student: student / student123</p>
      </div>
    </div>
  </div>
);

function App() {
  const [data, setData] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  const addLog = (action, targetUserId, details) => {
    setData(prevData => {
      return {
        ...prevData,
        logs: [...(prevData.logs || []), {
          id: `log_${Date.now()}`,
          userId: loggedInUser?.id,
          action: action,
          targetUserId: targetUserId,
          details: details,
          timestamp: new Date().toISOString()
        }]
      };
    });
  };

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const savedData = localStorage.getItem('systemData');
    const savedUser = localStorage.getItem('loggedInUser');

    if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      fetch('/database.json')
        .then((response) => response.json())
        .then((json) => {
          setData(json);
          localStorage.setItem('systemData', JSON.stringify(json));
        })
        .catch((error) => console.error('Error fetching data:', error));
    }

    if (savedUser) {
      setLoggedInUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (data) {
      localStorage.setItem('systemData', JSON.stringify(data));
    }
  }, [data]);

  const updateUserData = (updatedUser) => {
    setData(prevData => ({
      ...prevData,
      users: prevData.users.map(u => u.id === updatedUser.id ? updatedUser : u)
    }));

    if (loggedInUser && loggedInUser.id === updatedUser.id) {
      setLoggedInUser(updatedUser);
      localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
    }
  };

  const addComplaint = (targetUserId, complaintText, fromUserId) => {
    setData(prevData => ({
      ...prevData,
      users: prevData.users.map(u => {
        if (u.id === targetUserId) {
          return {
            ...u,
            complaints: [...(u.complaints || []), {
              fromUserId: fromUserId,
              fromUserName: 'Anonymous',
              text: complaintText,
              timestamp: new Date().toISOString()
            }]
          };
        }
        return u;
      })
    }));
    addLog('Complaint added', targetUserId, complaintText);
  };

  const addNote = (targetUserId, noteText, fromUser) => {
    setData(prevData => ({
      ...prevData,
      users: prevData.users.map(u => {
        if (u.id === targetUserId) {
          return {
            ...u,
            notes: [...(u.notes || []), {
              fromUserId: fromUser.id,
              fromUserName: fromUser.name,
              text: noteText,
              timestamp: new Date().toISOString()
            }]
          };
        }
        return u;
      })
    }));
    addLog('Note added', targetUserId, noteText);
  };

  const addUser = (newUser) => {
    setData(prevData => ({
      ...prevData,
      users: [...prevData.users, newUser]
    }));
    addLog('User added', newUser.id, `Added user: ${newUser.name}`);
  };

  const deleteUser = (userId) => {
    if (window.confirm('Вы уверены? Это действие невозможно отменить!')) {
      setData(prevData => ({
        ...prevData,
        users: prevData.users.filter(u => u.id !== userId)
      }));
      addLog('User deleted', userId, 'User removed from system');
    }
  };

  const deleteComplaint = (targetUserId, complaintIndex) => {
    if (window.confirm('Удалить эту жалобу?')) {
      setData(prevData => ({
        ...prevData,
        users: prevData.users.map(u => {
          if (u.id === targetUserId) {
            return {
              ...u,
              complaints: u.complaints.filter((_, idx) => idx !== complaintIndex)
            };
          }
          return u;
        })
      }));
      addLog('Complaint deleted', targetUserId, 'Complaint removed');
    }
  };

  const deleteNote = (targetUserId, noteIndex) => {
    if (window.confirm('Удалить эту заметку?')) {
      setData(prevData => ({
        ...prevData,
        users: prevData.users.map(u => {
          if (u.id === targetUserId) {
            return {
              ...u,
              notes: u.notes.filter((_, idx) => idx !== noteIndex)
            };
          }
          return u;
        })
      }));
      addLog('Note deleted', targetUserId, 'Note removed');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!data || !data.users) {
      alert('Данные загружаются. Пожалуйста, попробуйте позже.');
      return;
    }

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = data.users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      setLoggedInUser(user);
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
    } else {
      alert('Неверный логин или пароль');
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser');
  };

  if (!data) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!loggedInUser) {
    return <LoginPage isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Navigate to={`/${loggedInUser.role}`} replace />} />
        <Route path="/" element={<Navigate to={`/${loggedInUser.role}`} replace />} />

        <Route
          path="/owner"
          element={loggedInUser.role === 'owner' ? <OwnerDashboard user={loggedInUser} data={data} onLogout={handleLogout} updateUserData={updateUserData} addUser={addUser} deleteUser={deleteUser} deleteComplaint={deleteComplaint} deleteNote={deleteNote} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/admin"
          element={loggedInUser.role === 'admin' ? <AdminDashboard user={loggedInUser} data={data} onLogout={handleLogout} updateUserData={updateUserData} addUser={addUser} deleteUser={deleteUser} deleteComplaint={deleteComplaint} deleteNote={deleteNote} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/helper"
          element={loggedInUser.role === 'helper' ? <HelperDashboard user={loggedInUser} data={data} onLogout={handleLogout} addNote={addNote} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/user"
          element={loggedInUser.role === 'user' ? <UserDashboard user={loggedInUser} data={data} onLogout={handleLogout} addComplaint={addComplaint} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} /> : <Navigate to="/login" replace />}
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

