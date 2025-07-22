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

  // Моковые данные для демонстрации
  const awardOrders = [
    { id: 1, number: 'П-001', date: '15.07.2025', type: 'За трудовые заслуги', status: 'approved', employees: 12, approver: 'Иванов И.И.' },
    { id: 2, number: 'П-002', date: '18.07.2025', type: 'Почётная грамота', status: 'pending', employees: 8, approver: 'Петров П.П.' },
    { id: 3, number: 'П-003', date: '20.07.2025', type: 'Благодарность', status: 'draft', employees: 5, approver: '-' },
    { id: 4, number: 'П-004', date: '22.07.2025', type: 'Медаль', status: 'rejected', employees: 3, approver: 'Сидоров С.С.' },
  ];

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
                          <Button variant="ghost" size="sm" onClick={() => handleOrderClick(order)}>
                            <Icon name="Eye" size={16} />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleOrderClick(order)}>
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
      </div>
    </div>
  );
};

export default Index;