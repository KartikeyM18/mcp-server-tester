
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './screens/HomePage';

function App() {
  return <div >
    
    <BrowserRouter>
    
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  </div>
}

export default App
