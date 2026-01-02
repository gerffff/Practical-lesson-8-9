import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateField } from '../features/fields/api';
import { useEffect } from 'react';

export const Route = createFileRoute('/fields/new')({
  component: FieldCreatePage,
});

const fieldSchema = z.object({
  field_name: z.string().min(1),
  area_hectares: z.number().positive(),
  soil_type: z.enum([
    'чорнозем','супіщаний','суглинковий','піщаний',
    "торф'яний",'глинистий',"кам'янистий",'солончаковий','болотистий'
  ]),
  field_location: z.string().min(1),
});

type FieldFormData = z.infer<typeof fieldSchema>;

export function FieldCreatePage() {
  const navigate = useNavigate();
  const createFieldMutation = useCreateField();

  const { register, handleSubmit, formState: { errors } } = useForm<FieldFormData>({
    resolver: zodResolver(fieldSchema),
  });

  useEffect(() => {
    if (createFieldMutation.isSuccess) {
      alert('Нове поле успішно створено!');
      navigate({ to: '/fields' });
    }
  }, [createFieldMutation.isSuccess, navigate]);

  const onSubmit = (data: FieldFormData) => {
    createFieldMutation.mutate(data);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Додати нове поле</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-800">Назва поля</label>
          <input {...register('field_name')} className="w-full p-2 border rounded bg-white text-gray-900" />
          {errors.field_name && <p className="text-red-500">{errors.field_name.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-800">Площа (га)</label>
          <input type="number" step="0.001" {...register('area_hectares', { valueAsNumber: true })} className="w-full p-2 border rounded bg-white text-gray-900" />
          {errors.area_hectares && <p className="text-red-500">{errors.area_hectares.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-800">Тип ґрунту</label>
          <select {...register('soil_type')} className="w-full p-2 border rounded bg-white text-gray-900">
            <option value="чорнозем">чорнозем</option>
            <option value="супіщаний">супіщаний</option>
            <option value="суглинковий">суглинковий</option>
            <option value="піщаний">піщаний</option>
            <option value="торф'яний">торф'яний</option>
            <option value="глинистий">глинистий</option>
            <option value="кам'янистий">кам'янистий</option>
            <option value="солончаковий">солончаковий</option>
            <option value="болотистий">болотистий</option>
          </select>
          {errors.soil_type && <p className="text-red-500">{errors.soil_type.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-800">Локація</label>
          <input {...register('field_location')} className="w-full p-2 border rounded bg-white text-gray-900" />
          {errors.field_location && <p className="text-red-500">{errors.field_location.message}</p>}
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={createFieldMutation.isPending} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400">
            {createFieldMutation.isPending ? 'Додаємо...' : 'Додати поле'}
          </button>
          <button
            type="button"
            onClick={() => {
              navigate({ to: '/fields' });
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
