import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
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

  // State для фильтров отчетов
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-03-31');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedAwardType, setSelectedAwardType] = useState('all');
  const [selectedEnterprise, setSelectedEnterprise] = useState('all');

  // Мокованные данные для отчетов
  const mockEnterprises = [
    {
      id: 1,
      name: 'РЖД-Логистика',
      region: 'Московский',
      totalEmployees: 1250,
      awardedEmployees: 89,
      awardPercentage: 7.1,
      awards: {
        'Медаль "За безупречную службу"': 34,
        'Почетная грамота РЖД': 28,
        'Благодарность президента РЖД': 15,
        'Орден "Трудовая слава"': 8,
        'Знак "Почетному железнодорожнику"': 4
      }
    },
    {
      id: 2,
      name: 'РЖД-Строительство',
      region: 'Санкт-Петербургский',
      totalEmployees: 890,
      awardedEmployees: 52,
      awardPercentage: 5.8,
      awards: {
        'Медаль "За безупречную службу"': 18,
        'Почетная грамота РЖД': 16,
        'Благодарность президента РЖД': 12,
        'Орден "Трудовая слава"': 4,
        'Знак "Почетному железнодорожнику"': 2
      }
    },
    {
      id: 3,
      name: 'РЖД-Пассажирские перевозки',
      region: 'Уральский',
      totalEmployees: 2150,
      awardedEmployees: 178,
      awardPercentage: 8.3,
      awards: {
        'Медаль "За безупречную службу"': 67,
        'Почетная грамота РЖД': 45,
        'Благодарность президента РЖД': 32,
        'Орден "Трудовая слава"': 21,
        'Знак "Почетному железнодорожнику"': 13
      }
    },
    {
      id: 4,
      name: 'РЖД-Грузовые перевозки',
      region: 'Сибирский',
      totalEmployees: 1680,
      awardedEmployees: 94,
      awardPercentage: 5.6,
      awards: {
        'Медаль "За безупречную службу"': 38,
        'Почетная грамота РЖД': 29,
        'Благодарность президента РЖД': 18,
        'Орден "Трудовая слава"': 6,
        'Знак "Почетному железнодорожнику"': 3
      }
    }
  ];

  const mockRegions = [
    'Московский',
    'Санкт-Петербургский', 
    'Уральский',
    'Сибирский',
    'Дальневосточный'
  ];

  const mockAwardTypes = [
    'Медаль "За безупречную службу"',
    'Орден "Трудовая слава"',
    'Почетная грамота РЖД',
    'Благодарность президента РЖД',
    'Знак "Почетному железнодорожнику"'
  ];

  // Фильтрация данных
  const filteredEnterprises = mockEnterprises.filter(enterprise => {
    const matchesRegion = selectedRegion === 'all' || enterprise.region === selectedRegion;
    return matchesRegion;
  });

  // Расчет общей статистики
  const totalStats = filteredEnterprises.reduce((acc, enterprise) => ({
    totalEmployees: acc.totalEmployees + enterprise.totalEmployees,
    awardedEmployees: acc.awardedEmployees + enterprise.awardedEmployees,
    enterprises: acc.enterprises + 1
  }), { totalEmployees: 0, awardedEmployees: 0, enterprises: 0 });

  const overallPercentage = totalStats.totalEmployees > 0 
    ? (totalStats.awardedEmployees / totalStats.totalEmployees * 100).toFixed(1)
    : 0;

  // Агрегация наград по типам
  const awardsSummary = filteredEnterprises.reduce((acc, enterprise) => {
    Object.entries(enterprise.awards).forEach(([awardType, count]) => {
      acc[awardType] = (acc[awardType] || 0) + count;
    });
    return acc;
  }, {} as { [key: string]: number });

  const handleExportReport = () => {
    console.log('Экспорт отчета за период:', { dateFrom, dateTo, selectedRegion });
    // Здесь будет логика экспорта
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
            <Icon name="BarChart3" size={24} className="text-green-600" />
            <h1 className="text-xl font-semibold text-gray-900">Отчеты по наградам</h1>
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
        {/* Фильтры */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Параметры отчета</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="date-from">Дата с</Label>
                <Input
                  id="date-from"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="date-to">Дата по</Label>
                <Input
                  id="date-to"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div>
                <Label>Регион</Label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все регионы" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все регионы</SelectItem>
                    {mockRegions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Тип награды</Label>
                <Select value={selectedAwardType} onValueChange={setSelectedAwardType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все награды" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все награды</SelectItem>
                    {mockAwardTypes.map(award => (
                      <SelectItem key={award} value={award}>{award}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleExportReport} className="w-full">
                  <Icon name="Download" size={16} className="mr-2" />
                  Экспорт
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList>
            <TabsTrigger value="summary">Общая статистика</TabsTrigger>
            <TabsTrigger value="enterprises">По предприятиям</TabsTrigger>
            <TabsTrigger value="awards">По типам наград</TabsTrigger>
          </TabsList>

          {/* Общая статистика */}
          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Общее количество сотрудников</CardTitle>
                  <Icon name="Users" className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStats.totalEmployees.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">На {totalStats.enterprises} предприятиях</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Награжденных сотрудников</CardTitle>
                  <Icon name="Award" className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStats.awardedEmployees.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{overallPercentage}% от общего числа</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Процент награждения</CardTitle>
                  <Icon name="TrendingUp" className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overallPercentage}%</div>
                  <Progress value={parseFloat(overallPercentage)} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Предприятий в отчете</CardTitle>
                  <Icon name="Building" className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStats.enterprises}</div>
                  <p className="text-xs text-muted-foreground">Активных предприятий</p>
                </CardContent>
              </Card>
            </div>

            {/* График по месяцам (макет) */}
            <Card>
              <CardHeader>
                <CardTitle>Динамика награждений по месяцам</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Январь', 'Февраль', 'Март'].map((month, index) => {
                    const value = [320, 287, 341][index];
                    const maxValue = 400;
                    const percentage = (value / maxValue) * 100;
                    return (
                      <div key={month} className="flex items-center space-x-4">
                        <div className="w-20 text-sm">{month}</div>
                        <div className="flex-1">
                          <Progress value={percentage} className="h-6" />
                        </div>
                        <div className="w-16 text-sm font-medium">{value}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* По предприятиям */}
          <TabsContent value="enterprises" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Статистика по предприятиям</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Предприятие</TableHead>
                      <TableHead>Регион</TableHead>
                      <TableHead>Всего сотрудников</TableHead>
                      <TableHead>Награждено</TableHead>
                      <TableHead>Процент</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEnterprises.map((enterprise) => (
                      <TableRow key={enterprise.id}>
                        <TableCell className="font-medium">{enterprise.name}</TableCell>
                        <TableCell>{enterprise.region}</TableCell>
                        <TableCell>{enterprise.totalEmployees.toLocaleString()}</TableCell>
                        <TableCell>{enterprise.awardedEmployees}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={enterprise.awardPercentage} className="h-2 w-16" />
                            <span className="text-sm">{enterprise.awardPercentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={enterprise.awardPercentage > 7 ? 'default' : 'secondary'}>
                            {enterprise.awardPercentage > 7 ? 'Высокий' : 'Средний'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* По типам наград */}
          <TabsContent value="awards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Распределение по типам наград</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(awardsSummary)
                    .sort(([,a], [,b]) => b - a)
                    .map(([awardType, count]) => {
                      const maxCount = Math.max(...Object.values(awardsSummary));
                      const percentage = (count / maxCount) * 100;
                      return (
                        <div key={awardType} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{awardType}</span>
                            <span className="text-sm text-gray-600">{count} наград</span>
                          </div>
                          <Progress value={percentage} className="h-3" />
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Детальная таблица по наградам */}
            <Card>
              <CardHeader>
                <CardTitle>Детализация по предприятиям и наградам</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Предприятие</TableHead>
                      {mockAwardTypes.map(award => (
                        <TableHead key={award} className="text-center text-xs">
                          {award.split('"')[1] || award.split(' ')[0]}
                        </TableHead>
                      ))}
                      <TableHead className="text-center">Всего</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEnterprises.map((enterprise) => (
                      <TableRow key={enterprise.id}>
                        <TableCell className="font-medium">{enterprise.name}</TableCell>
                        {mockAwardTypes.map(awardType => (
                          <TableCell key={awardType} className="text-center">
                            {enterprise.awards[awardType] || 0}
                          </TableCell>
                        ))}
                        <TableCell className="text-center font-medium">
                          {enterprise.awardedEmployees}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;