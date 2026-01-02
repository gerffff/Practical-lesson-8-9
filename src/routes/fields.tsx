import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router';
import { useFields, useDeleteField } from '../features/fields/api';
import apiClient from '../lib/axios';
import { useQueryClient } from '@tanstack/react-query';

export const Route = createFileRoute('/fields' as any)({
  component: FieldsListPage,
});

export default function FieldsListPage() {
  const location = useLocation();
  const { data: fields, isLoading, isError, error } = useFields();
  const deleteFieldMutation = useDeleteField();
  const queryClient = useQueryClient();

  const handleDelete = async (field_name: string) => {
    if (window.confirm('Видалити це поле? Всі пов\'язані посіви та роботи також будуть видалені.')) {
      try {
        // Получаем все посевы для этого поля
        const cropsResponse = await apiClient.get('/crops');
        const cropsData = cropsResponse.data;
        const allCrops = Array.isArray(cropsData) ? cropsData : (cropsData?.data || []);
        const fieldCrops = allCrops.filter((crop: any) => crop.field_name === field_name);
        
        // Получаем все полевые работы
        const worksResponse = await apiClient.get('/field-works');
        const worksData = worksResponse.data;
        const allWorks = Array.isArray(worksData) ? worksData : (worksData?.data || []);
        
        let deletedWorksCount = 0;
        // Удаляем все полевые работы для этих посевов
        for (const crop of fieldCrops) {
          const cropWorks = allWorks.filter((work: any) => work.crop_id === crop.crop_id);
          for (const work of cropWorks) {
            await apiClient.delete(`/field-works/${work.work_id}`);
            deletedWorksCount++;
          }
          // Удаляем посев
          await apiClient.delete(`/crops/${crop.crop_id}`);
        }
        
        // Теперь удаляем поле
        deleteFieldMutation.mutate(field_name, {
          onSuccess: () => {
            // Обновляем кэш для всех связанных данных
            queryClient.invalidateQueries({ queryKey: ['fields'] });
            queryClient.invalidateQueries({ queryKey: ['crops'] });
            queryClient.invalidateQueries({ queryKey: ['field-works'] });
            
            // Показываем сообщение о количестве удаленных записей
            const cropsCount = fieldCrops.length;
            if (cropsCount > 0 || deletedWorksCount > 0) {
              alert(`Поле видалено. Також видалено: ${cropsCount} посівів та ${deletedWorksCount} робіт.`);
            } else {
              alert('Поле успішно видалено.');
            }
          }
        });
      } catch (err) {
        alert('Помилка при видаленні: ' + (err as Error).message);
      }
    }
  };

  // Если мы на странице создания или редактирования, показываем только Outlet
  if (location.pathname !== '/fields' && location.pathname.startsWith('/fields')) {
    return <Outlet />;
  }

  if (isLoading) return <div>Завантаження...</div>;
  if (isError) return <div>Помилка: {(error as any).message}</div>;

  // Сортируем по названию поля по возрастанию
  const sortedFields = fields ? [...fields].sort((a, b) => 
    a.field_name.localeCompare(b.field_name, 'uk')
  ) : [];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Поля</h1>
        <Link
          to={"/fields/new" as any}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Додати поле
        </Link>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Назва</th>
            <th className="py-2 px-4 border-b">Площа (га)</th>
            <th className="py-2 px-4 border-b">Тип ґрунту</th>
            <th className="py-2 px-4 border-b">Локація</th>
            <th className="py-2 px-4 border-b">Дії</th>
          </tr>
        </thead>
        <tbody>
          {sortedFields.map((field) => (
            <tr key={field.field_name}>
              <td className="py-2 px-4 border-b">{field.field_name}</td>
              <td className="py-2 px-4 border-b">{field.area_hectares}</td>
              <td className="py-2 px-4 border-b">{field.soil_type}</td>
              <td className="py-2 px-4 border-b">{field.field_location}</td>
              <td className="py-2 px-4 border-b text-center">
                <Link
                  to={"/fields/$field_name" as any}
                  params={{ field_name: field.field_name } as any}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Редагувати
                </Link>
                <button
                  onClick={() => handleDelete(field.field_name)}
                  disabled={deleteFieldMutation.isPending}
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
