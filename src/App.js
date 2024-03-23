import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import LogInPage from './Capstone_Web_Page/pages/LogIn_Page.web';
import MainPage from './Capstone_Web_Page/pages/Main_Page.web';
import SignUpPage from './Capstone_Web_Page/pages/SignUp_Page.web';
import ProfilePage from './Capstone_Web_Page/pages/Profile_Page.web';
import DMPage from './Capstone_Web_Page/pages/DM_Page.web';
import DMSendPage from './Capstone_Web_Page/pages/DM_Send.web';
import DMboxPage from './Capstone_Web_Page/pages/DMBox_Page.web';
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LogInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/dm" element={<DMPage />} />
          <Route path="/dmsend" element={<DMSendPage />} />
          <Route path="/dmbox" element={<DMboxPage />} />
          <Route
            path="/profile"
            element={<ProfilePage />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
