import React from 'react';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';

import { InputTextarea } from 'primereact/inputtextarea';
import axios from 'axios';
import { Advertisment } from '../types';

interface IAddItemDialog {
  visible: boolean;
  setVisible: (value: boolean) => void;
  updateData?: (data: Advertisment) => void;
  setData?: React.Dispatch<React.SetStateAction<Advertisment[]>>;
  mode: 'edit' | 'add';
  data?: Advertisment;
}

const initialFormData = {
  id: '',
  name: '',
  description: '',
  imageUrl: '',
  price: 0,
  createdAt: '',
  views: 0,
  likes: 0,
};

const AddItemDialog = (props: IAddItemDialog) => {
  const {
    visible,
    setVisible,
    updateData,
    setData,
    mode,
    data = initialFormData,
  } = props;

  const [formData, setFormData] = React.useState<Advertisment>(data);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleAddItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === 'edit') {
      updateData?.call(null, formData);
      return;
    }

    try {
      setIsSubmitting(true);
      const newData = { ...formData, id: undefined, createdAt: new Date().toISOString() };
      const response = await axios.post('http://localhost:3000/advertisements', newData);
      setData?.call(null, (prevData) => [response.data, ...prevData]);
    } catch (error) {
      console.error(error);
    } finally {
      setVisible(false);
      setFormData(initialFormData);
      setIsSubmitting(false);
    }
  };

  type HandleChangeType = React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>;

  const handleChange = (event: HandleChangeType) => {
    const { name, value } = event.currentTarget;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleChangePrice = (event: InputNumberChangeEvent) => {
    const price = event.value ?? 0;
    setFormData((prevData) => ({ ...prevData, price }));
  };

  const header = mode === 'add' ? 'Добавить объявление' : 'Редактировать объявление';

  return (
    <div className="card flex justify-content-center">
      <Dialog header={header} visible={visible} style={{ width: '50vw', maxWidth: 800 }} onHide={() => setVisible(false)}>
        <form onSubmit={handleAddItem} className="item-dialog-form">
          <label>
            <p>Название:</p>
            <InputText
              disabled={isSubmitting}
              style={{ width: '100%' }}
              onChange={handleChange}
              name="name"
              placeholder="Например, Телевизор LG"
              value={formData.name}
              required
            />
          </label>

          <label>
            <p>Путь к изображению:</p>
            <InputText
              disabled={isSubmitting}
              type="url"
              pattern="https://.*"
              style={{ width: '100%' }}
              onChange={handleChange}
              name="imageUrl"
              placeholder="http(s)://example.com/image.jpg"
              value={formData.imageUrl}
            />
          </label>

          <label>
            <p>Цена:</p>
            <InputNumber
              disabled={isSubmitting}
              style={{ width: '100%' }}
              onChange={handleChangePrice}
              name="price"
              placeholder="Например, 1250"
              min={0}
              value={formData.price || null}
              required
            />
          </label>

          <label>
            <p>Описание:</p>
            <InputTextarea
              placeholder="Опишите свой товар"
              name="description"
              style={{ width: '100%', maxWidth: '100%' }}
              disabled={isSubmitting}
              value={formData.description}
              onChange={handleChange}
            />
          </label>

          <div className="dialog-footer">
            <Button
              type="button"
              label="Не надо"
              icon="pi pi-times"
              onClick={() => setVisible(false)}
              disabled={isSubmitting}
              text
            />
            <Button
              type="submit"
              label={mode === 'add' ? 'Добавить' : 'Сохранить'}
              icon="pi pi-check"
              disabled={isSubmitting}
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default AddItemDialog;
