/**
 * NotificationsPage - Página de histórico completo de notificações
 * 
 * Exibe todas as notificações do usuário com filtros, paginação e ações
 * para marcar como lida/não lida e gerenciar o histórico.
 */

import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Bell, Check, CheckCheck, Filter, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { mockDb, MockNotification } from '@/mocks/db';
import AppHeader from '@/components/shared/AppHeader';

/**
 * Formata data completa da notificação
 */
function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Obtém as iniciais do nome do ator
 */
function getActorInitials(actorName?: string): string {
  if (!actorName) return 'S';
  return actorName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Obtém a cor do badge baseada no tipo de ação
 */
function getActionTypeColor(actionType: string): string {
  const colors: Record<string, string> = {
    'PRODUCT_CREATED': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'PRODUCT_UPDATED': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'PRODUCT_DELETED': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    'USER_INVITED': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    'USER_JOINED': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
    'TEAM_CREATED': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400',
    'TEAM_UPDATED': 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400',
    'DOCUMENT_UPLOADED': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    'PLAN_CHANGED': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  };
  return colors[actionType] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
}

/**
 * Obtém o texto amigável do tipo de ação
 */
function getActionTypeLabel(actionType: string): string {
  const labels: Record<string, string> = {
    'PRODUCT_CREATED': 'Produto Criado',
    'PRODUCT_UPDATED': 'Produto Atualizado',
    'PRODUCT_DELETED': 'Produto Excluído',
    'USER_INVITED': 'Usuário Convidado',
    'USER_JOINED': 'Usuário Ingressou',
    'TEAM_CREATED': 'Equipe Criada',
    'TEAM_UPDATED': 'Equipe Atualizada',
    'DOCUMENT_UPLOADED': 'Documento Enviado',
    'PLAN_CHANGED': 'Plano Alterado',
  };
  return labels[actionType] || actionType;
}

/**
 * Página principal de notificações
 */
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<MockNotification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<MockNotification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const userId = '1'; // Mock user ID

  // Carrega todas as notificações do usuário
  useEffect(() => {
    const userNotifications = mockDb.getNotificationsForUser(userId);
    setNotifications(userNotifications);
    setFilteredNotifications(userNotifications);
  }, [userId]);

  // Aplica filtros
  useEffect(() => {
    let filtered = notifications;

    // Filtro por tab (lidas/não lidas)
    if (activeTab === 'unread') {
      filtered = filtered.filter(n => !n.isRead);
    } else if (activeTab === 'read') {
      filtered = filtered.filter(n => n.isRead);
    }

    // Filtro por tipo de ação
    if (filterType !== 'all') {
      filtered = filtered.filter(n => n.actionType === filterType);
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.metadata?.actorName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, activeTab, filterType, searchTerm]);

  // Marca notificação como lida/não lida
  const toggleNotificationRead = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;

    if (notification.isRead) {
      // Marcar como não lida (simulação)
      setNotifications(prev => 
        prev.map(n => n.id === notificationId 
          ? { ...n, isRead: false, updatedAt: new Date().toISOString() }
          : n
        )
      );
    } else {
      const updatedNotification = mockDb.markNotificationAsRead(notificationId);
      if (updatedNotification) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? updatedNotification : n)
        );
      }
    }
  };

  // Marca todas como lidas
  const handleMarkAllAsRead = () => {
    mockDb.markAllNotificationsAsRead(userId);
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true, updatedAt: new Date().toISOString() }))
    );
  };

  // Estatísticas
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const totalCount = notifications.length;

  return (
    <>
      <Helmet>
        <title>Notificações - SaaS Core</title>
        <meta name="description" content="Gerencie todas as suas notificações" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <AppHeader 
          title="Notificações"
          subtitle="Gerencie todas as suas notificações"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Notificações' }
          ]}
        />

        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Estatísticas */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{totalCount}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                  <div>
                    <p className="text-2xl font-bold">{unreadCount}</p>
                    <p className="text-sm text-muted-foreground">Não lidas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{totalCount - unreadCount}</p>
                    <p className="text-sm text-muted-foreground">Lidas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros e Ações */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Histórico de Notificações</span>
                </CardTitle>
                
                {unreadCount > 0 && (
                  <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Marcar todas como lidas
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Barra de busca e filtros */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar notificações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="PRODUCT_CREATED">Produto Criado</SelectItem>
                    <SelectItem value="PRODUCT_UPDATED">Produto Atualizado</SelectItem>
                    <SelectItem value="DOCUMENT_UPLOADED">Documento Enviado</SelectItem>
                    <SelectItem value="USER_INVITED">Usuário Convidado</SelectItem>
                    <SelectItem value="PLAN_CHANGED">Plano Alterado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">Todas ({totalCount})</TabsTrigger>
                  <TabsTrigger value="unread">Não lidas ({unreadCount})</TabsTrigger>
                  <TabsTrigger value="read">Lidas ({totalCount - unreadCount})</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  {/* Lista de Notificações */}
                  {filteredNotifications.length > 0 ? (
                    <div className="space-y-3">
                      {filteredNotifications.map((notification) => (
                        <Card 
                          key={notification.id} 
                          className={cn(
                            "transition-all duration-200 hover:shadow-md cursor-pointer",
                            !notification.isRead && "border-l-4 border-l-primary bg-muted/30"
                          )}
                          onClick={() => toggleNotificationRead(notification.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-4">
                              {/* Avatar */}
                              <Avatar className="h-10 w-10 mt-1">
                                <AvatarFallback className="text-sm bg-primary/10 text-primary">
                                  {getActorInitials(notification.metadata?.actorName)}
                                </AvatarFallback>
                              </Avatar>
                              
                              {/* Conteúdo */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className={cn(
                                      "text-sm leading-6",
                                      !notification.isRead && "font-medium"
                                    )}>
                                      {notification.message}
                                    </p>
                                    
                                    <div className="flex items-center space-x-3 mt-2">
                                      <Badge 
                                        variant="secondary" 
                                        className={cn(
                                          "text-xs",
                                          getActionTypeColor(notification.actionType)
                                        )}
                                      >
                                        {getActionTypeLabel(notification.actionType)}
                                      </Badge>
                                      
                                      <span className="text-xs text-muted-foreground">
                                        {formatFullDate(notification.createdAt)}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Status e ações */}
                                  <div className="flex items-center space-x-2 ml-4">
                                    {!notification.isRead && (
                                      <div className="w-2 h-2 bg-primary rounded-full" />
                                    )}
                                    
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleNotificationRead(notification.id);
                                      }}
                                      className="h-8 w-8 p-0"
                                    >
                                      {notification.isRead ? (
                                        <Bell className="h-4 w-4" />
                                      ) : (
                                        <Check className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        {activeTab === 'unread' ? 'Nenhuma notificação não lida' : 
                         activeTab === 'read' ? 'Nenhuma notificação lida' : 
                         'Nenhuma notificação encontrada'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {searchTerm || filterType !== 'all' 
                          ? 'Tente ajustar os filtros de busca'
                          : 'As notificações aparecerão aqui quando houver atividade'
                        }
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}