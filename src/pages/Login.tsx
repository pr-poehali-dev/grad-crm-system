import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

const Login = () => {
  const [formData, setFormData] = useState({
    role: '',
    login: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const roles = [
    { value: 'direction', label: 'Сотрудник дирекции' },
    { value: 'nok', label: 'Сотрудник НОК' },
    { value: 'region', label: 'Сотрудник региона' },
    { value: 'center', label: 'Сотрудник Ц' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.role || !formData.login || !formData.password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    // Проверка логина и пароля
    if (formData.login === 'Иконникова' && formData.password === 'Катя') {
      // Сохраняем данные пользователя в localStorage
      localStorage.setItem('userRole', formData.role);
      localStorage.setItem('userLogin', formData.login);
      localStorage.setItem('isAuthenticated', 'true');
      
      // Перенаправляем в систему
      navigate('/dashboard');
    } else {
      setError('Неверный логин или пароль');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Название системы */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Icon name="Award" size={48} className="text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Награды РЖД</h1>
          </div>
          <p className="text-gray-600">Система управления наградами</p>
        </div>

        {/* Форма входа */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Вход в систему</CardTitle>
            <CardDescription className="text-center">
              Выберите роль и введите данные для входа
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Выбор роли */}
              <div className="space-y-2">
                <Label htmlFor="role">Роль пользователя</Label>
                <Select onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите роль" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Логин */}
              <div className="space-y-2">
                <Label htmlFor="login">Логин</Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="Введите логин"
                  value={formData.login}
                  onChange={(e) => handleInputChange('login', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Пароль */}
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Ошибка */}
              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                  <Icon name="AlertCircle" size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Кнопка входа */}
              <Button type="submit" className="w-full">
                <Icon name="LogIn" size={16} className="mr-2" />
                Войти в систему
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Подсказка для тестирования */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Тестовые данные для входа:</p>
              <p>Логин: <strong>Иконникова</strong></p>
              <p>Пароль: <strong>Катя</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;