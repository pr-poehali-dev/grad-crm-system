import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AwardsList = () => {
  const navigate = useNavigate();
  const { regionId } = useParams();
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

  // Получить название региона
  const regionNames: { [key: string]: string } = {
    'ekaterinburg-dkzh': 'Екатеринбург ДКЖ',
    'perm': 'Пермь',
    'tyumen': 'Тюмень',
    'ekaterinburg-vokzalnaya': 'Екатеринбург Вокзальная 21',
    'nizhny-tagil': 'Нижний Тагил',
    'surgut': 'Сургут'
  };

  const currentRegion = regionNames[regionId || ''] || 'Неизвестный регион';

  // State для фильтров
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDirection, setSelectedDirection] = useState('all');
  const [selectedAwardType, setSelectedAwardType] = useState('all');
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

  // Мокованные данные сотрудников с наградами
  const mockEmployees = [
    {
      id: 1,
      fullName: 'Иванов Иван Иванович',
      position: 'Старший машинист',
      direction: 'Д',
      directionFull: 'Дирекция',
      awardType: 'знак 20 лет',
      experience: 22,
      inAwardsList: false
    },
    {
      id: 2,
      fullName: 'Петрова Мария Сергеевна',
      position: 'Диспетчер',
      direction: 'НТЭ',
      directionFull: 'Направление технической эксплуатации',
      awardType: 'знак 30 лет',
      experience: 31,
      inAwardsList: true
    },
    {
      id: 3,
      fullName: 'Сидоров Алексей Петрович',
      position: 'Мастер участка',
      direction: 'ДИ',
      directionFull: 'Дирекция инфраструктуры',
      awardType: 'звание лучший мастер',
      experience: 15,
      inAwardsList: false
    },
    {
      id: 4,
      fullName: 'Козлова Елена Владимировна',
      position: 'Инженер',
      direction: 'ДТВ',
      directionFull: 'Дирекция тягового вещания',
      awardType: 'благодарность Ц',
      experience: 8,
      inAwardsList: true
    },
    {
      id: 5,
      fullName: 'Морозов Сергей Николаевич',
      position: 'Слесарь',
      direction: 'НС',
      directionFull: 'Направление строительства',
      awardType: 'почетная Грамота У',
      experience: 18,
      inAwardsList: false
    },
    {
      id: 6,
      fullName: 'Новикова Ольга Михайловна',
      position: 'Специалист по кадрам',
      direction: 'ТР',
      directionFull: 'Трудовые ресурсы',
      awardType: 'знак 40 лет',
      experience: 42,
      inAwardsList: true
    },
    {
      id: 7,
      fullName: 'Васильев Дмитрий Александрович',
      position: 'Техник',
      direction: 'НОК',
      directionFull: 'Направление организации капитального строительства',
      awardType: 'звание лучший по профессии',
      experience: 12,
      inAwardsList: false
    },
    {
      id: 8,
      fullName: 'Федорова Анна Игоревна',
      position: 'Инженер по безопасности',
      direction: 'ДЦНТИБ',
      directionFull: 'Дирекция центра научно-технической информации и библиотек',
      awardType: 'благодарность Н',
      experience: 9,
      inAwardsList: true
    },
    {
      id: 9,
      fullName: 'Смирнов Андрей Викторович',
      position: 'Электромонтер',
      direction: 'Д',
      directionFull: 'Дирекция',
      awardType: 'почетная Грамота Н',
      experience: 25,
      inAwardsList: false
    },
    {
      id: 10,
      fullName: 'Лебедева Татьяна Петровна',
      position: 'Начальник смены',
      direction: 'НТЭ',
      directionFull: 'Направление технической эксплуатации',
      awardType: 'почетный железнодорожник',
      experience: 28,
      inAwardsList: true
    }
  ];

  const directions = [
    { code: 'Д', full: 'Дирекция' },
    { code: 'НТЭ', full: 'Направление технической эксплуатации' },
    { code: 'ДИ', full: 'Дирекция инфраструктуры' },
    { code: 'ДТВ', full: 'Дирекция тягового вещания' },
    { code: 'НС', full: 'Направление строительства' },
    { code: 'ТР', full: 'Трудовые ресурсы' },
    { code: 'НОК', full: 'Направление организации капитального строительства' },
    { code: 'ДЦНТИБ', full: 'Дирекция центра научно-технической информации и библиотек' }
  ];

  const awardTypes = [
    'знак 20 лет',
    'знак 30 лет', 
    'знак 40 лет',
    'звание лучший мастер',
    'звание лучший по профессии',
    'благодарность Ц',
    'почетная Грамота У',
    'благодарность Н',
    'почетная Грамота Н',
    'почетный железнодорожник'
  ];

  // Фильтрация сотрудников
  const filteredEmployees = mockEmployees.filter(employee => {
    const matchesSearch = employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDirection = selectedDirection === 'all' || employee.direction === selectedDirection;
    const matchesAward = selectedAwardType === 'all' || employee.awardType === selectedAwardType;
    
    return matchesSearch && matchesDirection && matchesAward;
  });

  const handleToggleInAwardsList = (employeeId: number) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    if (employee) {
      employee.inAwardsList = !employee.inAwardsList;
      // Здесь будет логика сохранения изменений
      console.log(`${employee.inAwardsList ? 'Добавлен' : 'Удален'} из списка награждения:`, employee.fullName);
    }
  };

  const handleSelectEmployee = (employeeId: number) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleBulkAddToAwardsList = () => {
    selectedEmployees.forEach(employeeId => {
      const employee = mockEmployees.find(emp => emp.id === employeeId);
      if (employee && !employee.inAwardsList) {
        employee.inAwardsList = true;
      }
    });
    setSelectedEmployees([]);
    console.log('Массовое добавление в список награждения');
  };

  const handleBulkRemoveFromAwardsList = () => {
    selectedEmployees.forEach(employeeId => {
      const employee = mockEmployees.find(emp => emp.id === employeeId);
      if (employee && employee.inAwardsList) {
        employee.inAwardsList = false;
      }
    });
    setSelectedEmployees([]);
    console.log('Массовое удаление из списка награждения');
  };

  const employeesInAwardsList = mockEmployees.filter(emp => emp.inAwardsList);
  const employeesNotInList = mockEmployees.filter(emp => !emp.inAwardsList);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/awards-organization')}>
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              К регионам
            </Button>
            <Icon name="Award" size={24} className="text-purple-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Список наград и сотрудников</h1>
              <p className="text-sm text-gray-600">{currentRegion}</p>
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
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Всего сотрудников</p>
                  <p className="text-2xl font-bold text-gray-900">{mockEmployees.length}</p>
                </div>
                <Icon name="Users" className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">В списке награждения</p>
                  <p className="text-2xl font-bold text-green-900">{employeesInAwardsList.length}</p>
                </div>
                <Icon name="CheckCircle" className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Кандидатов</p>
                  <p className="text-2xl font-bold text-orange-900">{employeesNotInList.length}</p>
                </div>
                <Icon name="Clock" className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Процент включения</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {((employeesInAwardsList.length / mockEmployees.length) * 100).toFixed(0)}%
                  </p>
                </div>
                <Icon name="TrendingUp" className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">Все сотрудники</TabsTrigger>
              <TabsTrigger value="in-list">В списке награждения ({employeesInAwardsList.length})</TabsTrigger>
              <TabsTrigger value="candidates">Кандидаты ({employeesNotInList.length})</TabsTrigger>
            </TabsList>
            
            {selectedEmployees.length > 0 && (
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleBulkAddToAwardsList}>
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить выбранных ({selectedEmployees.length})
                </Button>
                <Button size="sm" variant="outline" onClick={handleBulkRemoveFromAwardsList}>
                  <Icon name="Minus" size={16} className="mr-2" />
                  Удалить выбранных
                </Button>
              </div>
            )}
          </div>

          {/* Фильтры */}
          <Card>
            <CardHeader>
              <CardTitle>Фильтры</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Input
                  placeholder="Поиск по ФИО или должности..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={selectedDirection} onValueChange={setSelectedDirection}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Дирекция" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все дирекции</SelectItem>
                    {directions.map(dir => (
                      <SelectItem key={dir.code} value={dir.code}>
                        {dir.code} - {dir.full}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedAwardType} onValueChange={setSelectedAwardType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Тип награды" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все награды</SelectItem>
                    {awardTypes.map(award => (
                      <SelectItem key={award} value={award}>{award}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Все сотрудники */}
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Все сотрудники с наградами</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedEmployees.length === filteredEmployees.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedEmployees(filteredEmployees.map(emp => emp.id));
                            } else {
                              setSelectedEmployees([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>ФИО</TableHead>
                      <TableHead>Должность</TableHead>
                      <TableHead>Дирекция</TableHead>
                      <TableHead>Награда</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedEmployees.includes(employee.id)}
                            onCheckedChange={() => handleSelectEmployee(employee.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{employee.fullName}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{employee.direction}</div>
                            <div className="text-xs text-gray-500">{employee.directionFull}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{employee.awardType}</Badge>
                        </TableCell>
                        <TableCell>
                          {employee.inAwardsList ? (
                            <Badge variant="default" className="bg-green-500">В списке</Badge>
                          ) : (
                            <Badge variant="secondary">Кандидат</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant={employee.inAwardsList ? "destructive" : "default"}
                            onClick={() => handleToggleInAwardsList(employee.id)}
                          >
                            <Icon 
                              name={employee.inAwardsList ? "Minus" : "Plus"} 
                              size={14} 
                              className="mr-1" 
                            />
                            {employee.inAwardsList ? "Удалить" : "Добавить"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* В списке награждения */}
          <TabsContent value="in-list">
            <Card>
              <CardHeader>
                <CardTitle>Сотрудники в списке награждения</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ФИО</TableHead>
                      <TableHead>Должность</TableHead>
                      <TableHead>Дирекция</TableHead>
                      <TableHead>Награда</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeesInAwardsList.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.fullName}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{employee.direction}</div>
                            <div className="text-xs text-gray-500">{employee.directionFull}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{employee.awardType}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleToggleInAwardsList(employee.id)}
                          >
                            <Icon name="Minus" size={14} className="mr-1" />
                            Удалить
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Кандидаты */}
          <TabsContent value="candidates">
            <Card>
              <CardHeader>
                <CardTitle>Кандидаты на награждение</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ФИО</TableHead>
                      <TableHead>Должность</TableHead>
                      <TableHead>Дирекция</TableHead>
                      <TableHead>Награда</TableHead>
                      <TableHead>Опыт работы</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeesNotInList.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.fullName}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{employee.direction}</div>
                            <div className="text-xs text-gray-500">{employee.directionFull}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{employee.awardType}</Badge>
                        </TableCell>
                        <TableCell>{employee.experience} лет</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleToggleInAwardsList(employee.id)}
                          >
                            <Icon name="Plus" size={14} className="mr-1" />
                            Добавить
                          </Button>
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

export default AwardsList;