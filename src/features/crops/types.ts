export type CropStatus =
  | 'готується до посіву'
  | 'засівається'
  | 'активний'
  | 'готується до збору'
  | 'збирається'
  | 'завершений';

export type Crop = {
  crop_id: number;
  field_name: string;
  cultivated_plant_name: string;
  crop_start_date: string;
  crop_harvest_date: string;
  actual_harvest_tons: number;
  crop_status: CropStatus;
};
