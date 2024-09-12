import React from 'react';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import ItemForm from '../Parts/ItemForm';

import { useToast } from '../../ToastContext';

import routes from '../../routes';

import { Advertisment, ItemFormData } from '../../types';

interface IEditItemDialog {
  visible: boolean;
  setVisible: (value: boolean) => void;
  setData: (item: Advertisment) => void;
  data: Advertisment;
}

const EditItemDialog = (props: IEditItemDialog) => {
  const {
    visible,
    setVisible,
    setData,
    data,
  } = props;

  const editData: ItemFormData = {
    name: data.name,
    price: data.price,
    description: data.description,
    imageUrl: data.imageUrl,
  };

  const [formData, setFormData] = React.useState<ItemFormData>(editData);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { showToast } = useToast();

  const handleAddItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const sendData = { ...formData, id: data.id };

    axios
      .patch(`${routes.advertisements}/${data.id}`, sendData)
      .then((response) => setData(response.data))
      .catch((error) => {
        console.error(error);
        showToast({ severity: 'error', summary: 'Ошибка сохранения объявления', detail: error.message });
      })
      .finally(() => {
        setVisible(false);
        setIsSubmitting(false);
      });
  };

  return (
    <Dialog
      header="Редактировать объявление"
      className="item-dialog"
      visible={visible}
      onHide={() => setVisible(false)}
    >
      <ItemForm
        submitLabel="Сохранить"
        onCancel={() => setVisible(false)}
        isDisabled={isSubmitting}
        onSubmit={handleAddItem}
        setValues={setFormData}
        data={formData}
      />
    </Dialog>
  );
};

export default EditItemDialog;
