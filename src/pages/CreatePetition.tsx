import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Employee {
  id: number;
  fullName: string;
  position: string;
  personnelNumber: string;
  department: string;
  awardType: string;
  reason: string;
}

interface EmployeeSearchResult {
  id: number;
  fullName: string;
  position: string;
  personnelNumber: string;
  department: string;
}

const mockEmployees: EmployeeSearchResult[] = [
  { id: 1, fullName: 'Иванов Иван Иванович', position: 'Машинист электровоза', personnelNumber: '12345', department: 'Локомотивное депо' },
  { id: 2, fullName: 'Петров Петр Петрович', position: 'Слесарь по ремонту', personnelNumber: '12346', department: 'Служба пути' },
  { id: 3, fullName: 'Сидоров Сидор Сидорович', position: 'Электромонтер СЦБ', personnelNumber: '12347', department: 'Дистанция СЦБ' },
  { id: 4, fullName: 'Козлов Козма Козьмич', position: 'Путевой рабочий', personnelNumber: '12348', department: 'Служба пути' },
  { id: 5, fullName: 'Волков Владимир Владимирович', position: 'Помощник машиниста', personnelNumber: '12349', department: 'Локомотивное депо' },
];

const awardTypes = [
  'За трудовые заслуги',
  'Почётная грамота',
  'Благодарность',
  'Медаль «За трудовую доблесть»',
  'Медаль «Ветеран труда»'
];

export default function CreatePetition() {
  const navigate = useNavigate();
  const [petitionTitle, setPetitionTitle] = useState('');
  const [petitionDescription, setPetitionDescription] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<EmployeeSearchResult[]>([]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = mockEmployees.filter(emp => 
        emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.personnelNumber.includes(searchQuery) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setIsSearchDialogOpen(true);
    }
  };

  const handleAddEmployee = (employee: EmployeeSearchResult) => {
    if (!selectedEmployees.some(emp => emp.id === employee.id)) {
      const newEmployee: Employee = {
        ...employee,
        awardType: '',
        reason: ''
      };
      setSelectedEmployees([...selectedEmployees, newEmployee]);
    }
    setIsSearchDialogOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveEmployee = (employeeId: number) => {
    setSelectedEmployees(selectedEmployees.filter(emp => emp.id !== employeeId));
  };

  const handleEmployeeUpdate = (employeeId: number, field: keyof Employee, value: string) => {
    setSelectedEmployees(selectedEmployees.map(emp => 
      emp.id === employeeId ? { ...emp, [field]: value } : emp
    ));
  };

  const handleExport = () => {
    console.log('Экспорт ходатайства:', {
      title: petitionTitle,
      description: petitionDescription,
      employees: selectedEmployees
    });
    alert('Ходатайство выгружено в файл');
  };

  const handleSubmitToOrder = () => {
    if (!petitionTitle || selectedEmployees.length === 0) {
      alert('Заполните название ходатайства и добавьте хотя бы одного сотрудника');
      return;
    }

    const incompleteEmployees = selectedEmployees.filter(emp => !emp.awardType || !emp.reason);
    if (incompleteEmployees.length > 0) {
      alert('Укажите тип награды и обоснование для всех сотрудников');
      return;
    }

    console.log('Направление в приказ:', {
      title: petitionTitle,
      description: petitionDescription,
      employees: selectedEmployees
    });
    alert('Ходатайство направлено в приказ');
    navigate('/petitions');
  };

  const handleBack = () => {
    navigate('/petitions');
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <Icon name="FileTextX" size={32} style={{color: 'hsl(var(--rzd-red))'}} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Создание ходатайства</h1>
            <p className="text-gray-600">Подготовка документов на награждение сотрудников</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleExport} disabled={selectedEmployees.length === 0}>
            <Icon name="Download" size={20} className="mr-2" />
            Выгрузить ходатайство
          </Button>
          <Button onClick={handleSubmitToOrder} className="bg-green-600 hover:bg-green-700">
            <Icon name="Send" size={20} className="mr-2" />
            Направить в приказ
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная информация */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="petitionTitle">Название ходатайства *</Label>
                <Input
                  id="petitionTitle"
                  value={petitionTitle}
                  onChange={(e) => setPetitionTitle(e.target.value)}
                  placeholder="Например: Ходатайство к профессиональному празднику"
                />
              </div>
              <div>
                <Label htmlFor="petitionDescription">Описание</Label>
                <Textarea
                  id="petitionDescription"
                  value={petitionDescription}
                  onChange={(e) => setPetitionDescription(e.target.value)}
                  placeholder="Дополнительная информация о ходатайстве"
                  rows={4}
                />
              </div>
              
              {/* Поиск сотрудников */}
              <div className="border-t pt-4">
                <Label htmlFor="employeeSearch">Поиск сотрудников</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    id="employeeSearch"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ФИО, должность, табельный номер..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
                    <Icon name="Search" size={20} />
                  </Button>
                </div>
              </div>

              {/* Статистика */}
              <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <h4 className="font-semibold mb-2">Статистика</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Сотрудников:</span>
                    <span className="font-semibold">{selectedEmployees.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Готовых:</span>
                    <span className="font-semibold text-green-600">
                      {selectedEmployees.filter(emp => emp.awardType && emp.reason).length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Список сотрудников */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Список сотрудников ({selectedEmployees.length})</span>
                {selectedEmployees.length > 0 && (
                  <Badge variant="outline">
                    {selectedEmployees.filter(emp => emp.awardType && emp.reason).length} / {selectedEmployees.length} готовы
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedEmployees.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Icon name="UserPlus" size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Сотрудники не добавлены</p>
                  <p className="text-sm">Воспользуйтесь поиском для добавления сотрудников</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedEmployees.map((employee) => (
                    <Card key={employee.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{employee.fullName}</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="flex items-center space-x-4">
                                <span><strong>Должность:</strong> {employee.position}</span>
                                <span><strong>Табельный №:</strong> {employee.personnelNumber}</span>
                              </div>
                              <div><strong>Подразделение:</strong> {employee.department}</div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveEmployee(employee.id)}
                            className="text-red-600"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Тип награды *</Label>
                            <Select
                              value={employee.awardType}
                              onValueChange={(value) => handleEmployeeUpdate(employee.id, 'awardType', value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Выберите тип награды" />
                              </SelectTrigger>
                              <SelectContent>
                                {awardTypes.map(type => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Обоснование *</Label>
                            <Textarea
                              value={employee.reason}
                              onChange={(e) => handleEmployeeUpdate(employee.id, 'reason', e.target.value)}
                              placeholder="Обоснование для награждения"
                              rows={2}
                            />
                          </div>
                        </div>

                        {/* Индикатор готовности */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {employee.awardType && employee.reason ? (
                              <>
                                <Icon name="CheckCircle" size={16} className="text-green-600" />
                                <span className="text-sm text-green-600">Готово к отправке</span>
                              </>
                            ) : (
                              <>
                                <Icon name="AlertCircle" size={16} className="text-orange-600" />
                                <span className="text-sm text-orange-600">Требует заполнения</span>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Диалог поиска сотрудников */}
      <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Результаты поиска</DialogTitle>
          </DialogHeader>
          
          {searchResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Icon name="Search" size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Сотрудники не найдены</p>
              <p className="text-sm">Попробуйте изменить поисковый запрос</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">ФИО</TableHead>
                    <TableHead className="font-semibold">Должность</TableHead>
                    <TableHead className="font-semibold">Табельный №</TableHead>
                    <TableHead className="font-semibold">Подразделение</TableHead>
                    <TableHead className="font-semibold text-right">Действие</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((employee) => (
                    <TableRow key={employee.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{employee.fullName}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.personnelNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{employee.department}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleAddEmployee(employee)}
                          disabled={selectedEmployees.some(emp => emp.id === employee.id)}
                          size="sm"
                        >
                          {selectedEmployees.some(emp => emp.id === employee.id) ? (
                            <>
                              <Icon name="Check" size={16} className="mr-1" />
                              Добавлен
                            </>
                          ) : (
                            <>
                              <Icon name="Plus" size={16} className="mr-1" />
                              Добавить
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}