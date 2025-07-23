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
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const userLogin = localStorage.getItem('userLogin');

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userLogin');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  // Helper function to get notification icon based on type
  const getNotificationIcon = (type: string): string => {
    const iconMap: { [key: string]: string } = {
      'pending_approval': 'Clock',
      'approved': 'CheckCircle',
      'rejected': 'XCircle',
      'deadline': 'AlertTriangle',
      'info': 'Info',
      'warning': 'AlertTriangle'
    };
    return iconMap[type] || 'Bell';
  };

  // Helper function to get notification color class based on type
  const getNotificationColor = (type: string): string => {
    const colorMap: { [key: string]: string } = {
      'pending_approval': 'text-yellow-600',
      'approved': 'text-green-600',
      'rejected': 'text-red-600',
      'deadline': 'text-orange-600',
      'info': 'text-blue-600',
      'warning': 'text-orange-600'
    };
    return colorMap[type] || 'text-gray-600';
  };

  // Helper function to generate order from template
  const generateOrderFromTemplate = (templateData: { template: string }, orderData: { number: string; date: string }): string => {
    let result = templateData.template;
    result = result.replace('{orderNumber}', orderData.number);
    result = result.replace('{date}', orderData.date);
    result = result.replace('{employeesList}', 'Список сотрудников будет добавлен при формировании окончательного приказа');
    return result;
  };

  // Helper function to generate sample order template
  const образецПриказа = (orderData: any): string => {
    const eventNames: { [key: string]: string } = {
      'день-ржд': 'в связи с Днём работников железнодорожного транспорта',
      'проф-праздник': 'в связи с профессиональным праздником',
      'новый-год': 'в связи с Новогодними праздниками',
      'день-победы': 'в связи с Днём Победы',
      'юбилей': 'в связи с юбилеем предприятия',
      'досрочное': 'за досрочные достижения'
    };
    
    const selectedAwardsText = orderData.selectedAwards && orderData.selectedAwards.length > 0 
      ? `Наградить следующими наградами:\n${orderData.selectedAwards.map((award: string, index: number) => `${index + 1}. ${award}`).join('\n')}\n\n`
      : 'Награды будут указаны после выбора\n\n';
    
    return `ОАО "Российские железные дороги"\n\nПРИКАЗ № П-___ от ${orderData.date || new Date().toLocaleDateString('ru-RU')}\n\n${orderData.title || 'О награждении'}\n\n${orderData.event ? (eventNames[orderData.event] || orderData.event) + '\n\n' : ''}${selectedAwardsText}Список награждаемых сотрудников будет добавлен после создания приказа.\n\nПрезидент ОАО "РЖД" О.В. Белозёров`;
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [selectedAwards, setSelectedAwards] = useState<string[]>([]);
  const [orderTemplate, setOrderTemplate] = useState('');
  const [orderData, setOrderData] = useState({
    title: '',
    event: '',
    date: new Date().toISOString().split('T')[0],
    number: ''
  });

  // Получить роль пользователя на русском
  const getRoleName = (role: string) => {
    const roleNames: { [key: string]: string } = {
      'direction': 'Сотрудник дирекции',
      'nok': 'Сотрудник НОК',
      'region': 'Сотрудник региона',
      'center': 'Сотрудник Ц'
    };
    return roleNames[role] || role;
  };

  // Мокованные данные для различных ролей
  const mockNotifications = [
    {
      id: 1,
      type: 'pending_approval',
      title: 'Заявка на награждение №1234',
      description: 'Заявка от Московского региона ожидает одобрения',
      date: '2024-03-15',
      priority: 'high',
      region: 'Москва',
      category: 'Медаль'
    },
    {
      id: 2,
      type: 'approved',
      title: 'Приказ о награждении утвержден',
      description: 'Приказ №567 от 12.03.2024 успешно утвержден',
      date: '2024-03-12',
      priority: 'medium',
      region: 'СПб',
      category: 'Орден'
    },
    {
      id: 3,
      type: 'deadline',
      title: 'Приближается дедлайн',
      description: 'До окончания срока подачи заявок осталось 3 дня',
      date: '2024-03-18',
      priority: 'high',
      region: 'Все',
      category: 'Общее'
    }
  ];

  const mockAwards = [
    'Медаль "За безупречную службу"',
    'Орден "Трудовая слава"',
    'Почетная грамота РЖД',
    'Благодарность президента РЖД',
    'Знак "Почетному железнодорожнику"'
  ];

  const mockTemplates = [
    {
      id: 1,
      name: 'День работника железнодорожного транспорта',
      template: 'В связи с профессиональным праздником - Днём работника железнодорожного транспорта, награждаются следующие сотрудники: {employeesList}'
    },
    {
      id: 2,
      name: 'За выдающиеся достижения',
      template: 'За выдающиеся достижения в работе и безупречную службу награждаются: {employeesList}'
    }
  ];

  // Фильтрация уведомлений
  const filteredNotifications = mockNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || notification.type === statusFilter;
    const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter;
    const matchesRegion = regionFilter === 'all' || notification.region === regionFilter;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesRegion;
  });

  const handleNotificationSelect = (id: number) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(notifId => notifId !== id)
        : [...prev, id]
    );
  };

  const handleAwardToggle = (award: string) => {
    setSelectedAwards(prev => 
      prev.includes(award)
        ? prev.filter(a => a !== award)
        : [...prev, award]
    );
  };

  const handleGenerateOrder = () => {
    const template = mockTemplates.find(t => t.id === 1);
    if (template) {
      const generatedOrder = образецПриказа({
        ...orderData,
        selectedAwards
      });
      setOrderTemplate(generatedOrder);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header с информацией о пользователе */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Icon name="Award" size={24} className="text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">Система управления наградами РЖД</h1>
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
              <CardTitle className="text-sm font-medium">Всего заявок</CardTitle>
              <Icon name="FileText" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">+12% к прошлому месяцу</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">На рассмотрении</CardTitle>
              <Icon name="Clock" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34</div>
              <p className="text-xs text-muted-foreground">Требует внимания</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Утверждено</CardTitle>
              <Icon name="CheckCircle" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">189</div>
              <p className="text-xs text-muted-foreground">+8% к прошлому месяцу</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Отклонено</CardTitle>
              <Icon name="XCircle" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">-3% к прошлому месяцу</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications">Уведомления</TabsTrigger>
            <TabsTrigger value="awards">Награды</TabsTrigger>
            <TabsTrigger value="orders">Приказы</TabsTrigger>
            <TabsTrigger value="templates">Шаблоны</TabsTrigger>
          </TabsList>

          {/* Вкладка уведомлений */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Уведомления и заявки</CardTitle>
                <div className="flex flex-wrap gap-4 mt-4">
                  <Input
                    placeholder="Поиск уведомлений..."
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
                      <SelectItem value="pending_approval">На рассмотрении</SelectItem>
                      <SelectItem value="approved">Утверждено</SelectItem>
                      <SelectItem value="rejected">Отклонено</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={regionFilter} onValueChange={setRegionFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Регион" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все регионы</SelectItem>
                      <SelectItem value="Москва">Москва</SelectItem>
                      <SelectItem value="СПб">Санкт-Петербург</SelectItem>
                      <SelectItem value="Екатеринбург">Екатеринбург</SelectItem>
                    </SelectContent>
                  </Select>
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
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">Регион: {notification.region}</span>
                          <span className="text-xs text-gray-500">Категория: {notification.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Вкладка наград */}
          <TabsContent value="awards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Управление наградами</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockAwards.map((award, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <Checkbox
                        checked={selectedAwards.includes(award)}
                        onCheckedChange={() => handleAwardToggle(award)}
                      />
                      <Icon name="Award" className="h-4 w-4 text-yellow-600" />
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Вкладка приказов */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Генерация приказов о награждении</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="order-title">Заголовок приказа</Label>
                    <Input
                      id="order-title"
                      value={orderData.title}
                      onChange={(e) => setOrderData({...orderData, title: e.target.value})}
                      placeholder="О награждении сотрудников"
                    />
                  </div>
                  <div>
                    <Label htmlFor="order-date">Дата приказа</Label>
                    <Input
                      id="order-date"
                      type="date"
                      value={orderData.date}
                      onChange={(e) => setOrderData({...orderData, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="order-event">Повод для награждения</Label>
                    <Select onValueChange={(value) => setOrderData({...orderData, event: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите повод" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="день-ржд">День работника ж/д транспорта</SelectItem>
                        <SelectItem value="проф-праздник">Профессиональный праздник</SelectItem>
                        <SelectItem value="новый-год">Новогодние праздники</SelectItem>
                        <SelectItem value="день-победы">День Победы</SelectItem>
                        <SelectItem value="юбилей">Юбилей предприятия</SelectItem>
                        <SelectItem value="досрочное">Досрочные достижения</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="order-number">Номер приказа</Label>
                    <Input
                      id="order-number"
                      value={orderData.number}
                      onChange={(e) => setOrderData({...orderData, number: e.target.value})}
                      placeholder="П-1234"
                    />
                  </div>
                </div>
                
                <Button onClick={handleGenerateOrder} className="w-full">
                  <Icon name="FileText" className="h-4 w-4 mr-2" />
                  Сгенерировать приказ
                </Button>

                {orderTemplate && (
                  <div className="mt-6">
                    <Label htmlFor="order-preview">Предварительный просмотр приказа</Label>
                    <Textarea
                      id="order-preview"
                      value={orderTemplate}
                      onChange={(e) => setOrderTemplate(e.target.value)}
                      rows={15}
                      className="mt-2 font-mono text-sm"
                    />
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline">
                        <Icon name="Download" className="h-4 w-4 mr-2" />
                        Скачать
                      </Button>
                      <Button variant="outline">
                        <Icon name="Printer" className="h-4 w-4 mr-2" />
                        Печать
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Вкладка шаблонов */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Шаблоны приказов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTemplates.map((template) => (
                    <div key={template.id} className="p-4 border rounded-lg space-y-2">
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.template}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Icon name="Edit" className="h-4 w-4 mr-2" />
                          Редактировать
                        </Button>
                        <Button size="sm" variant="outline">
                          <Icon name="Copy" className="h-4 w-4 mr-2" />
                          Копировать
                        </Button>
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

export default Dashboard;