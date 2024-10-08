import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Advertisements from './Components/Pages/Advertisements';
import Advertisement from './Components/Pages/Advertisement';
import Orders from './Components/Pages/Orders';
import Navigation from './Components/Parts/Navigation';
import Footer from './Components/Parts/Footer';

import { ToastProvider } from './ToastContext';

const App = () => (
  <ToastProvider>
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
  </ToastProvider>
);

export default App;
