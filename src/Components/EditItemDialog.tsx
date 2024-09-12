import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import ItemForm from './ItemForm';

import routes from '../routes';

import { Advertisment, ItemFormData } from '../types';

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

  const toast = React.useRef<Toast>(null);

  const handleAddItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const sendData = { ...formData, id: data.id };

    axios
      .patch(`${routes.advertisements}/${data.id}`, sendData)
      .then((response) => setData(response.data))
      .catch((error) => {
        console.error(error);
        toast.current?.show({ severity: 'error', summary: 'Ошибка сохранения объявления', detail: error.message });
      })
      .finally(() => {
        setVisible(false);
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <Dialog
        header="Редактировать объявление"
        visible={visible}
        style={{ width: '50vw', maxWidth: 800 }}
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
      <Toast ref={toast} />
    </>
  );
};

export default EditItemDialog;
