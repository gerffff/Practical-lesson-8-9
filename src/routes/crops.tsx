import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router';
import { useCrops, useDeleteCrop } from '../features/crops/api';
import apiClient from '../lib/axios';
import { useQueryClient } from '@tanstack/react-query';


export const Route = createFileRoute('/crops')({
  component: CropsListPage,
});

export default function CropsListPage() {
  const location = useLocation();
  const { data: crops, isLoading, isError, error } = useCrops();
  const deleteCropMutation = useDeleteCrop();
  const queryClient = useQueryClient();

  const handleDelete = async (crop_id: number) => {
    if (window.confirm('Видалити цей посів? Всі пов\'язані роботи також будуть видалені.')) {
      try {
        // Получаем все полевые работы
        const worksResponse = await apiClient.get('/field-works');
        const worksData = worksResponse.data;
        const allWorks = Array.isArray(worksData) ? worksData : (worksData?.data || []);
        const cropWorks = allWorks.filter((work: any) => work.crop_id === crop_id);
        
        // Удаляем все полевые работы для этого посева
        for (const work of cropWorks) {
          await apiClient.delete(`/field-works/${work.work_id}`);
        }
        
        const deletedWorksCount = cropWorks.length;
        
        // Теперь удаляем посев
        deleteCropMutation.mutate(crop_id, {
          onSuccess: () => {
            // Обновляем кэш для всех связанных данных
            queryClient.invalidateQueries({ queryKey: ['crops'] });
            queryClient.invalidateQueries({ queryKey: ['field-works'] });
            
            // Показываем сообщение о количестве удаленных записей
            if (deletedWorksCount > 0) {
              alert(`Посів видалено. Також видалено: ${deletedWorksCount} робіт.`);
            } else {
              alert('Посів успішно видалено.');
            }
          }
        });
      } catch (err) {
        alert('Помилка при видаленні: ' + (err as Error).message);
      }
    }
  };

  // Если мы на странице создания или редактирования, показываем только Outlet
  if (location.pathname !== '/crops' && location.pathname.startsWith('/crops')) {
    return <Outlet />;
  }

  if (isLoading) return <div>Завантаження...</div>;
  if (isError) return <div>Помилка: {(error as any).message}</div>;

  // Сортируем по ID по возрастанию
  const sortedCrops = crops ? [...crops].sort((a, b) => a.crop_id - b.crop_id) : [];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Посіви</h1>
        <Link
          to={"/crops/new" as any}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Додати посів
        </Link>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Назва поля</th>
            <th className="py-2 px-4 border-b">Назва рослини</th>
            <th className="py-2 px-4 border-b">Дата початку</th>
            <th className="py-2 px-4 border-b">Дата збору</th>
            <th className="py-2 px-4 border-b">Урожай (т)</th>
            <th className="py-2 px-4 border-b">Статус</th>
            <th className="py-2 px-4 border-b">Дії</th>
          </tr>
        </thead>
        <tbody>
          {sortedCrops.map((crop) => (
            <tr key={crop.crop_id}>
              <td className="py-2 px-4 border-b">{crop.crop_id}</td>
              <td className="py-2 px-4 border-b">{crop.field_name}</td>
              <td className="py-2 px-4 border-b">{crop.cultivated_plant_name}</td>
              <td className="py-2 px-4 border-b">{new Date(crop.crop_start_date).toLocaleDateString('uk-UA')}</td>
              <td className="py-2 px-4 border-b">{new Date(crop.crop_harvest_date).toLocaleDateString('uk-UA')}</td>
              <td className="py-2 px-4 border-b">{crop.actual_harvest_tons}</td>
              <td className="py-2 px-4 border-b">{crop.crop_status}</td>
              <td className="py-2 px-4 border-b text-center">
                <Link
                  to={"/crops/$crop_id" as any}
                  params={{ crop_id: crop.crop_id.toString() } as any}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Редагувати
                </Link>
                <button
                  onClick={() => handleDelete(crop.crop_id)}
                  disabled={deleteCropMutation.isPending}
                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                >
                  Видалити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

