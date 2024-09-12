import React from 'react';

import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import { Filter } from '../Pages/Advertisements';

type OptionCodes = 'name' | 'price' | 'views' | 'likes';
type FilterOption = { name: string, code: OptionCodes };

const options: FilterOption[] = [
  { name: 'По наименованию', code: 'name' },
  { name: 'По цене', code: 'price' },
  { name: 'По просмотрам', code: 'views' },
  { name: 'По лайкам', code: 'likes' },
] as const;

interface IAdvertisementsFilters {
  resetPage: () => void;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
}

const AdvertisementsFilters = (props: IAdvertisementsFilters) => {
  const { resetPage, setFilter } = props;

  const [selectedOption, setSelectedOption] = React.useState<FilterOption | null>(null);
  const [value, setValue] = React.useState('');

  const map = {
    name: 'Введите наименование',
    price: 'Введите цену',
    views: 'Введите кол-во просмотров',
    likes: 'Введите кол-во лайков',
  };

  const placeholder = selectedOption ? map[selectedOption.code] : undefined;

  const handleFilter = () => {
    if (!selectedOption?.code || !value) return;

    const filter: Filter = { name: selectedOption?.code, value };
    setFilter(filter);
    resetPage();
  };

  const handleDropdownChange = (event: DropdownChangeEvent) => {
    setSelectedOption(event.value);
    setFilter(null);
    setValue('');
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
