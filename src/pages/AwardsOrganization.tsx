import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const AwardsOrganization = () => {
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

  const regions = [
    {
      id: 'ekaterinburg-dkzh',
      name: 'Екатеринбург ДКЖ',
      description: 'Дом культуры железнодорожников',
      employeeCount: 145,
      pendingAwards: 23
    },
    {
      id: 'perm',
      name: 'Пермь',
      description: 'Пермское отделение',
      employeeCount: 298,
      pendingAwards: 41
    },
    {
      id: 'tyumen',
      name: 'Тюмень',
      description: 'Тюменское отделение',
      employeeCount: 187,
      pendingAwards: 29
    },
    {
      id: 'ekaterinburg-vokzalnaya',
      name: 'Екатеринбург Вокзальная 21',
      description: 'Главный вокзал Екатеринбурга',
      employeeCount: 234,
      pendingAwards: 37
    },
    {
      id: 'nizhny-tagil',
      name: 'Нижний Тагил',
      description: 'Нижнетагильское отделение',
      employeeCount: 156,
      pendingAwards: 28
    },
    {
      id: 'surgut',
      name: 'Сургут',
      description: 'Сургутское отделение',
      employeeCount: 167,
      pendingAwards: 31
    }
  ];

  const handleSelectRegion = (regionId: string) => {
    navigate(`/awards-list/${regionId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/sections')}>
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Назад
            </Button>
            <Icon name="Users" size={24} className="text-purple-600" />
            <h1 className="text-xl font-semibold text-gray-900">Организация награждения</h1>
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

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Выберите регион для работы со списками награждения
            </h2>
            <p className="text-lg text-gray-600">
              Управление кандидатами на награждение по региональным отделениям
            </p>
          </div>

          {/* Региональные карточки */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regions.map((region) => (
              <Card key={region.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Icon name="MapPin" size={20} className="text-purple-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">К награждению</div>
                      <div className="text-lg font-bold text-purple-600">{region.pendingAwards}</div>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{region.name}</CardTitle>
                  <p className="text-sm text-gray-600">{region.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Всего сотрудников:</span>
                      <span className="font-medium">{region.employeeCount}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Ожидает награждения:</span>
                      <span className="font-medium text-purple-600">{region.pendingAwards}</span>
                    </div>
                    <div className="pt-2">
                      <Button 
                        className="w-full" 
                        onClick={() => handleSelectRegion(region.id)}
                      >
                        Работать со списками
                        <Icon name="ArrowRight" size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Общая статистика */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Всего регионов</p>
                    <p className="text-2xl font-bold text-gray-900">{regions.length}</p>
                  </div>
                  <Icon name="MapPin" className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Общее количество сотрудников</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {regions.reduce((sum, region) => sum + region.employeeCount, 0).toLocaleString()}
                    </p>
                  </div>
                  <Icon name="Users" className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">К награждению</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {regions.reduce((sum, region) => sum + region.pendingAwards, 0)}
                    </p>
                  </div>
                  <Icon name="Award" className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Процент награждения</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(
                        (regions.reduce((sum, region) => sum + region.pendingAwards, 0) / 
                         regions.reduce((sum, region) => sum + region.employeeCount, 0)) * 100
                      ).toFixed(1)}%
                    </p>
                  </div>
                  <Icon name="TrendingUp" className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Быстрые действия */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline">
                    <Icon name="Download" size={16} className="mr-2" />
                    Экспорт всех списков
                  </Button>
                  <Button variant="outline">
                    <Icon name="Upload" size={16} className="mr-2" />
                    Импорт кандидатов
                  </Button>
                  <Button variant="outline">
                    <Icon name="FileText" size={16} className="mr-2" />
                    Сводная проверка
                  </Button>
                  <Button variant="outline">
                    <Icon name="Settings" size={16} className="mr-2" />
                    Настройки награждения
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardsOrganization;