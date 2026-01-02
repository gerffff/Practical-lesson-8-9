import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router';
import { useFieldWorks, useDeleteFieldWork } from '../features/field-works/api';

export const Route = createFileRoute('/field-works')({
  component: FieldWorksListPage,
});

export default function FieldWorksListPage() {
  const location = useLocation();
  const { data: fieldWorks, isLoading, isError, error } = useFieldWorks();
  const deleteFieldWorkMutation = useDeleteFieldWork();

  const handleDelete = (work_id: number) => {
    if (window.confirm('Видалити цю роботу?')) {
      deleteFieldWorkMutation.mutate(work_id);
    }
  };

  // Если мы на странице создания или редактирования, показываем только Outlet
  if (location.pathname !== '/field-works' && location.pathname.startsWith('/field-works')) {
    return <Outlet />;
  }

  if (isLoading) return <div>Завантаження...</div>;
  if (isError) return <div>Помилка: {(error as any).message}</div>;

  // Сортируем по ID по возрастанию
  const sortedFieldWorks = fieldWorks ? [...fieldWorks].sort((a, b) => a.work_id - b.work_id) : [];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Польові роботи</h1>
        <Link
          to={"/field-works/new" as any}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Додати роботу
        </Link>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">ID посіву</th>
            <th className="py-2 px-4 border-b">ID працівника</th>
            <th className="py-2 px-4 border-b">ID техніки</th>
            <th className="py-2 px-4 border-b">Тип роботи</th>
            <th className="py-2 px-4 border-b">Дата початку</th>
            <th className="py-2 px-4 border-b">Дата закінчення</th>
            <th className="py-2 px-4 border-b">Дії</th>
          </tr>
        </thead>
        <tbody>
          {sortedFieldWorks.map((work) => (
            <tr key={work.work_id}>
              <td className="py-2 px-4 border-b">{work.work_id}</td>
              <td className="py-2 px-4 border-b">{work.crop_id}</td>
              <td className="py-2 px-4 border-b">{work.employee_id}</td>
              <td className="py-2 px-4 border-b">{work.machinery_id}</td>
              <td className="py-2 px-4 border-b">{work.work_type}</td>
              <td className="py-2 px-4 border-b">{new Date(work.work_start_date).toLocaleDateString('uk-UA')}</td>
              <td className="py-2 px-4 border-b">{new Date(work.work_end_date).toLocaleDateString('uk-UA')}</td>
              <td className="py-2 px-4 border-b text-center">
                <Link
                  to={"/field-works/$work_id" as any}
                  params={{ work_id: work.work_id.toString() } as any}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Редагувати
                </Link>
                <button
                  onClick={() => handleDelete(work.work_id)}
                  disabled={deleteFieldWorkMutation.isPending}
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

