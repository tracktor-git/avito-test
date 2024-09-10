import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Advertisment } from '../types';

import { formatNumber } from '../utils';

import noImage from '../assets/no-image.jpg';

const cardInfoStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: '#ccc',
  fontSize: 12,
};

const AdvertisementCard = (props: Advertisment) => {
  const {
    name,
    imageUrl,
    price,
    views,
    likes,
  } = props;

  return (
    <Card title={name}>
      <div className="card-image">
        <img
          src={imageUrl || noImage}
          alt={name}
          style={{ maxWidth: '100%', pointerEvents: 'none', userSelect: 'none' }}
        />
      </div>

      <div style={cardInfoStyles}>
        <Tag icon="pi pi-tag" severity="success" value={formatNumber(price)} />
        <p title="Просмотров" className="card-info-item">
          <i className="pi pi-eye" />
          {formatNumber(views, 'number')}
        </p>
        <p title="Лайков" className="card-info-item">
          <i className="pi pi-heart" />
          {likes}
        </p>
      </div>
    </Card>
  );
};

export default AdvertisementCard;
