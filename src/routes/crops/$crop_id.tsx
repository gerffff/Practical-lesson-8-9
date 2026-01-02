import { createFileRoute, useParams, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCrop, useUpdateCrop } from '../../features/crops/api';
import { useEffect } from 'react';

// @ts-expect-error - Route will be generated when route tree is regenerated
export const Route = createFileRoute('/crops/$crop_id')({
  component: () => <CropDetailPage />,
});

const cropSchema = z.object({
  field_name: z.string().optional(),
  cultivated_plant_name: z.string().optional(),
  crop_start_date: z.string().optional(),
  crop_harvest_date: z.string().optional(),
  actual_harvest_tons: z.union([z.number().int().positive(), z.literal(''), z.undefined()]).optional(),
  crop_status: z.union([
    z.enum([
      'готується до посіву',
      'засівається',
      'активний',
      'готується до збору',
      'збирається',
      'завершений',
    ]),
    z.literal(''),
    z.undefined()
  ]).optional(),
}).refine((data) => {
  // Проверяем, что хотя бы одно поле заполнено
  const hasFieldName = data.field_name !== undefined && data.field_name !== '';
  const hasPlantName = data.cultivated_plant_name !== undefined && data.cultivated_plant_name !== '';
  const hasStartDate = data.crop_start_date !== undefined && data.crop_start_date !== '';
  const hasHarvestDate = data.crop_harvest_date !== undefined && data.crop_harvest_date !== '';
  const hasTons = data.actual_harvest_tons !== undefined && data.actual_harvest_tons !== '';
  const hasStatus = data.crop_status !== undefined && data.crop_status !== '';
  return hasFieldName || hasPlantName || hasStartDate || hasHarvestDate || hasTons || hasStatus;
}, {
  message: "Введіть хоча б одне поле для редагування",
  path: ["root"],
});

type CropFormData = z.infer<typeof cropSchema>;

export function CropDetailPage() {
  // @ts-expect-error - Route will be generated when route tree is regenerated
  const { crop_id } = useParams({ from: '/crops/$crop_id' });
  const navigate = useNavigate();
  const cropIdNum = parseInt(crop_id, 10);
  const { data: crop, isLoading, isError } = useCrop(cropIdNum);
  const updateCropMutation = useUpdateCrop();

  const { register, handleSubmit, formState: { errors } } = useForm<CropFormData>({
    resolver: zodResolver(cropSchema),
    values: crop ? {
      field_name: crop.field_name,
      cultivated_plant_name: crop.cultivated_plant_name,
      crop_start_date: crop.crop_start_date ? (typeof crop.crop_start_date === 'string' ? crop.crop_start_date.split('T')[0] : String(crop.crop_start_date)) : '',
      crop_harvest_date: crop.crop_harvest_date ? (typeof crop.crop_harvest_date === 'string' ? crop.crop_harvest_date.split('T')[0] : String(crop.crop_harvest_date)) : '',
      actual_harvest_tons: crop.actual_harvest_tons,
      crop_status: crop.crop_status,
    } : undefined,
  });

  const onSubmit = (data: CropFormData) => {
    // Фильтруем пустые поля перед отправкой
    const updateData: any = {};
    if (data.field_name !== undefined && data.field_name !== '') {
      updateData.field_name = data.field_name;
    }
    if (data.cultivated_plant_name !== undefined && data.cultivated_plant_name !== '') {
      updateData.cultivated_plant_name = data.cultivated_plant_name;
    }
    if (data.crop_start_date !== undefined && data.crop_start_date !== '') {
      updateData.crop_start_date = data.crop_start_date;
    }
    if (data.crop_harvest_date !== undefined && data.crop_harvest_date !== '') {
      updateData.crop_harvest_date = data.crop_harvest_date;
    }
    if (data.actual_harvest_tons !== undefined && data.actual_harvest_tons !== '' && typeof data.actual_harvest_tons === 'number') {
      updateData.actual_harvest_tons = data.actual_harvest_tons;
    }
    if (data.crop_status !== undefined && data.crop_status !== '' && typeof data.crop_status !== 'undefined') {
      updateData.crop_status = data.crop_status;
    }
    updateCropMutation.mutate({ id: cropIdNum, data: updateData });
  };
  
  useEffect(() => {
    if (updateCropMutation.isSuccess) {
      // @ts-expect-error - Route will be generated when route tree is regenerated
      navigate({ to: '/crops' });
    }
  }, [updateCropMutation.isSuccess, navigate]);

  if (isLoading) return <div>Завантаження даних...</div>;
  if (isError || !crop) return <div>Посів не знайдено</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Редагування посіву: {crop_id}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-800">Назва поля</label>
          <input {...register('field_name')} className="w-full p-2 border rounded bg-white text-gray-900" />
          {errors.field_name && <p className="text-red-500">{errors.field_name.message}</p>}
          {errors.root && <p className="text-red-500 mt-2">{errors.root.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-800">Назва рослини</label>
          <input {...register('cultivated_plant_name')} className="w-full p-2 border rounded bg-white text-gray-900" />
          {errors.cultivated_plant_name && <p className="text-red-500">{errors.cultivated_plant_name.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-800">Дата початку</label>
          <input type="date" {...register('crop_start_date')} className="w-full p-2 border rounded bg-white text-gray-900" />
          {errors.crop_start_date && <p className="text-red-500">{errors.crop_start_date.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-800">Дата збору</label>
          <input type="date" {...register('crop_harvest_date')} className="w-full p-2 border rounded bg-white text-gray-900" />
          {errors.crop_harvest_date && <p className="text-red-500">{errors.crop_harvest_date.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-800">Урожай (т)</label>
          <input type="number" step="1" {...register('actual_harvest_tons', { valueAsNumber: true })} className="w-full p-2 border rounded bg-white text-gray-900" />
          {errors.actual_harvest_tons && <p className="text-red-500">{errors.actual_harvest_tons.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-800">Статус</label>
          <select {...register('crop_status')} className="w-full p-2 border rounded bg-white text-gray-900">
            <option value="готується до посіву">готується до посіву</option>
            <option value="засівається">засівається</option>
            <option value="активний">активний</option>
            <option value="готується до збору">готується до збору</option>
            <option value="збирається">збирається</option>
            <option value="завершений">завершений</option>
          </select>
          {errors.crop_status && <p className="text-red-500">{errors.crop_status.message}</p>}
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={updateCropMutation.isPending} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400">
            {updateCropMutation.isPending ? 'Зберігаємо...' : 'Зберегти зміни'}
          </button>
          <button
            type="button"
            onClick={() => {
              // @ts-expect-error - Route will be generated when route tree is regenerated
              navigate({ to: '/crops' });
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

