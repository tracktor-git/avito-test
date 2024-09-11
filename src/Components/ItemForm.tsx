import React from 'react';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';

import { Advertisment as A } from '../types';

type ItemValues = {
  data?: Pick<A, 'name' | 'imageUrl' | 'price' | 'description'>,
  submitLabel: string,
  isDisabled: boolean,
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  onCancel: () => void,
  // setValues: React.Dispatch<React.SetStateAction<Omit<Advertisment, 'id'> & { id?: string }>>,
  setValues: (...args: any[]) => void, // Я хз как это типизировать...
};

const ItemForm: React.FC<ItemValues> = (props) => {
  const {
    data,
    submitLabel,
    isDisabled,
    onSubmit,
    onCancel,
    setValues,
  } = props;

  return (
    <form className="item-dialog-form" onSubmit={onSubmit}>
      <label>
        <p>Название:</p>
        <InputText
          name="name"
          placeholder="Например, Телевизор LG"
          value={data?.name}
          onChange={(e) => setValues((prev: A) => ({ ...prev, name: e.target.value.trim() }))}
          required
        />
      </label>

      <label>
        <p>URL изображения:</p>
        <InputText
          type="url"
          name="imageUrl"
          placeholder="http://example.com/image.jpg"
          value={data?.imageUrl}
          onChange={(e) => setValues((prev: A) => ({ ...prev, imageUrl: e.target.value.trim() }))}
        />
      </label>

      <label>
        <p>Цена:</p>
        <InputNumber
          name="price"
          placeholder="Цена товара"
          style={{ width: '100%' }}
          value={data?.price}
          onChange={(event) => setValues((prev: A) => ({ ...prev, price: event.value || 0 }))}
          required
        />
      </label>

      <label>
        <p>Описание объявления</p>
        <InputTextarea
          name="description"
          value={data?.description}
          onChange={
            (e) => setValues((prev: A) => ({ ...prev, description: e.target.value.trim() }))
          }
        />
      </label>

      <div className="item-form-footer">
        <Button
          type="button"
          label="Не надо"
          icon="pi pi-times"
          onClick={onCancel}
          disabled={isDisabled}
          text
        />
        <Button
          type="submit"
          label={submitLabel}
          icon="pi pi-check"
          disabled={isDisabled}
        />
      </div>
    </form>
  );
};

export default ItemForm;
