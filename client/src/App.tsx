import { Routes, Route } from 'react-router-dom'
import Home              from './app/pages/Home'
import Test              from './app/pages/Test'
import './App.css';
import Test1 from './app/pages/Test1';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Home /> }/>
        <Route path="/test" element={ <Test /> }/>
        <Route path="/test1" element={ <Test1 /> }/>
      </Routes>
    </div>
  );
}

export default App;