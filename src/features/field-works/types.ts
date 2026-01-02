export type WorkType =
  | 'орка'
  | 'сівба'
  | 'обробіток міжрядь'
  | 'полив'
  | 'внесення добрив'
  | 'захист від шкідників'
  | 'збирання врожаю'
  | 'зяблева оранка'
  | 'лушення'
  | 'боронування'
  | 'прибирання пожнивних залишків'
  | 'мульчування'
  | 'підживлення'
  | 'обприскування'
  | 'просаджування'
  | 'кошення'
  | 'валкування'
  | 'тюкування';

export type FieldWork = {
  work_id: number;
  crop_id: number;
  employee_id: number;
  machinery_id: number;
  work_type: WorkType;
  work_start_date: string;
  work_end_date: string;
};
