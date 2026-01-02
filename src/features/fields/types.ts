export type SoilType =
  | 'чорнозем'
  | 'супіщаний'
  | 'суглинковий'
  | 'піщаний'
  | "торф'яний"
  | 'глинистий'
  | "кам'янистий"
  | 'солончаковий'
  | 'болотистий';

export type Field = {
  field_name: string;
  area_hectares: number;
  soil_type: SoilType;
  field_location: string;
};
