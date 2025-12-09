import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateExperience from './pages/CreateExperience';
import SharePage from './pages/SharePage';
import ViewExperience from './pages/ViewExperience';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateExperience />} />
        <Route path="/share/:uniqueId" element={<SharePage />} />
        <Route path="/experience/:uniqueId" element={<ViewExperience />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
