import React from 'react';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import { Advertisment } from '../types';

type OptionCodes = 'name' | 'price' | 'views' | 'likes';
type FilterOption = { name: string, code: OptionCodes };

const options: FilterOption[] = [
  { name: 'По наименованию', code: 'name' },
  { name: 'По цене', code: 'price' },
  { name: 'По просмотрам', code: 'views' },
  { name: 'По лайкам', code: 'likes' },
];

interface IAdvertisementsFilters {
  data: Advertisment[];
  setData: React.Dispatch<React.SetStateAction<Advertisment[]>>;
  resetPages: () => void;
}

const AdvertisementsFilters = (props: IAdvertisementsFilters) => {
  const { data, setData, resetPages } = props;

  const [selectedOption, setSelectedOption] = React.useState<FilterOption | null>(null);
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    if (!selectedOption && selectedOption !== null) setData(data);
  }, [selectedOption, data, setData]);

  const filterStrings = () => data.filter((item) => item.name.toLowerCase().includes(value));
  const filterNumbers = () => data.filter((item) => {
    const key = selectedOption ? item[selectedOption.code] : null;

    if (key || key === 0) {
      return key === Number(value);
    }

    return false;
  });

  const map = {
    name: { placeholder: 'Введите наименование', filter: filterStrings },
    price: { placeholder: 'Введите цену', filter: filterNumbers },
    views: { placeholder: 'Введите кол-во просмотров', filter: filterNumbers },
    likes: { placeholder: 'Введите кол-во лайков', filter: filterNumbers },
  };

  const placeholder = selectedOption ? map[selectedOption.code].placeholder : undefined;
  const currentFilter = selectedOption ? map[selectedOption.code].filter : null;

  const handleFilter = () => {
    if (!currentFilter || !value) return;
    setData(currentFilter());
    resetPages();
  };

  const handleDropdownChange = (event: DropdownChangeEvent) => {
    setSelectedOption(event.value);
    setValue('');
    resetPages();
    setData(data);
  };

  return (
    <div className="advertisements-filters">

      <Dropdown
        className="advertisements-dropdown"
        value={selectedOption}
        onChange={handleDropdownChange}
        options={options}
        optionLabel="name"
        placeholder="Выберите фильтр"
        showClear
      />

      {selectedOption && (
      <>
        <InputText
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value.trim().toLowerCase())}
          disabled={!selectedOption}
        />
        <Button icon="pi pi-search-plus" onClick={handleFilter} severity="success" />
      </>
      )}
    </div>
  );
};

export default AdvertisementsFilters;
