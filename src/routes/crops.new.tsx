import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateCrop } from '../features/crops/api';
import { useEffect } from 'react';

export const Route = createFileRoute('/crops/new')({
  component: CropCreatePage,
});

const cropSchema = z.object({
  field_name: z.string().min(1),
  cultivated_plant_name: z.string().min(1),
  crop_start_date: z.string().min(1),
  crop_harvest_date: z.string().min(1),
  actual_harvest_tons: z.number().int().positive(),
  crop_status: z.enum([
    'готується до посіву',
    'засівається',
    'активний',
    'готується до збору',
    'збирається',
    'завершений',
  ]),
});

type CropFormData = z.infer<typeof cropSchema>;

export function CropCreatePage() {
  const navigate = useNavigate();
  const createCropMutation = useCreateCrop();

  useEffect(() => {
    if (createCropMutation.isSuccess) {
      alert('Новий посів успішно створено!');
      navigate({ to: '/crops' });
    }
  }, [createCropMutation.isSuccess, navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm<CropFormData>({
    resolver: zodResolver(cropSchema),
  });

  const onSubmit = (data: CropFormData) => {
    createCropMutation.mutate(data);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Додати новий посів</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-800">Назва поля</label>
          <input {...register('field_name')} className="w-full p-2 border rounded bg-white text-gray-900" />
          {errors.field_name && <p className="text-red-500">{errors.field_name.message}</p>}
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
          <button type="submit" disabled={createCropMutation.isPending} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400">
            {createCropMutation.isPending ? 'Додаємо...' : 'Додати посів'}
          </button>
          <button
            type="button"
            onClick={() => {
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

