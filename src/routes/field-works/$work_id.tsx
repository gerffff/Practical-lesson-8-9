import { createFileRoute, useParams, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFieldWork, useUpdateFieldWork } from '../../features/field-works/api';
import { useEffect } from 'react';


export const Route = createFileRoute('/field-works/$work_id')({
  component: () => <FieldWorkDetailPage />,
});

const fieldWorkSchema = z.object({
  crop_id: z.union([z.number().int().positive(), z.literal(''), z.undefined()]).optional(),
  employee_id: z.union([z.number().int().positive(), z.literal(''), z.undefined()]).optional(),
  machinery_id: z.union([z.number().int().positive(), z.literal(''), z.undefined()]).optional(),
  work_type: z.union([
    z.enum([
      'орка',
      'сівба',
      'обробіток міжрядь',
      'полив',
      'внесення добрив',
      'захист від шкідників',
      'збирання врожаю',
      'зяблева оранка',
      'лушення',
      'боронування',
      'прибирання пожнивних залишків',
      'мульчування',
      'підживлення',
      'обприскування',
      'просаджування',
      'кошення',
      'валкування',
      'тюкування',
    ]),
    z.literal(''),
    z.undefined()
  ]).optional(),
  work_start_date: z.string().optional(),
  work_end_date: z.string().optional(),
}).refine((data) => {

  const hasCropId = data.crop_id !== undefined && data.crop_id !== '';
  const hasEmployeeId = data.employee_id !== undefined && data.employee_id !== '';
  const hasMachineryId = data.machinery_id !== undefined && data.machinery_id !== '';
  const hasWorkType = data.work_type !== undefined && data.work_type !== '';
  const hasStartDate = data.work_start_date !== undefined && data.work_start_date !== '';
  const hasEndDate = data.work_end_date !== undefined && data.work_end_date !== '';
  return hasCropId || hasEmployeeId || hasMachineryId || hasWorkType || hasStartDate || hasEndDate;
}, {
  message: "Введіть хоча б одне поле для редагування",
  path: ["root"],
});

type FieldWorkFormData = z.infer<typeof fieldWorkSchema>;

export function FieldWorkDetailPage() {

  const { work_id } = useParams({ from: '/field-works/$work_id' });
  const navigate = useNavigate();
  const workIdNum = parseInt(work_id, 10);
  const { data: fieldWork, isLoading, isError } = useFieldWork(workIdNum);
  const updateFieldWorkMutation = useUpdateFieldWork();

  const { register, handleSubmit, formState: { errors } } = useForm<FieldWorkFormData>({
    resolver: zodResolver(fieldWorkSchema),
    values: fieldWork ? {
      crop_id: fieldWork.crop_id,
      employee_id: fieldWork.employee_id,
      machinery_id: fieldWork.machinery_id,
      work_type: fieldWork.work_type,
      work_start_date: fieldWork.work_start_date ? (typeof fieldWork.work_start_date === 'string' ? fieldWork.work_start_date.split('T')[0] : String(fieldWork.work_start_date)) : '',
      work_end_date: fieldWork.work_end_date ? (typeof fieldWork.work_end_date === 'string' ? fieldWork.work_end_date.split('T')[0] : String(fieldWork.work_end_date)) : '',
    } : undefined,
  });

  const onSubmit = (data: FieldWorkFormData) => {

    const updateData: any = {};
    if (data.crop_id !== undefined && data.crop_id !== '' && typeof data.crop_id === 'number') {
      updateData.crop_id = data.crop_id;
    }
    if (data.employee_id !== undefined && data.employee_id !== '' && typeof data.employee_id === 'number') {
      updateData.employee_id = data.employee_id;
    }
    if (data.machinery_id !== undefined && data.machinery_id !== '' && typeof data.machinery_id === 'number') {
      updateData.machinery_id = data.machinery_id;
    }
    if (data.work_type !== undefined && data.work_type !== '' && typeof data.work_type !== 'undefined') {
      updateData.work_type = data.work_type;
    }
    if (data.work_start_date !== undefined && data.work_start_date !== '') {
      updateData.work_start_date = data.work_start_date;
    }
    if (data.work_end_date !== undefined && data.work_end_date !== '') {
      updateData.work_end_date = data.work_end_date;
    }
    updateFieldWorkMutation.mutate({ id: workIdNum, data: updateData });
  };
  
  useEffect(() => {
    if (updateFieldWorkMutation.isSuccess) {
      navigate({ to: '/field-works' });
    }
  }, [updateFieldWorkMutation.isSuccess, navigate]);

  if (isLoading) return <div>Завантаження даних...</div>;
  if (isError || !fieldWork) return <div>Роботу не знайдено</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Редагування роботи: {work_id}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-800">ID посіву</label>
          <input type="number" step="1" {...register('crop_id', { valueAsNumber: true })} className="w-full p-2 border rounded bg-white text-gray-900" />
          {errors.crop_id && <p className="text-red-500">{errors.crop_id.message}</p>}
          {errors.root && <p className="text-red-500 mt-2">{errors.root.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-800">ID працівника</label>
          <input type="number" step="1" {...register('employee_id', { valueAsNumber: true })} className="w-full p-2 border rounded bg-white text-gray-900" />
          {errors.employee_id && <p className="text-red-500">{errors.employee_id.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-800">ID техніки</label>
          <input type="number" step="1" {...register('machinery_id', { valueAsNumber: true })} className="w-full p-2 border rounded bg-white text-gray-900" />
          {errors.machinery_id && <p className="text-red-500">{errors.machinery_id.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-800">Тип роботи</label>
          <select {...register('work_type')} className="w-full p-2 border rounded bg-white text-gray-900">
            <option value="орка">орка</option>
            <option value="сівба">сівба</option>
            <option value="обробіток міжрядь">обробіток міжрядь</option>
            <option value="полив">полив</option>
            <option value="внесення добрив">внесення добрив</option>
            <option value="захист від шкідників">захист від шкідників</option>
            <option value="збирання врожаю">збирання врожаю</option>
            <option value="зяблева оранка">зяблева оранка</option>
            <option value="лушення">лушення</option>
            <option value="боронування">боронування</option>
            <option value="прибирання пожнивних залишків">прибирання пожнивних залишків</option>
            <option value="мульчування">мульчування</option>
            <option value="підживлення">підживлення</option>
            <option value="обприскування">обприскування</option>
            <option value="просаджування">просаджування</option>
            <option value="кошення">кошення</option>
            <option value="валкування">валкування</option>
            <option value="тюкування">тюкування</option>
          </select>
          {errors.work_type && <p className="text-red-500">{errors.work_type.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-800">Дата початку</label>
          <input type="date" {...register('work_start_date')} className="w-full p-2 border rounded bg-white text-gray-900" />
          {errors.work_start_date && <p className="text-red-500">{errors.work_start_date.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-800">Дата закінчення</label>
          <input type="date" {...register('work_end_date')} className="w-full p-2 border rounded bg-white text-gray-900" />
          {errors.work_end_date && <p className="text-red-500">{errors.work_end_date.message}</p>}
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={updateFieldWorkMutation.isPending} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400">
            {updateFieldWorkMutation.isPending ? 'Зберігаємо...' : 'Зберегти зміни'}
          </button>
          <button
            type="button"
            onClick={() => {
              navigate({ to: '/field-works' });
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Повернутись назад
          </button>
        </div>
      </form>
    </div>
  );
}

