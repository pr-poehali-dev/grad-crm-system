import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
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

  // State для управления приказами
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAwards, setSelectedAwards] = useState<string[]>([]);
  const [newOrderData, setNewOrderData] = useState({
    title: '',
    event: '',
    date: new Date().toISOString().split('T')[0],
    number: '',
    description: '',
    employees: [] as any[]
  });
  const [orderTemplate, setOrderTemplate] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Мокованные данные приказов
  const mockOrders = [
    {
      id: 1,
      number: 'П-1234',
      title: 'О награждении сотрудников к Дню железнодорожника',
      date: '2024-03-15',
      status: 'active',
      employeeCount: 45,
      region: 'Московский',
      creator: 'Иванов И.И.',
      awards: ['Медаль "За безупречную службу"', 'Почетная грамота РЖД']
    },
    {
      id: 2,
      number: 'П-1235',
      title: 'О награждении за выдающиеся достижения',
      date: '2024-03-12',
      status: 'draft',
      employeeCount: 12,
      region: 'Санкт-Петербургский',
      creator: 'Петров П.П.',
      awards: ['Орден "Трудовая слава"']
    },
    {
      id: 3,
      number: 'П-1236',
      title: 'О награждении к Новому году',
      date: '2024-03-10',
      status: 'archived',
      employeeCount: 78,
      region: 'Уральский',
      creator: 'Сидоров С.С.',
      awards: ['Благодарность президента РЖД', 'Почетная грамота РЖД']
    }
  ];

  const mockAwards = [
    'Медаль "За безупречную службу"',
    'Орден "Трудовая слава"',
    'Почетная грамота РЖД',
    'Благодарность президента РЖД',
    'Знак "Почетному железнодорожнику"',
    'Медаль "Ветеран труда РЖД"'
  ];

  // Фильтрация приказов
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; variant: any } } = {
      'active': { label: 'Активный', variant: 'default' },
      'draft': { label: 'Черновик', variant: 'secondary' },
      'archived': { label: 'Архивный', variant: 'outline' }
    };
    const statusInfo = statusMap[status] || statusMap.active;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const handleAwardToggle = (award: string) => {
    setSelectedAwards(prev => 
      prev.includes(award)
        ? prev.filter(a => a !== award)
        : [...prev, award]
    );
  };

  const generateOrderTemplate = () => {
    const template = `ОАО "Российские железные дороги"

ПРИКАЗ № ${newOrderData.number || 'П-___'} от ${newOrderData.date}

${newOrderData.title || 'О награждении сотрудников'}

${newOrderData.event ? `В связи с ${newOrderData.event}` : ''}

${newOrderData.description}

${selectedAwards.length > 0 ? `Наградить следующими наградами:
${selectedAwards.map((award, index) => `${index + 1}. ${award}`).join('\n')}

` : ''}Список награждаемых сотрудников:
(будет добавлен после создания приказа)

Президент ОАО "РЖД" О.В. Белозёров`;

    setOrderTemplate(template);
  };

  const handleCreateOrder = () => {
    generateOrderTemplate();
    console.log('Создание нового приказа:', {
      ...newOrderData,
      awards: selectedAwards,
      template: orderTemplate
    });
    // Здесь будет логика сохранения приказа
    setIsCreateDialogOpen(false);
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
            <Icon name="FileText" size={24} className="text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">Управление приказами</h1>
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
        <Tabs defaultValue="list" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="list">Список приказов</TabsTrigger>
              <TabsTrigger value="create">Создать приказ</TabsTrigger>
            </TabsList>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Icon name="Plus" size={16} className="mr-2" />
                  Новый приказ
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>

          {/* Список приказов */}
          <TabsContent value="list" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Приказы в системе</CardTitle>
                <div className="flex flex-wrap gap-4 mt-4">
                  <Input
                    placeholder="Поиск приказов..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все статусы</SelectItem>
                      <SelectItem value="active">Активные</SelectItem>
                      <SelectItem value="draft">Черновики</SelectItem>
                      <SelectItem value="archived">Архивные</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Номер</TableHead>
                      <TableHead>Название</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Сотрудников</TableHead>
                      <TableHead>Регион</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.number}</TableCell>
                        <TableCell>{order.title}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{order.employeeCount}</TableCell>
                        <TableCell>{order.region}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Icon name="Eye" size={14} className="mr-1" />
                              Просмотр
                            </Button>
                            <Button size="sm" variant="outline">
                              <Icon name="Edit" size={14} className="mr-1" />
                              Редактировать
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Создание приказа */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Создание нового приказа</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="order-number">Номер приказа</Label>
                    <Input
                      id="order-number"
                      value={newOrderData.number}
                      onChange={(e) => setNewOrderData({...newOrderData, number: e.target.value})}
                      placeholder="П-1234"
                    />
                  </div>
                  <div>
                    <Label htmlFor="order-date">Дата приказа</Label>
                    <Input
                      id="order-date"
                      type="date"
                      value={newOrderData.date}
                      onChange={(e) => setNewOrderData({...newOrderData, date: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="order-title">Заголовок приказа</Label>
                    <Input
                      id="order-title"
                      value={newOrderData.title}
                      onChange={(e) => setNewOrderData({...newOrderData, title: e.target.value})}
                      placeholder="О награждении сотрудников"
                    />
                  </div>
                  <div>
                    <Label htmlFor="order-event">Повод для награждения</Label>
                    <Select onValueChange={(value) => setNewOrderData({...newOrderData, event: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите повод" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Днём работника железнодорожного транспорта">День работника ж/д транспорта</SelectItem>
                        <SelectItem value="профессиональным праздником">Профессиональный праздник</SelectItem>
                        <SelectItem value="Новогодними праздниками">Новогодние праздники</SelectItem>
                        <SelectItem value="Днём Победы">День Победы</SelectItem>
                        <SelectItem value="юбилеем предприятия">Юбилей предприятия</SelectItem>
                        <SelectItem value="досрочными достижениями">Досрочные достижения</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="order-description">Описание</Label>
                    <Textarea
                      id="order-description"
                      value={newOrderData.description}
                      onChange={(e) => setNewOrderData({...newOrderData, description: e.target.value})}
                      placeholder="Дополнительная информация о приказе..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Выбор наград */}
                <div>
                  <Label>Награды для присвоения</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {mockAwards.map((award, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                        <Checkbox
                          checked={selectedAwards.includes(award)}
                          onCheckedChange={() => handleAwardToggle(award)}
                        />
                        <span className="text-sm">{award}</span>
                      </div>
                    ))}
                  </div>
                  {selectedAwards.length > 0 && (
                    <Alert className="mt-4">
                      <Icon name="Info" className="h-4 w-4" />
                      <AlertDescription>
                        Выбрано наград: {selectedAwards.length}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="flex space-x-4">
                  <Button onClick={generateOrderTemplate}>
                    <Icon name="FileText" className="h-4 w-4 mr-2" />
                    Предварительный просмотр
                  </Button>
                  <Button onClick={handleCreateOrder} disabled={!newOrderData.title || !newOrderData.number}>
                    <Icon name="Save" className="h-4 w-4 mr-2" />
                    Создать приказ
                  </Button>
                </div>

                {orderTemplate && (
                  <div className="mt-6">
                    <Label>Предварительный просмотр приказа</Label>
                    <Textarea
                      value={orderTemplate}
                      onChange={(e) => setOrderTemplate(e.target.value)}
                      rows={20}
                      className="mt-2 font-mono text-sm"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog для быстрого создания */}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Быстрое создание приказа</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Номер приказа</Label>
              <Input placeholder="П-1234" />
            </div>
            <div>
              <Label>Дата</Label>
              <Input type="date" />
            </div>
          </div>
          <div>
            <Label>Заголовок</Label>
            <Input placeholder="О награждении сотрудников" />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(false)}>
              Создать
            </Button>
          </div>
        </div>
      </DialogContent>
    </div>
  );
};

export default Orders;