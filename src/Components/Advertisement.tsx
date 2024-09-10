import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
import ItemDialog from './ItemDialog';

import { Advertisment } from '../types';

import { formatNumber } from '../utils';

import noImage from '../assets/no-image.jpg';

const Advertisement = () => {
  const { id } = useParams<{ id: string }>();
  const [advertisement, setAdvertisement] = React.useState<Advertisment | null>(null);
  const [visible, setVisible] = React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    axios.get(`http://localhost:3000/advertisements/${id}`)
      .then((response) => setAdvertisement(response.data))
      .catch((error) => console.error('Ошибка загрузки товара:', error));
  }, [id]);

  if (!advertisement) {
    return <p>Нет данных...</p>;
  }

  const deleteAdvertisement = async () => {
    try {
      await axios.delete(`http://localhost:3000/advertisements/${id}`);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  const updateData = async (data: Advertisment) => {
    try {
      await axios.put(`http://localhost:3000/advertisements/${id}`, data);
      setAdvertisement(data);
      setVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Card title={advertisement.name}>
        <div className="advertisement-main-block">
          <div className="advertisement-image">
            <Image src={advertisement.imageUrl || noImage} indicatorIcon={<i className="pi pi-search" />} alt="Image" preview width="250" />
          </div>

          <div className="advertisement-info">
            <ul>
              <li>
                <b>Дата создания: </b>
                <span>{new Date(advertisement.createdAt).toLocaleString()}</span>
              </li>
              <li>
                <b>Цена: </b>
                <span>{formatNumber(advertisement.price)}</span>
              </li>
              <li>
                <b>Просмотров: </b>
                <span>{formatNumber(advertisement.views, 'number')}</span>
              </li>
              <li>
                <b>Лайков: </b>
                <span>{advertisement.likes}</span>
              </li>
            </ul>
            <div className="advertisement-description">
              <b>Описание:</b>
              <div>{advertisement.description}</div>
            </div>
          </div>
        </div>

        <div className="advertisement-controls">
          <Button icon="pi pi-pen-to-square" label="Редактировать объявление" onClick={() => setVisible(!visible)} />
          <Button icon="pi pi-trash" label="Удалить объявление" severity="danger" onClick={deleteAdvertisement} />
        </div>
      </Card>

      <ItemDialog mode="edit" data={advertisement} visible={visible} setVisible={() => setVisible(!visible)} updateData={updateData} />
    </>
  );
};

export default Advertisement;
