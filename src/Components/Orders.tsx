import React from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Link } from 'react-router-dom';
import { Toast } from 'primereact/toast';

import axios from 'axios';

import routes from '../routes';

import { Order, Advertisment, OrderStatus } from '../types';

import { formatNumber } from '../utils';

interface IShowItemDialog {
  items: Advertisment[];
  visible: boolean;
  setVisible: (value: boolean) => void;
}

type OrderStatusKey = keyof typeof OrderStatus;

// Обратный маппинг для числовых значений статуса заказа
const OrderStatusText: { [key in OrderStatusKey]: string } = {
  Created: 'Создан',
  Paid: 'Оплачен',
  Transport: 'В пути',
  DeliveredToThePoint: 'Доставлен в пункт',
  Received: 'Получен',
  Archived: 'Архивирован',
  Refund: 'Возврат',
};

type SelectedStatusType = { name: string, code: number } | null;

const statuses: SelectedStatusType[] = [
  { name: OrderStatusText.Created, code: OrderStatus.Created },
  { name: OrderStatusText.Paid, code: OrderStatus.Paid },
  { name: OrderStatusText.Transport, code: OrderStatus.Transport },
  { name: OrderStatusText.DeliveredToThePoint, code: OrderStatus.DeliveredToThePoint },
  { name: OrderStatusText.Received, code: OrderStatus.Received },
  { name: OrderStatusText.Archived, code: OrderStatus.Archived },
  { name: OrderStatusText.Refund, code: OrderStatus.Refund },
];

const getOrderStatusText = (status: number): string | undefined => {
  const statusKey = (Object.keys(OrderStatus) as Array<OrderStatusKey>).find(
    (key) => OrderStatus[key] === status,
  );

  return statusKey ? OrderStatusText[statusKey] : 'Неизвестный статус';
};

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

const Orders = () => {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isItemsLoading, setIsItemsLoading] = React.useState(false);
  const [isFinishingOrder, setIsFinishingOrder] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [selectedStatus, setSelectedStatus] = React.useState<SelectedStatusType>(null);

  const toast = React.useRef<Toast>(null);

  React.useEffect(() => {
    const url = selectedStatus ? `${routes.orders}?status=${selectedStatus.code}` : routes.orders;

    setIsLoading(true);

    axios
      .get(url)
      .then((response) => setOrders(response.data))
      .catch((error) => {
        console.error(error);
        const toastOptions = { summary: 'Ошибка загрузки заказов', detail: error.message };
        toast.current?.show({ severity: 'error', ...toastOptions });
      })
      .finally(() => setIsLoading(false));
  }, [selectedStatus]);

  const handleShowItems = (id: string) => () => {
    setIsItemsLoading(true);
    axios
      .get(`${routes.orders}/${id}`)
      .then((response) => setItems(response.data.items))
      .then(() => setVisible(true))
      .catch((error) => {
        console.error(error);
        const toastOptions = { summary: 'Ошибка загрузки списка объявлений', detail: error.message };
        toast.current?.show({ severity: 'error', ...toastOptions });
      })
      .finally(() => setIsItemsLoading(false));
  };

  const handleFinishOrder = (data: Order) => {
    const finishedAt = new Date().toISOString();
    const status = OrderStatus.Received;

    const newData = { ...data, finishedAt, status };
    const newOrders = orders.map((order) => (order.id === data.id ? newData : order));

    const finishOrder = () => {
      setIsFinishingOrder(true);
      axios
        .put(`${routes.orders}/${data.id}`, newData)
        .then(() => setOrders(newOrders))
        .catch((error) => {
          console.error(error);
          toast.current?.show({ severity: 'error', summary: 'Не удалось завершить заказ', detail: error.message });
        })
        .finally(() => setIsFinishingOrder(false));
    };

    confirmDialog({
      message: 'Вы хотите завершить этот заказ?',
      header: 'Завершение заказа',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      acceptLabel: 'Да',
      rejectLabel: 'Нет',
      accept: finishOrder,
    });
  };

  const finishOrderButton = (data: Order) => (
    <Button
      severity="success"
      size="small"
      icon={isFinishingOrder ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
      onClick={() => handleFinishOrder(data)}
      disabled={isFinishingOrder}
      text
    />
  );

  const createdAtBody = (data: Order) => new Date(data.createdAt).toLocaleString();
  const totalBody = (data: Order) => formatNumber(data.total);
  const finishedAtBody = (data: Order) => (
    data.finishedAt ? new Date(data.finishedAt).toLocaleString() : finishOrderButton(data)
  );

  const itemsCountBody = (data: Order) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span>{data.items.length}</span>
      <Button
        severity="info"
        icon={isItemsLoading ? 'pi pi-spin pi-spinner' : 'pi pi-eye'}
        disabled={isItemsLoading}
        onClick={handleShowItems(data.id)}
        rounded
        text
      />
    </div>
  );

  const statusBody = (data: Order) => getOrderStatusText(data.status);

  const handleFilterOrders = (event: DropdownChangeEvent) => {
    const { value } = event;
    setSelectedStatus(value ?? null);
  };

  return (
    <section className="orders">
      <div className="container">
        <Card style={{ margin: '10px auto' }} title="Список заказов">
          {!orders.length && isLoading && <div>Загрузка...</div>}

          <Dropdown
            optionLabel="name"
            placeholder="Выберите статус заказа"
            style={{ minWidth: 320, marginBottom: 10 }}
            value={selectedStatus}
            onChange={handleFilterOrders}
            options={statuses}
            showClear
          />

          <DataTable value={orders} stripedRows paginator rows={10} rowsPerPageOptions={[10, 50, 100]} emptyMessage="Нет заказов для отображения">
            <Column field="id" header="Номер заказа" sortable />
            <Column field="status" header="Статус" sortable body={statusBody} />
            <Column field="createdAt" header="Дата создания" body={createdAtBody} sortable />
            <Column field="finishedAt" header="Дата завершения" body={finishedAtBody} sortable />
            <Column field="itemsCount" header="Количество товаров" body={itemsCountBody} sortable />
            <Column field="deliveryWay" header="Доставка" sortable />
            <Column field="total" header="Сумма заказа" body={totalBody} sortable />
          </DataTable>
        </Card>
      </div>
      <ShowItemsDialog visible={visible} setVisible={setVisible} items={items} />
      <ConfirmDialog />
      <Toast ref={toast} />
    </section>
  );
};

export default Orders;
