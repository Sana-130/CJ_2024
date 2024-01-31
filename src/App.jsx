import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { SignUp } from './components/Signup';
import { SignIn } from './components/SignIn';
import PrivateRoute from './components/Private';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Home } from './components/Home';
import { Landing } from './components/Landing';
import { Admin } from './components/Admin';
import { Submissions } from './components/Submissions';
import ScoreBoard from './components/ScoreBoard';
import { UserSub } from './components/UserSub';


function App() {

  return (
    <Router>
      <AuthProvider>
        
      <Routes>
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/" element={<SignIn/>} />
        <Route  element={<PrivateRoute /> }>
              <Route path="/scores" element={<ScoreBoard />} />
              <Route path="/submissions/user/:id" element={<UserSub />} />
              <Route path="/submissions/:id" element={<DataProvider><Submissions /></DataProvider>} />
              <Route path="/question/:id" element={<DataProvider><Landing /></DataProvider>} />
              <Route path="/dashboard" element={ <DataProvider><Admin /></DataProvider>} />
              <Route path="/home" element={ <DataProvider><Home /></DataProvider>} />
              <Route path='/admin' element={<DataProvider><Admin /></DataProvider>} />        
        </Route>
        <Route path="*" element={<p>There's nothing to see here: 404!</p>} />
      </Routes>
     
      </AuthProvider>
    </Router>
  );
}

export default App
