import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const Sections = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const userLogin = localStorage.getItem('userLogin');

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userLogin');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const getRoleName = (role: string) => {
    const roleNames: { [key: string]: string } = {
      'direction': 'Сотрудник дирекции',
      'nok': 'Сотрудник НОК',
      'region': 'Сотрудник региона',
      'center': 'Сотрудник Ц'
    };
    return roleNames[role] || role;
  };

  const sections = [
    {
      id: 'orders',
      title: 'Управление приказами',
      description: 'Создание, редактирование и управление приказами о награждении сотрудников',
      icon: 'FileText',
      color: 'bg-blue-500',
      route: '/orders'
    },
    {
      id: 'reports',
      title: 'Отчеты по наградам',
      description: 'Анализ и статистика по выданным наградам на предприятиях за указанный период',
      icon: 'BarChart3',
      color: 'bg-green-500',
      route: '/reports'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Icon name="Award" size={24} className="text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">Система управления наградами РЖД</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{userLogin}</span>
              <span className="mx-2">•</span>
              <span>{getRoleName(userRole || '')}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <Icon name="LogOut" size={16} className="mr-2" />
              Выход
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Выберите раздел для работы
            </h2>
            <p className="text-lg text-gray-600">
              Система предоставляет инструменты для управления наградами и генерации отчетов
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section) => (
              <Card key={section.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon name={section.icon as any} size={24} className="text-white" />
                  </div>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    {section.description}
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate(section.route)}
                  >
                    Перейти к разделу
                    <Icon name="ArrowRight" size={16} className="ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Всего приказов</p>
                    <p className="text-2xl font-bold text-gray-900">247</p>
                  </div>
                  <Icon name="FileText" className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Награжденных сотрудников</p>
                    <p className="text-2xl font-bold text-gray-900">1,543</p>
                  </div>
                  <Icon name="Users" className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Активных предприятий</p>
                    <p className="text-2xl font-bold text-gray-900">89</p>
                  </div>
                  <Icon name="Building" className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sections;