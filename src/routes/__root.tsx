import { createRootRoute, Outlet, useLocation, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [activeTab, setActiveTab] = useState<'fields' | 'crops' | 'field-works'>('fields');
  const location = useLocation();

  // Определяем активную вкладку на основе URL
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/fields')) {
      setActiveTab('fields');
    } else if (path.startsWith('/crops')) {
      setActiveTab('crops');
    } else if (path.startsWith('/field-works')) {
      setActiveTab('field-works');
    } else {
      setActiveTab('fields');
    }
  }, [location.pathname]);

  // Проверяем, находимся ли мы на странице создания или редактирования
  const path = location.pathname;
  const isCreateOrEditPage = path.includes('/new') || (path.includes('/$') && !path.endsWith('/'));

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Система управління господарством</h1>
        </div>
        
        <div className="flex justify-center gap-4 mb-6">
          <Link
            to={"/fields" as any}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'fields' && !isCreateOrEditPage
                ? 'text-white' 
                : 'text-white'
            }`}
            style={{
              backgroundColor: activeTab === 'fields' && !isCreateOrEditPage ? '#323436' : '#323436',
            }}
          >
            Поля
          </Link>
          <Link
            to={"/crops" as any}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'crops' && !isCreateOrEditPage
                ? 'text-white' 
                : 'text-white'
            }`}
            style={{
              backgroundColor: activeTab === 'crops' && !isCreateOrEditPage ? '#323436' : '#323436',
            }}
          >
            Посіви
          </Link>
          <Link
            to={"/field-works" as any}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'field-works' && !isCreateOrEditPage
                ? 'text-white' 
                : 'text-white'
            }`}
            style={{
              backgroundColor: activeTab === 'field-works' && !isCreateOrEditPage ? '#323436' : '#323436',
            }}
          >
            Польові роботи
          </Link>
        </div>

        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

