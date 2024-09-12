import { Dialog } from 'primereact/dialog';
import { Link } from 'react-router-dom';

import { Advertisment } from '../../types';

interface IShowItemDialog {
  items: Advertisment[];
  visible: boolean;
  setVisible: (value: boolean) => void;
  }

const ShowItemsDialog = (props: IShowItemDialog) => {
  const { items, visible, setVisible } = props;

  return (
    <Dialog header="Объявления в товаре" visible={visible} onHide={() => setVisible(false)} style={{ minWidth: 320 }}>
      {items.map((item: Advertisment) => (
        <p key={item.id} className="item-link">
          <Link to={`/advertisements/${item.id}`} target="_blank">{item.name}</Link>
        </p>
      ))}
    </Dialog>
  );
};

export default ShowItemsDialog;
