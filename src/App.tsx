import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Advertisements from './Components/Advertisements';
import Advertisement from './Components/Advertisement';
import Orders from './Components/Orders';
import Navigation from './Components/Navigation';

const App = () => (
  <Router>
    <Navigation />
    <Routes>
      <Route path="/" element={<Advertisements />} />
      <Route path="/advertisements/:id" element={<Advertisement />} />
      <Route path="/orders" element={<Orders />} />
    </Routes>
  </Router>
);

export default App;
