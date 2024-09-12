import React from 'react';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import ItemForm from '../Parts/ItemForm';

import { Advertisment, ItemFormData } from '../../types';
import routes from '../../routes';

import { useToast } from '../../ToastContext';

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

  const initialFormData = {
    name: '',
    price: 0,
    description: '',
    imageUrl: '',
  };

  const [formData, setFormData] = React.useState<ItemFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { showToast } = useToast();

  const handleAddItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const createdAt = new Date().toISOString();
    const newData = { ...initialData, ...formData, createdAt };

    axios
      .post(routes.advertisements, newData)
      .then(({ data }) => setData(data))
      .catch((error) => {
        console.error(error);
        showToast({ severity: 'error', summary: 'Ошибка добавления объявления', detail: error.message });
      })
      .finally(() => {
        setVisible(false);
        setIsSubmitting(false);
      });
  };

  return (
    <Dialog
      header="Добавить объявление"
      className="item-dialog"
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
  );
};

export default AddItemDialog;
