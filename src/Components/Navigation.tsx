import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';

const Navigation = () => (
  <div className="card">
    <div className="navigation-buttons">
      <Button icon="pi pi-list" className="nav-button" text><Link to="./">Объявления</Link></Button>
      <Button icon="pi pi-shopping-cart" className="nav-button" text><Link to="./orders">Заказы</Link></Button>
    </div>
  </div>
);

export default Navigation;
