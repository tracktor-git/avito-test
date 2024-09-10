import React from 'react';
import axios from 'axios';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';

import AdvertisementCard from './AdvertismentCard';
import AddItemDialog from './AddItemDialog';

import { Advertisment } from '../types';

const START_ITEMS_PER_PAGE = 10;

const Advertisements = () => {
  const [advertisements, setAdvertisements] = React.useState<Advertisment[]>([]);
  const [filtered, setFiltered] = React.useState<Advertisment[]>([]);
  const [displayed, setDisplayed] = React.useState<Advertisment[]>([]);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [filter, setFilter] = React.useState('');
  const [first, setFirst] = React.useState<number>(0);
  const [rows, setRows] = React.useState<number>(START_ITEMS_PER_PAGE);

  React.useEffect(() => {
    axios
      .get('http://localhost:3000/advertisements')
      .then(({ data }) => { setAdvertisements(data); setFiltered(data); })
      .catch((error) => console.error(error));
  }, []);

  React.useEffect(() => {
    const newData = advertisements.filter(({ name }) => name.toLowerCase().includes(filter));
    setFiltered(newData);
    setFirst(0);
  }, [filter, advertisements]);

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
          style={{ marginBottom: 15 }}
          onClick={() => setVisible(!visible)}
        />
      </div>

      <div className="advertisements-filter">
        <InputText
          placeholder="Фильтр по названию"
          value={filter}
          onChange={({ target }) => setFilter(target.value.trim().toLowerCase())}
        />
        <Button icon="pi pi-times" text rounded size="small" onClick={() => setFilter('')} />
      </div>

      <Paginator
        first={first}
        rows={rows}
        totalRecords={filtered.length} // Количество записей после фильтрации
        rowsPerPageOptions={[10, 20, 30, 50, 100]}
        onPageChange={onPageChange}
        style={{ marginBottom: 10 }}
      />

      <div className="advertisements-wrapper">
        {!displayed.length && <div>Нет объявлений...</div>}

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

      <AddItemDialog
        mode="add"
        visible={visible}
        setVisible={setVisible}
        setData={setAdvertisements}
      />
    </div>
  );
};

export default Advertisements;
