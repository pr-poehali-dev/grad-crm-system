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
import { useNavigate, useParams } from 'react-router-dom';

const OrderDetails = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
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

  // State для управления
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any[]>([]);
  const [newEmployee, setNewEmployee] = useState({
    fullName: '',
    position: '',
    tabNumber: '',
    department: '',
    award: '',
    reason: ''
  });

  // Мокированные данные приказа
  const mockOrder = {
    id: parseInt(orderId || '1'),
    number: 'П-1234',
    title: 'О награждении сотрудников к Дню железнодорожника',
    date: '2024-03-15',
    status: 'active',
    region: 'Екатеринбург ДКЖ',
    creator: 'Иконникова К.А.',
    approver: 'Белозёров О.В.',
    event: 'День работника железнодорожного транспорта',
    description: 'В связи с профессиональным праздником - Днём работника железнодорожного транспорта за добросовестный труд и высокие производственные показатели',
    awards: ['Медаль "За безупречную службу"', 'Почетная грамота РЖД'],
    workflow: {
      created: '2024-03-10',
      reviewed: '2024-03-12',
      approved: '2024-03-15',
      executed: null
    }
  };

  // Мокированные данные сотрудников в приказе
  const [employees, setEmployees] = useState([
    {
      id: 1,
      fullName: 'Иванов Иван Иванович',
      position: 'Машинист электровоза',
      tabNumber: 'ТН-001234',
      department: 'Локомотивное депо Екатеринбург',
      award: 'Медаль "За безупречную службу"',
      reason: 'За 25 лет безупречной службы',
      workExperience: '25 лет',
      achievements: 'Отличник транспорта'
    },
    {
      id: 2,
      fullName: 'Петрова Анна Сергеевна',
      position: 'Дежурная по станции',
      tabNumber: 'ТН-005678',
      department: 'Станция Екатеринбург-Пасс',
      award: 'Почетная грамота РЖД',
      reason: 'За высокие производственные показатели',
      workExperience: '15 лет',
      achievements: 'Лучший работник года'
    },
    {
      id: 3,
      fullName: 'Сидоров Петр Александрович',
      position: 'Слесарь по ремонту подвижного состава',
      tabNumber: 'ТН-009876',
      department: 'Вагонное депо Екатеринбург',
      award: 'Медаль "За безупречную службу"',
      reason: 'За профессиональное мастерство',
      workExperience: '20 лет',
      achievements: 'Наставник молодежи'
    },
    {
      id: 4,
      fullName: 'Козлова Елена Викторовна',
      position: 'Диспетчер',
      tabNumber: 'ТН-001122',
      department: 'Центр управления перевозками',
      award: 'Почетная грамота РЖД',
      reason: 'За безаварийную работу',
      workExperience: '12 лет',
      achievements: 'Ударник труда'
    },
    {
      id: 5,
      fullName: 'Морозов Александр Николаевич',
      position: 'Начальник смены',
      tabNumber: 'ТН-003344',
      department: 'Путевая машинная станция',
      award: 'Медаль "За безупречную службу"',
      reason: 'За организационные способности',
      workExperience: '18 лет',
      achievements: 'Руководитель года'
    }
  ]);

  // Другие приказы для переноса
  const mockOtherOrders = [
    { id: 2, number: 'П-1235', title: 'О награждении за выдающиеся достижения' },
    { id: 3, number: 'П-1236', title: 'О награждении к Новому году' },
    { id: 4, number: 'П-1237', title: 'О награждении ветеранов' }
  ];

  const awards = [
    'Медаль "За безупречную службу"',
    'Орден "Трудовая слава"',
    'Почетная грамота РЖД',
    'Благодарность президента РЖД',
    'Знак "Почетному железнодорожнику"',
    'Медаль "Ветеран труда РЖД"'
  ];

  // Фильтрация сотрудников
  const filteredEmployees = employees.filter(employee =>
    employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.tabNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getWorkflowProgress = (workflow: any) => {
    const steps = ['created', 'reviewed', 'approved', 'executed'];
    const completedSteps = steps.filter(step => workflow[step] !== null).length;
    return (completedSteps / steps.length) * 100;
  };

  const handleEmployeeSelect = (id: number) => {
    setSelectedEmployees(prev => 
      prev.includes(id) 
        ? prev.filter(empId => empId !== id)
        : [...prev, id]
    );
  };

  const handleAddEmployee = () => {
    const newEmp = {
      id: employees.length + 1,
      ...newEmployee,
      workExperience: '',
      achievements: ''
    };
    setEmployees([...employees, newEmp]);
    setNewEmployee({
      fullName: '',
      position: '',
      tabNumber: '',
      department: '',
      award: '',
      reason: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setNewEmployee({
      fullName: employee.fullName,
      position: employee.position,
      tabNumber: employee.tabNumber,
      department: employee.department,
      award: employee.award,
      reason: employee.reason
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateEmployee = () => {
    if (selectedEmployee) {
      setEmployees(prev => prev.map(emp => 
        emp.id === selectedEmployee.id 
          ? { ...emp, ...newEmployee }
          : emp
      ));
      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
    }
  };

  const handleDeleteEmployee = (id: number) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    setSelectedEmployees(prev => prev.filter(empId => empId !== id));
  };

  const handleBulkDelete = () => {
    setEmployees(prev => prev.filter(emp => !selectedEmployees.includes(emp.id)));
    setSelectedEmployees([]);
  };

  const handleTransferEmployees = (targetOrderId: number) => {
    console.log('Перенос сотрудников:', selectedEmployees, 'в приказ:', targetOrderId);
    handleBulkDelete();
    setIsTransferDialogOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Имитация извлечения данных из документа
      setTimeout(() => {
        const mockExtracted = [
          {
            fullName: 'Новиков Сергей Петрович',
            position: 'Помощник машиниста',
            tabNumber: 'ТН-007788',
            department: 'Локомотивное депо',
            confidence: 95
          },
          {
            fullName: 'Федорова Мария Александровна',
            position: 'Проводник пассажирского вагона',
            tabNumber: 'ТН-009988',
            department: 'Вагонное депо',
            confidence: 88
          }
        ];
        setExtractedData(mockExtracted);
      }, 2000);
    }
  };

  const handleAddExtractedEmployees = () => {
    const newEmployees = extractedData.map((emp, index) => ({
      id: employees.length + index + 1,
      fullName: emp.fullName,
      position: emp.position,
      tabNumber: emp.tabNumber,
      department: emp.department,
      award: mockOrder.awards[0],
      reason: 'Добавлен из документа',
      workExperience: '',
      achievements: ''
    }));
    
    setEmployees([...employees, ...newEmployees]);
    setExtractedData([]);
    setUploadedFile(null);
    setIsBulkUploadOpen(false);
  };

  const handleExport = (format: string) => {
    console.log(`Экспорт приказа в формате: ${format}`);
    // Здесь будет логика экспорта
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              К приказам
            </Button>
            <Icon name="FileText" size={24} className="text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Приказ {mockOrder.number}</h1>
              <p className="text-sm text-gray-600">{mockOrder.title}</p>
            </div>
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
        {/* Информация о приказе */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{mockOrder.title}</CardTitle>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>№ {mockOrder.number}</span>
                  <span>•</span>
                  <span>от {mockOrder.date}</span>
                  <span>•</span>
                  <span>{mockOrder.region}</span>
                  <span>•</span>
                  {getStatusBadge(mockOrder.status)}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Icon name="Edit" size={16} className="mr-2" />
                  Редактировать приказ
                </Button>
                <Select onValueChange={handleExport}>
                  <SelectTrigger className="w-44">
                    <Icon name="Download" size={16} className="mr-2" />
                    <SelectValue placeholder="Экспорт" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="word">Экспорт в Word</SelectItem>
                    <SelectItem value="pdf">Экспорт в PDF</SelectItem>
                    <SelectItem value="excel">Список в Excel</SelectItem>
                    <SelectItem value="print">Печать</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Основная информация</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-600">Повод:</span> {mockOrder.event}</div>
                  <div><span className="text-gray-600">Создатель:</span> {mockOrder.creator}</div>
                  <div><span className="text-gray-600">Утверждающий:</span> {mockOrder.approver}</div>
                  <div><span className="text-gray-600">Сотрудников:</span> {employees.length}</div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Прогресс выполнения</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Готовность</span>
                    <span className="text-sm">{getWorkflowProgress(mockOrder.workflow).toFixed(0)}%</span>
                  </div>
                  <Progress value={getWorkflowProgress(mockOrder.workflow)} className="h-2" />
                  <div className="text-xs text-gray-600">
                    {mockOrder.status === 'executed' ? 'Исполнен' : 
                     mockOrder.status === 'active' ? 'Готов к исполнению' : 'Требует доработки'}
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="font-medium mb-2">Описание</h3>
              <p className="text-sm text-gray-700">{mockOrder.description}</p>
            </div>

            <div className="mt-4">
              <h3 className="font-medium mb-2">Награды в приказе</h3>
              <div className="flex flex-wrap gap-2">
                {mockOrder.awards.map((award, index) => (
                  <Badge key={index} variant="outline">{award}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Управление сотрудниками */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Сотрудники в приказе ({employees.length})</CardTitle>
              <div className="flex space-x-2">
                <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Icon name="Upload" size={16} className="mr-2" />
                      Загрузить документ
                    </Button>
                  </DialogTrigger>
                </Dialog>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить сотрудника
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Input
                placeholder="Поиск сотрудников..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              {selectedEmployees.length > 0 && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                    <Icon name="Trash2" size={14} className="mr-1" />
                    Удалить ({selectedEmployees.length})
                  </Button>
                  <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Icon name="ArrowRight" size={14} className="mr-1" />
                        Перенести ({selectedEmployees.length})
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedEmployees.length === employees.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedEmployees(employees.map(emp => emp.id));
                        } else {
                          setSelectedEmployees([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>ФИО</TableHead>
                  <TableHead>Должность</TableHead>
                  <TableHead>Табельный номер</TableHead>
                  <TableHead>Подразделение</TableHead>
                  <TableHead>Награда</TableHead>
                  <TableHead>Основание</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedEmployees.includes(employee.id)}
                        onCheckedChange={() => handleEmployeeSelect(employee.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{employee.fullName}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.tabNumber}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{employee.award}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{employee.reason}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline" onClick={() => handleEditEmployee(employee)}>
                          <Icon name="Edit" size={12} />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteEmployee(employee.id)}>
                          <Icon name="Trash2" size={12} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredEmployees.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Icon name="Users" size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Сотрудники не найдены</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog добавления сотрудника */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Добавить сотрудника в приказ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ФИО</Label>
                <Input
                  value={newEmployee.fullName}
                  onChange={(e) => setNewEmployee({...newEmployee, fullName: e.target.value})}
                  placeholder="Иванов Иван Иванович"
                />
              </div>
              <div>
                <Label>Табельный номер</Label>
                <Input
                  value={newEmployee.tabNumber}
                  onChange={(e) => setNewEmployee({...newEmployee, tabNumber: e.target.value})}
                  placeholder="ТН-001234"
                />
              </div>
              <div>
                <Label>Должность</Label>
                <Input
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                  placeholder="Машинист электровоза"
                />
              </div>
              <div>
                <Label>Подразделение</Label>
                <Input
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                  placeholder="Локомотивное депо"
                />
              </div>
              <div>
                <Label>Награда</Label>
                <Select onValueChange={(value) => setNewEmployee({...newEmployee, award: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите награду" />
                  </SelectTrigger>
                  <SelectContent>
                    {awards.map(award => (
                      <SelectItem key={award} value={award}>{award}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Основание для награждения</Label>
                <Textarea
                  value={newEmployee.reason}
                  onChange={(e) => setNewEmployee({...newEmployee, reason: e.target.value})}
                  placeholder="За добросовестный труд..."
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleAddEmployee} disabled={!newEmployee.fullName || !newEmployee.tabNumber}>
                Добавить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog редактирования сотрудника */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать данные сотрудника</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ФИО</Label>
                <Input
                  value={newEmployee.fullName}
                  onChange={(e) => setNewEmployee({...newEmployee, fullName: e.target.value})}
                />
              </div>
              <div>
                <Label>Табельный номер</Label>
                <Input
                  value={newEmployee.tabNumber}
                  onChange={(e) => setNewEmployee({...newEmployee, tabNumber: e.target.value})}
                />
              </div>
              <div>
                <Label>Должность</Label>
                <Input
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                />
              </div>
              <div>
                <Label>Подразделение</Label>
                <Input
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                />
              </div>
              <div>
                <Label>Награда</Label>
                <Select value={newEmployee.award} onValueChange={(value) => setNewEmployee({...newEmployee, award: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {awards.map(award => (
                      <SelectItem key={award} value={award}>{award}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Основание для награждения</Label>
                <Textarea
                  value={newEmployee.reason}
                  onChange={(e) => setNewEmployee({...newEmployee, reason: e.target.value})}
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleUpdateEmployee}>
                Сохранить изменения
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog переноса в другой приказ */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Перенести сотрудников в другой приказ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Выберите приказ для переноса {selectedEmployees.length} сотрудник(ов):
            </p>
            <div className="space-y-2">
              {mockOtherOrders.map(order => (
                <Button
                  key={order.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleTransferEmployees(order.id)}
                >
                  <Icon name="FileText" size={16} className="mr-2" />
                  {order.number} - {order.title}
                </Button>
              ))}
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog загрузки документа */}
      <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Загрузка документа для распознавания ФИО</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <Alert>
              <Icon name="Info" className="h-4 w-4" />
              <AlertDescription>
                Загрузите Word или PDF документ со списком сотрудников. ИИ автоматически извлечет ФИО, должности и табельные номера.
              </AlertDescription>
            </Alert>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {!uploadedFile ? (
                <div>
                  <Icon name="Upload" size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Перетащите файл сюда или нажмите для выбора</p>
                  <input
                    type="file"
                    accept=".doc,.docx,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Icon name="FileText" size={16} className="mr-2" />
                      Выбрать файл
                    </label>
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">Поддерживаются форматы: DOC, DOCX, PDF</p>
                </div>
              ) : (
                <div>
                  <Icon name="FileCheck" size={48} className="mx-auto mb-4 text-green-600" />
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-600">{(uploadedFile.size / 1024 / 1024).toFixed(2)} МБ</p>
                  {extractedData.length === 0 ? (
                    <div className="mt-4">
                      <Icon name="Loader2" size={24} className="animate-spin mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Обработка документа...</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {extractedData.length > 0 && (
              <div>
                <h3 className="font-medium mb-4">Извлеченные данные ({extractedData.length} сотрудников)</h3>
                <div className="max-h-64 overflow-y-auto border rounded">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ФИО</TableHead>
                        <TableHead>Должность</TableHead>
                        <TableHead>Табельный номер</TableHead>
                        <TableHead>Подразделение</TableHead>
                        <TableHead>Точность</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {extractedData.map((emp, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{emp.fullName}</TableCell>
                          <TableCell>{emp.position}</TableCell>
                          <TableCell>{emp.tabNumber}</TableCell>
                          <TableCell>{emp.department}</TableCell>
                          <TableCell>
                            <Badge variant={emp.confidence > 90 ? "default" : "secondary"}>
                              {emp.confidence}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => {
                    setExtractedData([]);
                    setUploadedFile(null);
                  }}>
                    Отмена
                  </Button>
                  <Button onClick={handleAddExtractedEmployees}>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить всех сотрудников
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderDetails;