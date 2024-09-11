import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import ItemForm from './ItemForm';

import { Advertisment } from '../types';
import routes from '../routes';

const initialData = {
  name: '',
  description: '',
  imageUrl: '',
  price: 0,
  createdAt: '',
  views: 0,
  likes: 0,
};

interface IAddItemDialog {
  visible: boolean;
  setVisible: (value: boolean) => void;
  setData: (item: Advertisment) => void;
}

const AddItemDialog = (props: IAddItemDialog) => {
  const {
    visible,
    setVisible,
    setData,
  } = props;

  const [formData, setFormData] = React.useState<Omit<Advertisment, 'id'>>(initialData);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const toast = React.useRef<Toast>(null);

  const handleAddItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const newData = { ...initialData, ...formData, createdAt: new Date().toISOString() };

    axios
      .post(routes.advertisements, newData)
      .then(({ data }) => setData(data))
      .catch((error) => {
        console.error(error);
        toast.current?.show({ severity: 'error', summary: 'Ошибка добавления объявления', detail: error.message });
      })
      .finally(() => {
        setVisible(false);
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <Dialog
        header="Добавить объявление"
        className="add-item-dialog"
        visible={visible}
        onHide={() => setVisible(false)}
      >
        <ItemForm
          submitLabel="Добавить"
          onCancel={() => setVisible(false)}
          isDisabled={isSubmitting}
          onSubmit={handleAddItem}
          setValues={setFormData}
        />
      </Dialog>
      <Toast ref={toast} />
    </>
  );
};

export default AddItemDialog;
