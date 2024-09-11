import React from 'react';
import axios from 'axios';

import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Toast } from 'primereact/toast';

import AdvertisementCard from './AdvertismentCard';
// import ItemDialog from './ItemDialog';
import AddItemDialog from './AddItemDialog';

import { Advertisment } from '../types';

import AdvertisementsFilters from './AdvertisementsFilters';

const filterMap = {
  name: 'name_like',
  price: 'price',
  views: 'views',
  likes: 'likes',
} as const;

export type Filter = { name: keyof typeof filterMap, value: string } | null;

const Advertisements = () => {
  const [advertisements, setAdvertisements] = React.useState<Advertisment[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [first, setFirst] = React.useState<number>(0);
  const [rows, setRows] = React.useState<number>(10);
  const [filter, setFilter] = React.useState<Filter>(null);

  const toast = React.useRef<Toast>(null);

  React.useEffect(() => {
    const url = new URL('advertisements', 'http://localhost:3000');
    url.searchParams.set('_page', String(page));
    url.searchParams.set('_limit', String(rows));
    url.searchParams.set('_sort', 'createdAt');
    url.searchParams.set('_order', 'desc');

    if (filter?.name) {
      url.searchParams.set(filterMap[filter.name], filter.value);
    }

    axios
      .get(url.href)
      .then((response) => {
        setAdvertisements(response.data);
        setTotalCount(response.headers['x-total-count']);
      })
      .catch((error) => {
        console.error(error);
        toast.current?.show({ severity: 'error', summary: 'Ошибка загрузки объявлений...', detail: error.message });
      });
  }, [rows, page, filter]);

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
    setRows(event.rows);
    setPage(event.page + 1);
  };

  const handleAddItem = (item: Advertisment) => {
    setPage(1);
    setFirst(0);
    setRows(rows);
    setAdvertisements((prevState) => [item, ...prevState]);
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
        setFilter={setFilter}
        resetPage={() => setPage(1)}
      />

      {advertisements.length > 0 && (
        <Paginator
          first={first}
          rows={rows}
          totalRecords={totalCount}
          rowsPerPageOptions={[10, 20, 30, 50, 100]}
          onPageChange={onPageChange}
          style={{ marginBottom: 10 }}
        />
      )}

      <div className="advertisements-wrapper">
        {!advertisements.length && <div>Нет объявлений для отображения...</div>}

        {advertisements.map((item: Advertisment) => (
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

      {/* <ItemDialog
        mode="add"
        visible={visible}
        setVisible={setVisible}
        setData={handleAddItem}
      /> */}

      <AddItemDialog visible={visible} setVisible={setVisible} setData={handleAddItem} />

      <Toast ref={toast} />
    </div>
  );
};

export default Advertisements;
