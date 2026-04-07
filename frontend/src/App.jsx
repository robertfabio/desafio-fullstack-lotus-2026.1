import { useState } from 'react'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

function App() {
  const [authScreen, setAuthScreen] = useState('login')

  if (authScreen === 'register') {
    return <RegisterPage onSwitchToLogin={() => setAuthScreen('login')} />
  }

  return <LoginPage onSwitchToRegister={() => setAuthScreen('register')} />
}

export default App
