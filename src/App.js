import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import LogInPage from './Capstone_Web_Page/LogIn_Page.web';
import MainPage from './Capstone_Web_Page/Main_Page.web';
import SignUpPage from './Capstone_Web_Page/SignUp_Page.web';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LogInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/main" element={<MainPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
