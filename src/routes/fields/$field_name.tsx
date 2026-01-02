import { createFileRoute, useParams, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useField, useUpdateField } from '../../features/fields/api';

export const Route = createFileRoute('/fields/$field_name')({
  component: () => <FieldDetailPage />,
});

const fieldSchema = z.object({
  area_hectares: z.union([z.number().positive(), z.literal(''), z.undefined()]).optional(),
  soil_type: z.union([
    z.enum([
      'чорнозем','супіщаний','суглинковий','піщаний',
      "торф'яний",'глинистий',"кам'янистий",'солончаковий','болотистий'
    ]),
    z.literal(''),
    z.undefined()
  ]).optional(),
  field_location: z.string().optional(),
}).refine((data) => {
  // Проверяем, что хотя бы одно поле заполнено
  const hasArea = data.area_hectares !== undefined && data.area_hectares !== '';
  const hasSoilType = data.soil_type !== undefined && data.soil_type !== '';
  const hasLocation = data.field_location !== undefined && data.field_location !== '';
  return hasArea || hasSoilType || hasLocation;
}, {
  message: "Введіть хоча б одне поле для редагування",
  path: ["root"],
});

type FieldFormData = z.infer<typeof fieldSchema>;

export function FieldDetailPage() {
  const { field_name } = useParams({ from: '/fields/$field_name' });
  const navigate = useNavigate();
  const { data: field, isLoading, isError } = useField(field_name, { forUpdate: true });
  const updateFieldMutation = useUpdateField();

  const { register, handleSubmit, formState: { errors } } = useForm<FieldFormData>({
    resolver: zodResolver(fieldSchema),
    values: field ? {
      area_hectares: field.area_hectares,
      soil_type: field.soil_type,
      field_location: field.field_location,
    } : undefined,
  });

  const onSubmit = (data: FieldFormData) => {
    // Фильтруем пустые поля перед отправкой
    const updateData: any = {};
    if (data.area_hectares !== undefined && data.area_hectares !== '' && typeof data.area_hectares === 'number') {
      updateData.area_hectares = data.area_hectares;
    }
    if (data.soil_type !== undefined && data.soil_type !== '' && typeof data.soil_type !== 'undefined') {
      updateData.soil_type = data.soil_type;
    }
    if (data.field_location !== undefined && data.field_location !== '') {
      updateData.field_location = data.field_location;
    }
    updateFieldMutation.mutate({ field_name, data: updateData });
  };

  if (isLoading) return <div>Завантаження даних...</div>;
  if (isError || !field) return <div>Поле не знайдено</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Редагування поля: {field_name}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-800">Площа (га)</label>
          <input type="number" step="0.001" {...register('area_hectares', { valueAsNumber: true })} className="w-full p-2 border rounded bg-white text-gray-900" />
          {errors.area_hectares && <p className="text-red-500">{errors.area_hectares.message}</p>}
          {errors.root && <p className="text-red-500 mt-2">{errors.root.message}</p>}
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
          <button type="submit" disabled={updateFieldMutation.isPending} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400">
            {updateFieldMutation.isPending ? 'Зберігаємо...' : 'Зберегти зміни'}
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
