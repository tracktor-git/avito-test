import React from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { useSearchParams } from 'react-router-dom';

import axios from 'axios';

import { useToast } from '../../ToastContext';

import ShowItemsDialog from '../Dialogs/ShowItemDialog';

import routes from '../../routes';

import { Order, OrderStatus } from '../../types';

import { formatNumber } from '../../utils';

type OrderStatusKey = keyof typeof OrderStatus;
type SelectedStatusType = { name: string, code: number } | null;

// Обратный маппинг для числовых значений статуса заказа
const OrderStatusText: { [key in OrderStatusKey]: string } = {
  Created: 'Создан',
  Paid: 'Оплачен',
  Transport: 'В пути',
  DeliveredToThePoint: 'Доставлен в пункт',
  Received: 'Получен',
  Archived: 'Архивирован',
  Refund: 'Возврат',
} as const;

const statuses = {
  0: OrderStatusText.Created,
  1: OrderStatusText.Paid,
  2: OrderStatusText.Transport,
  3: OrderStatusText.DeliveredToThePoint,
  4: OrderStatusText.Received,
  5: OrderStatusText.Archived,
  6: OrderStatusText.Refund,
} as const;

const Orders = () => {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isItemsLoading, setIsItemsLoading] = React.useState(false);
  const [isFinishingOrder, setIsFinishingOrder] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [selectedStatus, setSelectedStatus] = React.useState<SelectedStatusType>(null);
  const [searchParams] = useSearchParams();

  const itemID = searchParams.get('item');

  const { showToast } = useToast();

  React.useEffect(() => {
    const url = selectedStatus ? `${routes.orders}?status=${selectedStatus.code}` : routes.orders;

    setIsLoading(true);

    axios
      .get(url)
      .then((response) => {
        if (itemID) {
          const findOrders = (order: Order) => order.items.some((item) => item.id === itemID);
          const filteredOrders = response.data.filter(findOrders);
          setOrders(filteredOrders);
          return;
        }
        setOrders(response.data);
      })
      .catch((error) => {
        console.error(error);
        const toastOptions = { summary: 'Ошибка загрузки заказов', detail: error.message };
        showToast({ severity: 'error', ...toastOptions });
      })
      .finally(() => setIsLoading(false));
  }, [selectedStatus, itemID, showToast]);

  const handleShowItems = (id: string) => () => {
    setIsItemsLoading(true);
    axios
      .get(`${routes.orders}/${id}`)
      .then((response) => setItems(response.data.items))
      .then(() => setVisible(true))
      .catch((error) => {
        console.error(error);
        const toastOptions = { summary: 'Ошибка загрузки списка объявлений', detail: error.message };
        showToast({ severity: 'error', ...toastOptions });
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
          showToast({ severity: 'error', summary: 'Не удалось завершить заказ', detail: error.message });
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

  const statusBody = (data: Order) => statuses[data.status];

  const handleFilterOrders = (event: DropdownChangeEvent) => setSelectedStatus(event.value ?? null);

  const emptyMessage = !orders.length && isLoading ? 'Загрузка...' : 'Нет заказов для отображения';

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
            options={Object.entries(statuses).map(([code, name]) => ({ code, name }))}
            showClear
          />

          <DataTable
            value={orders}
            rows={10}
            rowsPerPageOptions={[10, 50, 100]}
            emptyMessage={emptyMessage}
            stripedRows
            paginator
          >
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
    </section>
  );
};

export default Orders;
