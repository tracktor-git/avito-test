import React from 'react';
import axios, { AxiosError } from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ScrollPanel } from 'primereact/scrollpanel';
import EditItemDialog from '../Dialogs/EditItemDialog';

import { Advertisment } from '../../types';
import { formatNumber } from '../../utils';
import routes from '../../routes';

import noImage from '../../assets/no-image.jpg';

const Advertisement = () => {
  const { id } = useParams<{ id: string }>();
  const [advertisement, setAdvertisement] = React.useState<Advertisment | null>(null);
  const [visible, setVisible] = React.useState(false);

  const toast = React.useRef<Toast>(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    axios.get(`${routes.advertisements}/${id}`)
      .then((response) => setAdvertisement(response.data))
      .catch((error: Error) => {
        console.error('Ошибка загрузки товара:', error);

        if (error instanceof AxiosError && error.status === 404) {
          toast.current?.show({ severity: 'error', summary: 'Ошибка загрузки объявления', detail: 'Объявление с таким номером не найдено!' });
          return;
        }

        toast.current?.show({ severity: 'error', summary: 'Ошибка загрузки объявления', detail: error.message });
      });
  }, [id]);

  const handleDeleteAdvertisement = () => {
    const deleteAdvertisement = () => axios
      .delete(`${routes.advertisements}/${id}`)
      .then(() => navigate('/'))
      .catch((error: Error) => {
        console.error('Ошибка удаления объявления:', error.message);
        toast.current?.show({ severity: 'error', summary: 'Ошибка удаления объявления', detail: error.message });
      });

    confirmDialog({
      message: 'Вы хотите удалить это объявление?',
      header: 'Удаление объявления',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      acceptLabel: 'Да',
      rejectLabel: 'Нет',
      accept: deleteAdvertisement,
    });
  };

  if (!advertisement) {
    return (
      <section className="advertisement">
        <div className="container">
          <p style={{ textAlign: 'center', padding: 10 }}>Нет данных...</p>
        </div>
        <Toast ref={toast} />
      </section>
    );
  }

  return (
    <section className="advertisement">
      <div className="container">
        <Card title={advertisement.name} className="advertisement-card">
          <div className="advertisement-main-block">
            <div className="advertisement-image">
              <Image
                alt="Image"
                width="250"
                indicatorIcon={<i className="pi pi-search" />}
                src={advertisement.imageUrl || noImage}
                preview
              />
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
                <ScrollPanel style={{ width: '100%', maxHeight: 200, margin: '10px 0' }}>{advertisement.description}</ScrollPanel>
              </div>
            </div>
          </div>

          <div className="advertisement-controls">
            <Button icon="pi pi-pen-to-square" label="Редактировать объявление" onClick={() => setVisible(!visible)} />
            <Button icon="pi pi-trash" label="Удалить объявление" severity="danger" onClick={handleDeleteAdvertisement} />
            <Link
              className="p-button p-component p-button-success"
              to={`/orders?item=${advertisement.id}`}
              style={{ color: '#fff', fontWeight: '700' }}
            >
              К заказам
            </Link>
          </div>
        </Card>
      </div>

      <EditItemDialog
        data={advertisement}
        visible={visible}
        setVisible={setVisible}
        setData={setAdvertisement}
      />

      <ConfirmDialog />
      <Toast ref={toast} />
    </section>
  );
};

export default Advertisement;
