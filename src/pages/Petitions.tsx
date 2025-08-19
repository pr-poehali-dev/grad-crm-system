import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Petition {
  id: number;
  number: string;
  date: string;
  title: string;
  department: string;
  employeeCount: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdBy: string;
  lastModified: string;
}

const mockPetitions: Petition[] = [
  {
    id: 1,
    number: 'ХОД-2024-001',
    date: '15.11.2024',
    title: 'Ходатайство о награждении за трудовые заслуги',
    department: 'Служба пути',
    employeeCount: 5,
    status: 'approved',
    createdBy: 'Петров П.П.',
    lastModified: '16.11.2024'
  },
  {
    id: 2,
    number: 'ХОД-2024-002',
    date: '18.11.2024',
    title: 'Ходатайство к профессиональному празднику',
    department: 'Локомотивное депо',
    employeeCount: 12,
    status: 'pending',
    createdBy: 'Иванов И.И.',
    lastModified: '18.11.2024'
  },
  {
    id: 3,
    number: 'ХОД-2024-003',
    date: '20.11.2024',
    title: 'Ходатайство за выполнение плана',
    department: 'Дистанция СЦБ',
    employeeCount: 8,
    status: 'draft',
    createdBy: 'Сидоров С.С.',
    lastModified: '20.11.2024'
  }
];

export default function Petitions() {
  const navigate = useNavigate();
  const [petitions] = useState<Petition[]>(mockPetitions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Черновик', color: '#6B7280', bgColor: '#F3F4F6' },
      pending: { label: 'На рассмотрении', color: '#D97706', bgColor: '#FEF3C7' },
      approved: { label: 'Утверждено', color: '#059669', bgColor: '#D1FAE5' },
      rejected: { label: 'Отклонено', color: '#DC2626', bgColor: '#FEE2E2' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge style={{ backgroundColor: config.bgColor, color: config.color }}>
        {config.label}
      </Badge>
    );
  };

  const filteredPetitions = petitions.filter(petition => {
    const matchesSearch = petition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         petition.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         petition.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || petition.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || petition.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const handleCreatePetition = () => {
    navigate('/petitions/create');
  };

  const handleViewPetition = (petitionId: number) => {
    navigate(`/petitions/${petitionId}`);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="FileText" size={32} style={{color: 'hsl(var(--rzd-red))'}} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">История ходатайств</h1>
            <p className="text-gray-600">Управление ходатайствами на награждение сотрудников</p>
          </div>
        </div>
        <Button onClick={handleCreatePetition} className="bg-blue-600 hover:bg-blue-700">
          <Icon name="Plus" size={20} className="mr-2" />
          Создать ходатайство
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{petitions.length}</div>
            <div className="text-sm text-gray-600">Всего ходатайств</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {petitions.filter(p => p.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">На рассмотрении</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {petitions.filter(p => p.status === 'approved').length}
            </div>
            <div className="text-sm text-gray-600">Утверждено</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {petitions.filter(p => p.status === 'draft').length}
            </div>
            <div className="text-sm text-gray-600">Черновики</div>
          </CardContent>
        </Card>
      </div>

      {/* Таблица ходатайств */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Список ходатайств</span>
          </CardTitle>
          
          {/* Фильтры */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="relative flex-1 min-w-64">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Поиск по названию, номеру или автору..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
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
                <SelectItem value="approved">Утверждено</SelectItem>
                <SelectItem value="rejected">Отклонено</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Подразделение" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все подразделения</SelectItem>
                <SelectItem value="Служба пути">Служба пути</SelectItem>
                <SelectItem value="Локомотивное депо">Локомотивное депо</SelectItem>
                <SelectItem value="Дистанция СЦБ">Дистанция СЦБ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Номер</TableHead>
                  <TableHead className="font-semibold text-gray-700">Дата создания</TableHead>
                  <TableHead className="font-semibold text-gray-700">Название</TableHead>
                  <TableHead className="font-semibold text-gray-700">Подразделение</TableHead>
                  <TableHead className="font-semibold text-gray-700">Сотрудников</TableHead>
                  <TableHead className="font-semibold text-gray-700">Статус</TableHead>
                  <TableHead className="font-semibold text-gray-700">Автор</TableHead>
                  <TableHead className="font-semibold text-gray-700">Изменено</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPetitions.map((petition) => (
                  <TableRow key={petition.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{petition.number}</TableCell>
                    <TableCell>{petition.date}</TableCell>
                    <TableCell className="max-w-64">
                      <div className="truncate" title={petition.title}>
                        {petition.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{petition.department}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Icon name="Users" size={14} className="text-gray-500" />
                        <span>{petition.employeeCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(petition.status)}</TableCell>
                    <TableCell className="text-gray-600">{petition.createdBy}</TableCell>
                    <TableCell className="text-gray-600">{petition.lastModified}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewPetition(petition.id)}
                        >
                          <Icon name="Eye" size={16} />
                        </Button>
                        {petition.status === 'draft' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewPetition(petition.id)}
                          >
                            <Icon name="Edit" size={16} />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Icon name="Download" size={16} />
                        </Button>
                        {petition.status === 'draft' && (
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

          {filteredPetitions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Icon name="Search" size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Ходатайства не найдены</p>
              <p className="text-sm">Попробуйте изменить параметры поиска</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}