import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateFieldWork } from '../features/field-works/api';
import { useEffect } from 'react';

export const Route = createFileRoute('/field-works/new')({
  component: FieldWorkCreatePage,
});

const fieldWorkSchema = z.object({
  crop_id: z.number().int().positive(),
  employee_id: z.number().int().positive(),
  machinery_id: z.number().int().positive(),
  work_type: z.enum([
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
  work_start_date: z.string().min(1),
  work_end_date: z.string().min(1),
});

type FieldWorkFormData = z.infer<typeof fieldWorkSchema>;

export function FieldWorkCreatePage() {
  const navigate = useNavigate();
  const createFieldWorkMutation = useCreateFieldWork();

  useEffect(() => {
    if (createFieldWorkMutation.isSuccess) {
      alert('Нову роботу успішно створено!');
      navigate({ to: '/field-works' });
    }
  }, [createFieldWorkMutation.isSuccess, navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm<FieldWorkFormData>({
    resolver: zodResolver(fieldWorkSchema),
  });

  const onSubmit = (data: FieldWorkFormData) => {
    createFieldWorkMutation.mutate(data);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Додати нову роботу</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-800">ID посіву</label>
          <input type="number" step="1" {...register('crop_id', { valueAsNumber: true })} className="w-full p-2 border rounded bg-white text-gray-900" />
          {errors.crop_id && <p className="text-red-500">{errors.crop_id.message}</p>}
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
          <button type="submit" disabled={createFieldWorkMutation.isPending} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400">
            {createFieldWorkMutation.isPending ? 'Додаємо...' : 'Додати роботу'}
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

