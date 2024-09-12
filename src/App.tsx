import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Advertisements from './Components/Advertisements';
import Advertisement from './Components/Advertisement';
import Orders from './Components/Orders';
import Navigation from './Components/Navigation';
import Footer from './Components/Footer';

const App = () => (
  <Router>
    <Navigation />
    <main>
      <Routes>
        <Route path="/" element={<Advertisements />} />
        <Route path="/advertisements/:id" element={<Advertisement />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </main>
    <Footer />
  </Router>
);

export default App;
