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
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
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
  const [regionFilter, setRegionFilter] = useState('all');
  const [selectedAwards, setSelectedAwards] = useState<string[]>([]);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [newOrderData, setNewOrderData] = useState({
    title: '',
    event: '',
    date: new Date().toISOString().split('T')[0],
    number: '',
    description: '',
    region: '',
    employees: [] as any[]
  });
  const [orderTemplate, setOrderTemplate] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Мокованные данные приказов (расширенные)
  const mockOrders = [
    {
      id: 1,
      number: 'П-1234',
      title: 'О награждении сотрудников к Дню железнодорожника',
      date: '2024-03-15',
      status: 'active',
      employeeCount: 45,
      region: 'Екатеринбург ДКЖ',
      creator: 'Иконникова К.А.',
      approver: 'Белозёров О.В.',
      awards: ['Медаль "За безупречную службу"', 'Почетная грамота РЖД'],
      description: 'В связи с профессиональным праздником - Днём работника железнодорожного транспорта',
      workflow: {
        created: '2024-03-10',
        reviewed: '2024-03-12',
        approved: '2024-03-15',
        executed: null
      }
    },
    {
      id: 2,
      number: 'П-1235',
      title: 'О награждении за выдающиеся достижения',
      date: '2024-03-12',
      status: 'pending_approval',
      employeeCount: 12,
      region: 'Пермь',
      creator: 'Иконникова К.А.',
      approver: null,
      awards: ['Орден "Трудовая слава"'],
      description: 'За выдающиеся достижения в работе и безупречную службу',
      workflow: {
        created: '2024-03-08',
        reviewed: '2024-03-10',
        approved: null,
        executed: null
      }
    },
    {
      id: 3,
      number: 'П-1236',
      title: 'О награждении к Новому году',
      date: '2024-03-10',
      status: 'draft',
      employeeCount: 78,
      region: 'Тюмень',
      creator: 'Иконникова К.А.',
      approver: null,
      awards: ['Благодарность президента РЖД', 'Почетная грамота РЖД'],
      description: 'В связи с Новогодними праздниками',
      workflow: {
        created: '2024-03-05',
        reviewed: null,
        approved: null,
        executed: null
      }
    },
    {
      id: 4,
      number: 'П-1237',
      title: 'О награждении ветеранов',
      date: '2024-03-08',
      status: 'executed',
      employeeCount: 23,
      region: 'Нижний Тагил',
      creator: 'Иконникова К.А.',
      approver: 'Белозёров О.В.',
      awards: ['Знак "Почетному железнодорожнику"', 'Медаль "Ветеран труда РЖД"'],
      description: 'За многолетний добросовестный труд и в связи с достижением пенсионного возраста',
      workflow: {
        created: '2024-03-01',
        reviewed: '2024-03-03',
        approved: '2024-03-05',
        executed: '2024-03-08'
      }
    }
  ];

  // Уведомления и заявки
  const mockNotifications = [
    {
      id: 1,
      type: 'pending_approval',
      title: 'Заявка на награждение №П-1235',
      description: 'Приказ от Пермского региона ожидает одобрения дирекции',
      date: '2024-03-15',
      priority: 'high',
      region: 'Пермь',
      category: 'Орден',
      orderId: 2
    },
    {
      id: 2,
      type: 'approved',
      title: 'Приказ о награждении утвержден',
      description: 'Приказ №П-1234 от 15.03.2024 успешно утвержден и готов к исполнению',
      date: '2024-03-15',
      priority: 'medium',
      region: 'Екатеринбург ДКЖ',
      category: 'Медаль',
      orderId: 1
    },
    {
      id: 3,
      type: 'deadline',
      title: 'Приближается дедлайн подачи заявок',
      description: 'До окончания срока подачи заявок к празднику осталось 3 дня',
      date: '2024-03-18',
      priority: 'high',
      region: 'Все регионы',
      category: 'Общее',
      orderId: null
    },
    {
      id: 4,
      type: 'review_required',
      title: 'Требуется рассмотрение черновика',
      description: 'Приказ №П-1236 требует завершения и отправки на рассмотрение',
      date: '2024-03-17',
      priority: 'medium',
      region: 'Тюмень',
      category: 'Благодарность',
      orderId: 3
    }
  ];

  const mockAwards = [
    'Медаль "За безупречную службу"',
    'Орден "Трудовая слава"',
    'Почетная грамота РЖД',
    'Благодарность президента РЖД',
    'Знак "Почетному железнодорожнику"',
    'Медаль "Ветеран труда РЖД"',
    'Знак "20 лет безупречной службы"',
    'Знак "30 лет безупречной службы"',
    'Знак "40 лет безупречной службы"'
  ];

  const regions = [
    'Екатеринбург ДКЖ',
    'Пермь',
    'Тюмень',
    'Екатеринбург Вокзальная 21',
    'Нижний Тагил',
    'Сургут'
  ];

  // Фильтрация приказов
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesRegion = regionFilter === 'all' || order.region === regionFilter;
    return matchesSearch && matchesStatus && matchesRegion;
  });

  // Фильтрация уведомлений
  const filteredNotifications = mockNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; variant: any; color: string } } = {
      'draft': { label: 'Черновик', variant: 'secondary', color: 'bg-gray-500' },
      'pending_approval': { label: 'На рассмотрении', variant: 'default', color: 'bg-yellow-500' },
      'active': { label: 'Утвержден', variant: 'default', color: 'bg-green-500' },
      'executed': { label: 'Исполнен', variant: 'outline', color: 'bg-blue-500' },
      'rejected': { label: 'Отклонен', variant: 'destructive', color: 'bg-red-500' }
    };
    const statusInfo = statusMap[status] || statusMap.draft;
    return <Badge variant={statusInfo.variant} className={statusInfo.color}>{statusInfo.label}</Badge>;
  };

  const getNotificationIcon = (type: string): string => {
    const iconMap: { [key: string]: string } = {
      'pending_approval': 'Clock',
      'approved': 'CheckCircle',
      'rejected': 'XCircle',
      'deadline': 'AlertTriangle',
      'review_required': 'FileX',
      'info': 'Info'
    };
    return iconMap[type] || 'Bell';
  };

  const getNotificationColor = (type: string): string => {
    const colorMap: { [key: string]: string } = {
      'pending_approval': 'text-yellow-600',
      'approved': 'text-green-600',
      'rejected': 'text-red-600',
      'deadline': 'text-orange-600',
      'review_required': 'text-blue-600',
      'info': 'text-blue-600'
    };
    return colorMap[type] || 'text-gray-600';
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
(будет добавлен из списков награждения региона ${newOrderData.region})

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
    setIsCreateDialogOpen(false);
    // Здесь будет логика сохранения приказа
  };

  const handleViewOrder = (order: any) => {
    navigate(`/orders/${order.id}`);
  };

  const handleNotificationSelect = (id: number) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(notifId => notifId !== id)
        : [...prev, id]
    );
  };

  const getWorkflowProgress = (workflow: any) => {
    const steps = ['created', 'reviewed', 'approved', 'executed'];
    const completedSteps = steps.filter(step => workflow[step] !== null).length;
    return (completedSteps / steps.length) * 100;
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
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего приказов</CardTitle>
              <Icon name="FileText" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockOrders.length}</div>
              <p className="text-xs text-muted-foreground">За текущий период</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">На рассмотрении</CardTitle>
              <Icon name="Clock" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockOrders.filter(o => o.status === 'pending_approval').length}
              </div>
              <p className="text-xs text-muted-foreground">Требует внимания</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Утверждено</CardTitle>
              <Icon name="CheckCircle" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockOrders.filter(o => o.status === 'active' || o.status === 'executed').length}
              </div>
              <p className="text-xs text-muted-foreground">Готово к исполнению</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Сотрудников к награждению</CardTitle>
              <Icon name="Users" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockOrders.reduce((sum, order) => sum + order.employeeCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Во всех приказах</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="notifications">Уведомления</TabsTrigger>
              <TabsTrigger value="orders">Приказы</TabsTrigger>
              <TabsTrigger value="create">Создать приказ</TabsTrigger>
              <TabsTrigger value="templates">Шаблоны</TabsTrigger>
            </TabsList>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Icon name="Plus" size={16} className="mr-2" />
                  Новый приказ
                </Button>
              </DialogTrigger>
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
                  <div>
                    <Label>Регион</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите регион" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map(region => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Отмена
                    </Button>
                    <Button onClick={() => {
                      setIsCreateDialogOpen(false);
                      // Переход на полную форму создания
                    }}>
                      Создать
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Уведомления и заявки */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Уведомления и заявки на рассмотрение</CardTitle>
                <div className="flex flex-wrap gap-4 mt-4">
                  <Input
                    placeholder="Поиск уведомлений..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        checked={selectedNotifications.includes(notification.id)}
                        onCheckedChange={() => handleNotificationSelect(notification.id)}
                      />
                      <Icon 
                        name={getNotificationIcon(notification.type) as any} 
                        className={`h-5 w-5 mt-0.5 ${getNotificationColor(notification.type)}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant={notification.priority === 'high' ? 'destructive' : 'secondary'}>
                              {notification.priority === 'high' ? 'Высокий' : 'Средний'}
                            </Badge>
                            <span className="text-xs text-gray-500">{notification.date}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-4">
                            <span className="text-xs text-gray-500">Регион: {notification.region}</span>
                            <span className="text-xs text-gray-500">Категория: {notification.category}</span>
                          </div>
                          {notification.orderId && (
                            <Button size="sm" variant="outline" onClick={() => {
                              if (notification.orderId) {
                                navigate(`/orders/${notification.orderId}`);
                              }
                            }}>
                              <Icon name="Eye" size={14} className="mr-1" />
                              Просмотр
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Список приказов */}
          <TabsContent value="orders" className="space-y-6">
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
                      <SelectItem value="draft">Черновики</SelectItem>
                      <SelectItem value="pending_approval">На рассмотрении</SelectItem>
                      <SelectItem value="active">Утвержденные</SelectItem>
                      <SelectItem value="executed">Исполненные</SelectItem>
                      <SelectItem value="rejected">Отклоненные</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={regionFilter} onValueChange={setRegionFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Регион" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все регионы</SelectItem>
                      {regions.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
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
                      <TableHead>Прогресс</TableHead>
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
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={getWorkflowProgress(order.workflow)} className="h-2 w-16" />
                            <span className="text-xs text-gray-500">
                              {getWorkflowProgress(order.workflow).toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{order.employeeCount}</TableCell>
                        <TableCell>{order.region}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewOrder(order)}>
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
                <CardTitle>Создание нового приказа о награждении</CardTitle>
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
                    <Label htmlFor="order-region">Регион</Label>
                    <Select onValueChange={(value) => setNewOrderData({...newOrderData, region: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите регион" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map(region => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Label htmlFor="order-description">Описание и обоснование</Label>
                    <Textarea
                      id="order-description"
                      value={newOrderData.description}
                      onChange={(e) => setNewOrderData({...newOrderData, description: e.target.value})}
                      placeholder="Подробное обоснование награждения..."
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
                  <Button onClick={handleCreateOrder} disabled={!newOrderData.title || !newOrderData.number || !newOrderData.region}>
                    <Icon name="Save" className="h-4 w-4 mr-2" />
                    Создать приказ
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/awards-organization')}>
                    <Icon name="Users" className="h-4 w-4 mr-2" />
                    Перейти к спискам награждения
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
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline">
                        <Icon name="Download" className="h-4 w-4 mr-2" />
                        Скачать проект
                      </Button>
                      <Button variant="outline">
                        <Icon name="Printer" className="h-4 w-4 mr-2" />
                        Печать
                      </Button>
                      <Button variant="outline">
                        <Icon name="Send" className="h-4 w-4 mr-2" />
                        Отправить на рассмотрение
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Шаблоны приказов */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Шаблоны приказов о награждении</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      name: 'День работника железнодорожного транспорта',
                      description: 'Стандартный шаблон для награждения к профессиональному празднику',
                      template: 'В связи с профессиональным праздником - Днём работника железнодорожного транспорта'
                    },
                    {
                      id: 2,
                      name: 'За выдающиеся достижения',
                      description: 'Шаблон для награждения за особые заслуги и достижения',
                      template: 'За выдающиеся достижения в работе и безупречную службу'
                    },
                    {
                      id: 3,
                      name: 'Юбилейные награждения',
                      description: 'Для награждения в связи с юбилеями предприятий и организаций',
                      template: 'В связи с юбилеем предприятия и в знак признания заслуг'
                    },
                    {
                      id: 4,
                      name: 'Государственные праздники',
                      description: 'Шаблон для награждения к государственным праздникам',
                      template: 'В связи с государственным праздником и за добросовестный труд'
                    }
                  ].map((template) => (
                    <div key={template.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                          <p className="text-sm text-gray-800 mt-2 italic">"{template.template}"</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Icon name="Eye" className="h-4 w-4 mr-2" />
                            Просмотр
                          </Button>
                          <Button size="sm" variant="outline">
                            <Icon name="Copy" className="h-4 w-4 mr-2" />
                            Использовать
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>


    </div>
  );
};

export default Orders;