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
import DMSendPage from './Capstone_Web_Page/pages/DMSend_Page.web';
import DMboxPage from './Capstone_Web_Page/pages/DMBox_Page.web';
import VoteMakePage from './Capstone_Web_Page/pages/VoteMake_Page.web';
import VoteCreatedUserPage from './Capstone_Web_Page/pages/VoteCreatedUser_Page.web';
import VoteAfterPage from './Capstone_Web_Page/pages/VoteAfter_Page.web';
import VoteBeforePage from './Capstone_Web_Page/pages/VoteBefore_Page.web';
import VoteOnlyLookPage from './Capstone_Web_Page/pages/VoteOnlyLook.web';
import VoteEndPage from './Capstone_Web_Page/pages/VoteEnd_Page.web';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/dm" element={<DMPage />} />
          <Route path="/dmsend" element={<DMSendPage />} />
          <Route path="/dmbox" element={<DMboxPage />} />
          <Route
            path="/voteafter"
            element={<VoteAfterPage />}
          />
          <Route
            path="/votebefore"
            element={<VoteBeforePage />}
          />
          <Route
            path="/votecreateduser"
            element={<VoteCreatedUserPage />}
          />
          <Route
            path="/voteonlylook"
            element={<VoteOnlyLookPage />}
          />
          <Route
            path="/voteend"
            element={<VoteEndPage />}
          />
          <Route
            path="/votemake"
            element={<VoteMakePage />}
          />

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
