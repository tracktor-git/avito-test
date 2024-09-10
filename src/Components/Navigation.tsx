import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';

const Navigation = () => (
  <div className="card">
    <div className="navigation-buttons">
      <Link to="./"><Button icon="pi pi-list" className="nav-button" text>Объявления</Button></Link>
      <Link to="./orders"><Button icon="pi pi-shopping-cart" className="nav-button" text>Заказы</Button></Link>
    </div>
  </div>
);

export default Navigation;
