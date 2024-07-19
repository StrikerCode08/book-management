import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login'
import Signup from './components/Signup'
import PrivateRoute from './components/PrivateRoute';

import './App.css'
import BookList from './components/BookList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login/>} />
        <Route
            path="/booklist"
            element={
              <PrivateRoute>
                <BookList />
              </PrivateRoute>
            }
          />
        <Route path="/" element={<Login/>} />
      </Routes>
    </Router>
  )
}

export default App
