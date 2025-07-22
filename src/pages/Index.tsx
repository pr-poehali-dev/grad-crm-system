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
import Icon from '@/components/ui/icon';
import { useState } from 'react';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [awardTypeFilter, setAwardTypeFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ fullName: '', position: '', personnelNumber: '', awardType: '', reason: '' });
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: 'Петров Петр Петрович',
    role: 'direction', // direction, nok, center
    department: 'Дирекция по управлению персоналом',
    position: 'Начальник отдела кадров',
    avatar: null
  });

  // Система ролей и прав доступа
  const userRoles = {
    direction: {
      name: 'Сотрудник дирекции',
      permissions: {
        viewAll: true,
        createOrders: true,
        editOrders: true,
        approveOrders: true,
        deleteOrders: true,
        manageTemplates: true,
        viewReports: true,
        manageUsers: true
      },
      color: 'hsl(var(--rzd-red))',
      bgColor: 'hsl(var(--rzd-red-light))'
    },
    nok: {
      name: 'Сотрудник НОК',
      permissions: {
        viewAll: true,
        createOrders: true,
        editOrders: true,
        approveOrders: false,
        deleteOrders: false,
        manageTemplates: false,
        viewReports: true,
        manageUsers: false
      },
      color: 'hsl(var(--rzd-gray-dark))',
      bgColor: 'hsl(var(--rzd-gray-light))'
    },
    center: {
      name: 'Сотрудник Ц',
      permissions: {
        viewAll: false, // видит только свои
        createOrders: true,
        editOrders: false,
        approveOrders: false,
        deleteOrders: false,
        manageTemplates: false,
        viewReports: false,
        manageUsers: false
      },
      color: 'hsl(var(--rzd-gray-medium))',
      bgColor: 'hsl(var(--secondary))'
    }
  };

  // Моковые данные с учетом ролей
  const allAwardOrders = [
    { id: 1, number: 'П-001', date: '15.07.2025', type: 'За трудовые заслуги', status: 'approved', employees: 12, approver: 'Иванов И.И.', department: 'direction', createdBy: 1 },
    { id: 2, number: 'П-002', date: '18.07.2025', type: 'Почётная грамота', status: 'pending', employees: 8, approver: 'Петров П.П.', department: 'nok', createdBy: 2 },
    { id: 3, number: 'П-003', date: '20.07.2025', type: 'Благодарность', status: 'draft', employees: 5, approver: '-', department: 'center', createdBy: 1 },
    { id: 4, number: 'П-004', date: '22.07.2025', type: 'Медаль', status: 'rejected', employees: 3, approver: 'Сидоров С.С.', department: 'center', createdBy: 3 },
    { id: 5, number: 'П-005', date: '23.07.2025', type: 'Почётная грамота', status: 'draft', employees: 7, approver: '-', department: 'nok', createdBy: 2 },
  ];

  // Фильтрация приказов по роли
  const awardOrders = allAwardOrders.filter(order => {
    const userPermissions = userRoles[currentUser.role].permissions;
    if (userPermissions.viewAll) {
      return true; // Дирекция и НОК видят всё
    }
    return order.createdBy === currentUser.id; // Ц видит только свои
  });

  // Моковые данные сотрудников для выбранного приказа
  const mockEmployees = {
    1: [
      { id: 1, fullName: 'Иванов Иван Иванович', position: 'Главный инженер', personnelNumber: '001234', awardType: 'Медаль "За трудовые заслуги"', reason: 'За выдающиеся достижения в области инженерных разработок', status: 'approved', approvedBy: 'Иванов И.И.', approvedDate: '16.07.2025' },
      { id: 2, fullName: 'Петрова Мария Сергеевна', position: 'Ведущий специалист', personnelNumber: '001235', awardType: 'Почётная грамота', reason: 'За высокие результаты в работе и профессионализм', status: 'pending', approvedBy: '', approvedDate: '' },
      { id: 3, fullName: 'Сидоров Алексей Петрович', position: 'Начальник отдела', personnelNumber: '001236', awardType: 'Благодарность', reason: 'За эффективное руководство подразделением', status: 'rejected', approvedBy: 'Иванов И.И.', approvedDate: '16.07.2025', rejectionReason: 'Недостаточный стаж работы' }
    ],
    2: [
      { id: 4, fullName: 'Козлов Дмитрий Александрович', position: 'Старший менеджер', personnelNumber: '001237', awardType: 'Почётная грамота', reason: 'За отличную работу с клиентами', status: 'pending', approvedBy: '', approvedDate: '' }
    ]
  };

  const awardTypes = [
    'Медаль "За трудовые заслуги"',
    'Почётная грамота Министерства',
    'Благодарность руководства',
    'Медаль "Ветеран труда"',
    'Почётный знак "За заслуги"'
  ];

  // Шаблоны приказов
  const orderTemplates = [
    {
      id: 1,
      name: 'Шаблон приказа о награждении медалью',
      type: 'Медаль "За трудовые заслуги"',
      template: `ОАО "Российские железные дороги"

ПРИКАЗ № {orderNumber} от {date}

О награждении медалью "За трудовые заслуги"

За высокие показатели в трудовой деятельности, профессиональное мастерство и долголетний добросовестный труд НАГРАДИТЬ:

{employeesList}

Руководителям структурных подразделений обеспечить порядок награждения в установленные сроки.

Президент ОАО "РЖД" О.В. Белозёров`
    },
    {
      id: 2,
      name: 'Шаблон приказа о почётной грамоте',
      type: 'Почётная грамота',
      template: `ОАО "Российские железные дороги"

ПРИКАЗ № {orderNumber} от {date}

О награждении почётной грамотой

За отличную работу, профессионализм и добросовестный труд НАГРАДИТЬ:

{employeesList}

Президент ОАО "РЖД" О.В. Белозёров`
    }
  ];

  // Моковые уведомления
  const mockNotifications = [
    { id: 1, type: 'pending_approval', title: 'Приказ П-002 ожидает утверждения', message: '8 сотрудников на почётную грамоту', recipient: 'Петров П.П.', date: '18.07.2025 10:30', status: 'unread' },
    { id: 2, type: 'approved', title: 'Приказ П-001 утверждён', message: '12 сотрудников награждены медалью', recipient: 'Иванов И.И.', date: '16.07.2025 15:45', status: 'read' },
    { id: 3, type: 'deadline', title: 'Приближается срок', message: 'Приказ П-003 нуждается в утверждении до 25.07.2025', recipient: 'Сидоров С.С.', date: '22.07.2025 09:00', status: 'unread' }
  ];

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setEmployees(mockEmployees[order.id] || []);
    setIsOrderDialogOpen(true);
  };

  const handleAddEmployee = () => {
    if (newEmployee.fullName && newEmployee.position) {
      const employee = {
        id: Date.now(),
        ...newEmployee,
        status: 'pending',
        approvedBy: '',
        approvedDate: ''
      };
      setEmployees([...employees, employee]);
      setNewEmployee({ fullName: '', position: '', personnelNumber: '', awardType: '', reason: '' });
    }
  };

  const handleEmployeeStatusChange = (employeeId, newStatus, reason = '') => {
    setEmployees(employees.map(emp => 
      emp.id === employeeId 
        ? { 
            ...emp, 
            status: newStatus, 
            approvedBy: newStatus !== 'pending' ? 'Иванов И.И.' : '', 
            approvedDate: newStatus !== 'pending' ? new Date().toLocaleDateString('ru-RU') : '',
            rejectionReason: newStatus === 'rejected' ? reason : ''
          } 
        : emp
    ));
  };

  // Проверка прав доступа
  const hasPermission = (permission: string) => {
    return userRoles[currentUser.role].permissions[permission as keyof typeof userRoles[typeof currentUser.role]['permissions']];
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = userRoles[role as keyof typeof userRoles];
    return (
      <Badge 
        style={{ 
          backgroundColor: roleConfig.bgColor, 
          color: roleConfig.color,
          border: `1px solid ${roleConfig.color}` 
        }}
      >
        {roleConfig.name}
      </Badge>
    );
  };

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

  const getDepartmentName = (dept: string) => {
    const deptNames = {
      direction: 'Дирекция',
      nok: 'НОК',
      center: 'Центральные службы'
    };
    return deptNames[dept as keyof typeof deptNames] || dept;
  };

  const switchUserRole = (newRole: string) => {
    const roleUsers = {
      direction: { name: 'Петров Петр Петрович', department: 'Дирекция по управлению персоналом', position: 'Начальник отдела' },
      nok: { name: 'Иванова Мария Сергеевна', department: 'НОК (Начальник отдела кадров)', position: 'Ведущий специалист' },
      center: { name: 'Сидоров Алексей Петрович', department: 'Центральная служба управления персоналом', position: 'Специалист' }
    };
    
    const userData = roleUsers[newRole as keyof typeof roleUsers];
    setCurrentUser({
      ...currentUser,
      role: newRole,
      name: userData.name,
      department: userData.department,
      position: userData.position
    });
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
              <Icon name="FileText" size={20} style={{color: 'hsl(var(--rzd-red))'}} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{color: 'hsl(var(--rzd-gray-dark))'}}>127</div>
              <p className="text-xs mt-1" style={{color: 'hsl(var(--rzd-red))'}}>+12% за месяц</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Награждено сотрудников</CardTitle>
              <Icon name="Users" size={20} style={{color: 'hsl(var(--rzd-red))'}} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{color: 'hsl(var(--rzd-gray-dark))'}}>1,847</div>
              <p className="text-xs mt-1" style={{color: 'hsl(var(--rzd-red))'}}>+8% за месяц</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">На рассмотрении</CardTitle>
              <Icon name="Clock" size={20} style={{color: 'hsl(var(--rzd-red))'}} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{color: 'hsl(var(--rzd-gray-dark))'}}>23</div>
              <p className="text-xs mt-1" style={{color: 'hsl(var(--rzd-gray-medium))'}}>Требуют внимания</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Средний срок</CardTitle>
              <Icon name="TrendingDown" size={20} style={{color: 'hsl(var(--rzd-red))'}} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{color: 'hsl(var(--rzd-gray-dark))'}}>3.2</div>
              <p className="text-xs mt-1" style={{color: 'hsl(var(--rzd-gray-medium))'}}>дня на обработку</p>
            </CardContent>
          </Card>
        </div>

        {/* Основной контент */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold" style={{color: 'hsl(var(--rzd-gray-dark))'}}>Управление приказами</CardTitle>
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
                    <TableHead className="font-semibold text-gray-700">Подразделение</TableHead>
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
                      <TableCell>
                        <Badge variant="outline" style={{
                          color: userRoles[order.department as keyof typeof userRoles].color,
                          borderColor: userRoles[order.department as keyof typeof userRoles].color
                        }}>
                          {getDepartmentName(order.department)}
                        </Badge>
                      </TableCell>
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
                          <Button variant="ghost" size="sm" onClick={() => handleOrderClick(order)}>
                            <Icon name="Eye" size={16} />
                          </Button>
                          {(hasPermission('editOrders') || (order.createdBy === currentUser.id && order.status === 'draft')) && (
                            <Button variant="ghost" size="sm" onClick={() => handleOrderClick(order)}>
                              <Icon name="Edit" size={16} />
                            </Button>
                          )}
                          {hasPermission('viewReports') && (
                            <Button variant="ghost" size="sm">
                              <Icon name="Download" size={16} />
                            </Button>
                          )}
                          {hasPermission('deleteOrders') && order.status === 'draft' && (
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Icon name="Trash2" size={16} />
                            </Button>
                          )}
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
                <Icon name="FileText" size={48} className="mx-auto mb-3" style={{color: 'hsl(var(--rzd-red))'}} />
                <h4 className="font-semibold mb-2" style={{color: 'hsl(var(--rzd-gray-dark))'}}>Создать приказ</h4>
                <p className="text-sm" style={{color: 'hsl(var(--rzd-gray-medium))'}}>Сформировать новый приказ о награждении сотрудников</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Icon name="Upload" size={48} className="mx-auto mb-3" style={{color: 'hsl(var(--rzd-red))'}} />
                <h4 className="font-semibold mb-2" style={{color: 'hsl(var(--rzd-gray-dark))'}}>Импорт данных</h4>
                <p className="text-sm" style={{color: 'hsl(var(--rzd-gray-medium))'}}>Загрузить список сотрудников из Word или PDF файла</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Icon name="BarChart" size={48} className="mx-auto mb-3" style={{color: 'hsl(var(--rzd-red))'}} />
                <h4 className="font-semibold mb-2" style={{color: 'hsl(var(--rzd-gray-dark))'}}>Аналитика</h4>
                <p className="text-sm" style={{color: 'hsl(var(--rzd-gray-medium))'}}>Просмотреть статистику и отчёты по награждениям</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Диалоговое окно управления сотрудниками */}
        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Управление приказом {selectedOrder?.number} - {selectedOrder?.type}
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="employees" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="employees">Список сотрудников</TabsTrigger>
                <TabsTrigger value="add-employee">Добавить сотрудника</TabsTrigger>
              </TabsList>
              
              <TabsContent value="employees" className="space-y-4">
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">ФИО</TableHead>
                        <TableHead className="font-semibold">Должность</TableHead>
                        <TableHead className="font-semibold">Табельный №</TableHead>
                        <TableHead className="font-semibold">Тип награды</TableHead>
                        <TableHead className="font-semibold">Статус</TableHead>
                        <TableHead className="font-semibold text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow key={employee.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{employee.fullName}</TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>{employee.personnelNumber}</TableCell>
                          <TableCell>{employee.awardType}</TableCell>
                          <TableCell>{getStatusBadge(employee.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {employee.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                    onClick={() => handleEmployeeStatusChange(employee.id, 'approved')}
                                  >
                                    <Icon name="Check" size={16} className="mr-1" />
                                    Утвердить
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => {
                                      const reason = prompt('Укажите причину отклонения:');
                                      if (reason) handleEmployeeStatusChange(employee.id, 'rejected', reason);
                                    }}
                                  >
                                    <Icon name="X" size={16} className="mr-1" />
                                    Отклонить
                                  </Button>
                                </>
                              )}
                              {employee.status === 'approved' && (
                                <span className="text-sm text-gray-500">
                                  Утверждено {employee.approvedDate} ({employee.approvedBy})
                                </span>
                              )}
                              {employee.status === 'rejected' && (
                                <div className="text-sm text-red-600">
                                  <div>Отклонено {employee.approvedDate}</div>
                                  <div className="text-xs">{employee.rejectionReason}</div>
                                </div>
                              )}
                              <Button variant="ghost" size="sm">
                                <Icon name="Trash2" size={16} className="text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {employees.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      <Icon name="Users" size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>В приказе пока нет сотрудников</p>
                      <p className="text-sm">Добавьте сотрудников для награждения</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="add-employee" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Добавить сотрудника для награждения</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">ФИО сотрудника *</Label>
                        <Input
                          id="fullName"
                          placeholder="Иванов Иван Иванович"
                          value={newEmployee.fullName}
                          onChange={(e) => setNewEmployee({ ...newEmployee, fullName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Должность *</Label>
                        <Input
                          id="position"
                          placeholder="Главный специалист"
                          value={newEmployee.position}
                          onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="personnelNumber">Табельный номер</Label>
                        <Input
                          id="personnelNumber"
                          placeholder="001234"
                          value={newEmployee.personnelNumber}
                          onChange={(e) => setNewEmployee({ ...newEmployee, personnelNumber: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="awardType">Тип награды</Label>
                        <Select value={newEmployee.awardType} onValueChange={(value) => setNewEmployee({ ...newEmployee, awardType: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите тип награды" />
                          </SelectTrigger>
                          <SelectContent>
                            {awardTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reason">Основание для награждения</Label>
                      <Textarea
                        id="reason"
                        placeholder="За выдающиеся достижения в области..."
                        value={newEmployee.reason}
                        onChange={(e) => setNewEmployee({ ...newEmployee, reason: e.target.value })}
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex items-center justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setNewEmployee({ fullName: '', position: '', personnelNumber: '', awardType: '', reason: '' })}>
                        Очистить
                      </Button>
                      <Button onClick={handleAddEmployee} disabled={!newEmployee.fullName || !newEmployee.position}>
                        <Icon name="Plus" size={16} className="mr-2" />
                        Добавить сотрудника
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Автоподстановка данных сотрудников */}
                <Card>
                  <CardHeader>
                    <CardTitle>Быстрое добавление</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">Часто награждаемые сотрудники:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {[
                          { name: 'Козлов Дмитрий Александрович', position: 'Старший менеджер', number: '001237' },
                          { name: 'Смирнова Елена Викторовна', position: 'Ведущий экономист', number: '001238' },
                          { name: 'Новиков Артём Сергеевич', position: 'Главный инженер', number: '001239' },
                          { name: 'Волкова Анна Михайловна', position: 'Начальник отдела', number: '001240' }
                        ].map((emp) => (
                          <Button 
                            key={emp.number} 
                            variant="outline" 
                            size="sm" 
                            className="justify-start text-left h-auto p-2"
                            onClick={() => setNewEmployee({ 
                              fullName: emp.name, 
                              position: emp.position, 
                              personnelNumber: emp.number,
                              awardType: '',
                              reason: ''
                            })}
                          >
                            <div>
                              <div className="font-medium">{emp.name}</div>
                              <div className="text-xs text-gray-500">{emp.position}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">
                Всего сотрудников: {employees.length} | 
                Утверждено: {employees.filter(e => e.status === 'approved').length} | 
                Ожидает: {employees.filter(e => e.status === 'pending').length} | 
                Отклонено: {employees.filter(e => e.status === 'rejected').length}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
                  Закрыть
                </Button>
                <Button>
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить изменения
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Диалоговое окно шаблонов */}
        <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold" style={{color: 'hsl(var(--rzd-gray-dark))'}}>
                Шаблоны приказов о награждении
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="templates" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="templates">Готовые шаблоны</TabsTrigger>
                <TabsTrigger value="preview">Предпросмотр приказа</TabsTrigger>
              </TabsList>
              
              <TabsContent value="templates" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orderTemplates.map((template) => (
                    <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => setSelectedTemplate(template.template)}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg" style={{color: 'hsl(var(--rzd-gray-dark))'}}>
                              {template.name}
                            </CardTitle>
                            <p className="text-sm mt-1" style={{color: 'hsl(var(--rzd-gray-medium))'}}>
                              {template.type}
                            </p>
                          </div>
                          <Icon name="FileText" size={24} style={{color: 'hsl(var(--rzd-red))'}} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm" style={{color: 'hsl(var(--rzd-gray-medium))'}}>
                          <p className="line-clamp-3">
                            {template.template.substring(0, 200)}...
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <Badge variant="outline" style={{color: 'hsl(var(--rzd-red))', borderColor: 'hsl(var(--rzd-red))'}}>
                            Официальный шаблон ОАО "РЖД"
                          </Badge>
                          <Button size="sm" variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTemplate(template.template);
                                  }}>
                            Выбрать
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Alert>
                  <Icon name="Info" size={16} />
                  <AlertDescription>
                    Шаблоны соответствуют корпоративным стандартам ОАО "Российские железные дороги".
                    Поля {'{orderNumber}'}, {'{date}'}, {'{employeesList}'} будут заменены автоматически.
                  </AlertDescription>
                </Alert>
              </TabsContent>
              
              <TabsContent value="preview" className="space-y-4">
                {selectedTemplate ? (
                  <Card>
                    <CardHeader>
                      <CardTitle style={{color: 'hsl(var(--rzd-gray-dark))'}}>
                        Предпросмотр приказа
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white border rounded-lg p-6">
                        <pre className="whitespace-pre-wrap text-sm" style={{color: 'hsl(var(--rzd-gray-dark))'}}>
                          {generateOrderFromTemplate({ template: selectedTemplate }, selectedOrder || { number: 'П-XXX', date: new Date().toLocaleDateString('ru-RU') })}
                        </pre>
                      </div>
                      <div className="mt-4 flex items-center justify-end space-x-2">
                        <Button variant="outline">
                          <Icon name="Download" size={16} className="mr-2" />
                          Скачать Word
                        </Button>
                        <Button variant="outline">
                          <Icon name="FileText" size={16} className="mr-2" />
                          Скачать PDF
                        </Button>
                        <Button style={{backgroundColor: 'hsl(var(--rzd-red))', color: 'white'}}>
                          <Icon name="Send" size={16} className="mr-2" />
                          Отправить на подпись
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-8" style={{color: 'hsl(var(--rzd-gray-medium))'}}>
                    <Icon name="FileText" size={48} className="mx-auto mb-4" style={{color: 'hsl(var(--rzd-gray-light))'}} />
                    <p>Выберите шаблон для предпросмотра</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="flex items-center justify-end pt-4 border-t space-x-2">
              <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
                Закрыть
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Диалоговое окно уведомлений */}
        <Dialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[70vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold" style={{color: 'hsl(var(--rzd-gray-dark))'}}>
                Центр уведомлений
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {mockNotifications.map((notification) => (
                <Alert key={notification.id} className={`border-l-4 ${notification.status === 'unread' ? 'bg-blue-50' : 'bg-gray-50'}`} 
                       style={{borderLeftColor: notification.status === 'unread' ? 'hsl(var(--rzd-red))' : 'hsl(var(--rzd-gray-light))'}}>
                  <div className="flex items-start space-x-3">
                    <Icon name={getNotificationIcon(notification.type)} size={20} 
                          className={getNotificationColor(notification.type)} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium" style={{color: 'hsl(var(--rzd-gray-dark))'}}>
                            {notification.title}
                          </h4>
                          <p className="text-sm mt-1" style={{color: 'hsl(var(--rzd-gray-medium))'}}>
                            {notification.message}
                          </p>
                        </div>
                        {notification.status === 'unread' && (
                          <Badge style={{backgroundColor: 'hsl(var(--rzd-red))', color: 'white'}}>
                            Новое
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-xs" style={{color: 'hsl(var(--rzd-gray-medium))'}}>
                          Ответственный: {notification.recipient} • {notification.date}
                        </div>
                        <div className="flex space-x-2">
                          {notification.status === 'unread' && (
                            <Button size="sm" variant="outline">
                              <Icon name="Check" size={14} className="mr-1" />
                              Отметить как прочитанное
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Icon name="ExternalLink" size={14} className="mr-1" />
                            Перейти
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
            
            {mockNotifications.length === 0 && (
              <div className="text-center py-8" style={{color: 'hsl(var(--rzd-gray-medium))'}}>
                <Icon name="Bell" size={48} className="mx-auto mb-4" style={{color: 'hsl(var(--rzd-gray-light))'}} />
                <p>У вас нет новых уведомлений</p>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm" style={{color: 'hsl(var(--rzd-gray-medium))'}}>
                Всего: {mockNotifications.length} • 
                Новых: {mockNotifications.filter(n => n.status === 'unread').length}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Icon name="CheckCheck" size={16} className="mr-2" />
                  Отметить все как прочитанные
                </Button>
                <Button variant="outline" onClick={() => setNotificationDialogOpen(false)}>
                  Закрыть
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Диалог профиля пользователя и ролей */}
        <Dialog open={userProfileOpen} onOpenChange={setUserProfileOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold" style={{color: 'hsl(var(--rzd-gray-dark))'}}>
                Профиль пользователя
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Информация о текущем пользователе */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white"
                         style={{backgroundColor: userRoles[currentUser.role].color}}>
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-medium" style={{color: 'hsl(var(--rzd-gray-dark))'}}>
                        {currentUser.name}
                      </h3>
                      <p className="text-sm" style={{color: 'hsl(var(--rzd-gray-medium))'}}>
                        {currentUser.position}
                      </p>
                      <p className="text-sm" style={{color: 'hsl(var(--rzd-gray-medium))'}}>
                        {currentUser.department}
                      </p>
                      <div className="mt-2">
                        {getRoleBadge(currentUser.role)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Права доступа */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm" style={{color: 'hsl(var(--rzd-gray-dark))'}}>
                    Права доступа
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(userRoles[currentUser.role].permissions).map(([key, value]) => {
                      const labels = {
                        viewAll: 'Просмотр всех',
                        createOrders: 'Создание',
                        editOrders: 'Редактирование',
                        approveOrders: 'Утверждение',
                        deleteOrders: 'Удаление',
                        manageTemplates: 'Шаблоны',
                        viewReports: 'Отчёты',
                        manageUsers: 'Пользователи'
                      };
                      return (
                        <div key={key} className="flex items-center space-x-2">
                          <Icon 
                            name={value ? "CheckCircle" : "XCircle"} 
                            size={14} 
                            className={value ? "text-green-600" : "text-red-400"} 
                          />
                          <span style={{color: value ? 'hsl(var(--rzd-gray-dark))' : 'hsl(var(--rzd-gray-medium))'}}>
                            {labels[key as keyof typeof labels]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              
              {/* Переключатель ролей (для демо) */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm" style={{color: 'hsl(var(--rzd-gray-dark))'}}>
                    Переключить роль (демо)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  {Object.entries(userRoles).map(([roleKey, roleData]) => (
                    <Button
                      key={roleKey}
                      variant={currentUser.role === roleKey ? "default" : "outline"}
                      size="sm"
                      onClick={() => switchUserRole(roleKey)}
                      className="w-full justify-start"
                      style={currentUser.role === roleKey ? {
                        backgroundColor: roleData.color,
                        borderColor: roleData.color,
                        color: 'white'
                      } : {
                        borderColor: roleData.color,
                        color: roleData.color
                      }}
                    >
                      {roleData.name}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setUserProfileOpen(false)}>
                Закрыть
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;