import React from 'react';
import axios from 'axios';

import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Toast } from 'primereact/toast';

import AdvertisementCard from './AdvertismentCard';
import ItemDialog from './ItemDialog';

import { Advertisment } from '../types';

import AdvertisementsFilters from './AdvertisementsFilters';

const START_ITEMS_PER_PAGE = 10;

const sortByDateDesc = (item1: Advertisment, item2: Advertisment) => {
  const date1 = Number(new Date(item1.createdAt));
  const date2 = Number(new Date(item2.createdAt));

  return date2 - date1;
};

const Advertisements = () => {
  const [advertisements, setAdvertisements] = React.useState<Advertisment[]>([]);
  const [filtered, setFiltered] = React.useState<Advertisment[]>([]);
  const [displayed, setDisplayed] = React.useState<Advertisment[]>([]);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [first, setFirst] = React.useState<number>(0);
  const [rows, setRows] = React.useState<number>(START_ITEMS_PER_PAGE);

  const toast = React.useRef<Toast>(null);

  React.useEffect(() => {
    axios
      .get('http://localhost:3000/advertisements')
      .then(({ data }) => {
        const sortedData = data.sort(sortByDateDesc);
        setAdvertisements(sortedData);
        setFiltered(sortedData);
      })
      .catch((error) => {
        console.error(error);
        toast.current?.show({ severity: 'error', summary: 'Ошибка загрузки объявлений...', detail: error.message });
      });
  }, []);

  React.useEffect(() => {
    const startIndex = first;
    const endIndex = first + rows;
    setDisplayed(filtered.slice(startIndex, endIndex));
  }, [first, rows, filtered]);

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  return (
    <div>
      <h1>Объявления</h1>

      <div>
        <Button
          label="Добавить объявление"
          icon="pi pi-plus"
          severity="success"
          style={{ marginBottom: 15, width: 240, fontSize: 14 }}
          onClick={() => setVisible(!visible)}
        />
      </div>

      <AdvertisementsFilters
        data={advertisements}
        setData={setFiltered}
        resetPages={() => setFirst(0)}
      />

      {displayed.length > 0 && (
        <Paginator
          first={first}
          rows={rows}
          totalRecords={filtered.length} // Количество записей после фильтрации
          rowsPerPageOptions={[10, 20, 30, 50, 100]}
          onPageChange={onPageChange}
          style={{ marginBottom: 10 }}
        />
      )}

      <div className="advertisements-wrapper">
        {!displayed.length && <div>Нет объявлений для отображения...</div>}

        {displayed.map((item: Advertisment) => (
          <Link to={`/advertisements/${item.id}`} key={item.id} className="adv-link">
            <AdvertisementCard
              id={item.id}
              imageUrl={item.imageUrl}
              likes={item.likes}
              price={item.price}
              name={item.name}
              views={item.views}
              createdAt={item.createdAt}
            />
          </Link>
        ))}
      </div>

      <ItemDialog
        mode="add"
        visible={visible}
        setVisible={setVisible}
        setData={setAdvertisements}
      />

      <Toast ref={toast} />
    </div>
  );
};

export default Advertisements;
