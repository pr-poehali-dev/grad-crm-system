import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [awardTypeFilter, setAwardTypeFilter] = useState('all');

  // Моковые данные для демонстрации
  const awardOrders = [
    { id: 1, number: 'П-001', date: '15.07.2025', type: 'За трудовые заслуги', status: 'approved', employees: 12, approver: 'Иванов И.И.' },
    { id: 2, number: 'П-002', date: '18.07.2025', type: 'Почётная грамота', status: 'pending', employees: 8, approver: 'Петров П.П.' },
    { id: 3, number: 'П-003', date: '20.07.2025', type: 'Благодарность', status: 'draft', employees: 5, approver: '-' },
    { id: 4, number: 'П-004', date: '22.07.2025', type: 'Медаль', status: 'rejected', employees: 3, approver: 'Сидоров С.С.' },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: { variant: 'default' as const, label: 'Утверждён', color: 'bg-green-100 text-green-800' },
      pending: { variant: 'secondary' as const, label: 'На рассмотрении', color: 'bg-yellow-100 text-yellow-800' },
      draft: { variant: 'outline' as const, label: 'Черновик', color: 'bg-gray-100 text-gray-800' },
      rejected: { variant: 'destructive' as const, label: 'Отклонён', color: 'bg-red-100 text-red-800' },
    };
    const config = variants[status as keyof typeof variants];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const filteredOrders = awardOrders.filter(order => {
    const matchesSearch = order.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesType = awardTypeFilter === 'all' || order.type === awardTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="Award" size={32} className="text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CRM Град</h1>
                <p className="text-sm text-gray-500">Система управления приказами о награждении</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Icon name="FileText" size={16} className="mr-2" />
              Экспорт отчёта
            </Button>
            <Button size="sm">
              <Icon name="Plus" size={16} className="mr-2" />
              Новый приказ
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Всего приказов</CardTitle>
              <Icon name="FileText" size={20} className="text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">127</div>
              <p className="text-xs text-green-600 mt-1">+12% за месяц</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Награждено сотрудников</CardTitle>
              <Icon name="Users" size={20} className="text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">1,847</div>
              <p className="text-xs text-green-600 mt-1">+8% за месяц</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">На рассмотрении</CardTitle>
              <Icon name="Clock" size={20} className="text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">23</div>
              <p className="text-xs text-gray-500 mt-1">Требуют внимания</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Средний срок</CardTitle>
              <Icon name="TrendingDown" size={20} className="text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">3.2</div>
              <p className="text-xs text-gray-500 mt-1">дня на обработку</p>
            </CardContent>
          </Card>
        </div>

        {/* Основной контент */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">Управление приказами</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Icon name="Download" size={16} className="mr-2" />
                  Импорт из Word/PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Фильтры и поиск */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Поиск по номеру приказа или типу награды..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="draft">Черновик</SelectItem>
                  <SelectItem value="pending">На рассмотрении</SelectItem>
                  <SelectItem value="approved">Утверждён</SelectItem>
                  <SelectItem value="rejected">Отклонён</SelectItem>
                </SelectContent>
              </Select>
              <Select value={awardTypeFilter} onValueChange={setAwardTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Тип награды" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  <SelectItem value="За трудовые заслуги">За трудовые заслуги</SelectItem>
                  <SelectItem value="Почётная грамота">Почётная грамота</SelectItem>
                  <SelectItem value="Благодарность">Благодарность</SelectItem>
                  <SelectItem value="Медаль">Медаль</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Таблица приказов */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">№ Приказа</TableHead>
                    <TableHead className="font-semibold text-gray-700">Дата</TableHead>
                    <TableHead className="font-semibold text-gray-700">Тип награды</TableHead>
                    <TableHead className="font-semibold text-gray-700">Статус</TableHead>
                    <TableHead className="font-semibold text-gray-700">Сотрудников</TableHead>
                    <TableHead className="font-semibold text-gray-700">Утверждающий</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{order.number}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.type}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Icon name="Users" size={14} className="text-gray-500" />
                          <span>{order.employees}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{order.approver}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Icon name="Eye" size={16} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Icon name="Edit" size={16} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Icon name="Download" size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Icon name="Search" size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Приказы не найдены</p>
                <p className="text-sm">Попробуйте изменить параметры поиска</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Быстрые действия */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Icon name="FileText" size={48} className="mx-auto mb-3 text-blue-600" />
                <h4 className="font-semibold text-gray-900 mb-2">Создать приказ</h4>
                <p className="text-sm text-gray-600">Сформировать новый приказ о награждении сотрудников</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Icon name="Upload" size={48} className="mx-auto mb-3 text-green-600" />
                <h4 className="font-semibold text-gray-900 mb-2">Импорт данных</h4>
                <p className="text-sm text-gray-600">Загрузить список сотрудников из Word или PDF файла</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Icon name="BarChart" size={48} className="mx-auto mb-3 text-purple-600" />
                <h4 className="font-semibold text-gray-900 mb-2">Аналитика</h4>
                <p className="text-sm text-gray-600">Просмотреть статистику и отчёты по награждениям</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;