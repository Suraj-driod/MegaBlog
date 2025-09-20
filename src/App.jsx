import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import authService from './appwrite/auth.js'
import { login, logout } from './store/authSlice.js'
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Outlet from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData));
        } else {
          dispatch(logout())
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return !loading ? (
    <div>
      <div>
        <Header />
        <main>
          {/* <Outlet /> */}
        </main>
        <Footer />
      </div>
    </div>
  ) : null
}

export default App
