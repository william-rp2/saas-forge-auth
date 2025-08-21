/**
 * NotificationBell Component - Componente de notificações em formato de sininho
 * 
 * Exibe um ícone de sino com contador de notificações não lidas e dropdown
 * com lista das notificações mais recentes do usuário.
 */

import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { mockDb, MockNotification } from '@/mocks/db';
import { Link } from 'react-router-dom';

interface NotificationBellProps {
  /** ID do usuário atual */
  userId: string;
  /** Classe CSS adicional */
  className?: string;
}

/**
 * Formata o tempo relativo da notificação
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Agora';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;
  
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
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
 * Componente principal do sino de notificações
 */
export default function NotificationBell({ userId, className }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<MockNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Carrega notificações do usuário
  useEffect(() => {
    const userNotifications = mockDb.getNotificationsForUser(userId, 10);
    const unreadNotifications = mockDb.getUnreadNotificationsCount(userId);
    
    setNotifications(userNotifications);
    setUnreadCount(unreadNotifications);
  }, [userId]);

  // Marca notificação como lida
  const handleMarkAsRead = (notificationId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const updatedNotification = mockDb.markNotificationAsRead(notificationId);
    if (updatedNotification) {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? updatedNotification : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  // Marca todas como lidas
  const handleMarkAllAsRead = () => {
    mockDb.markAllNotificationsAsRead(userId);
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true, updatedAt: new Date().toISOString() }))
    );
    setUnreadCount(0);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "relative h-10 w-10 rounded-full p-0",
            className
          )}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80" 
        align="end" 
        forceMount
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 pb-2">
          <DropdownMenuLabel className="p-0 font-semibold">
            Notificações
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Lista de Notificações */}
        {notifications.length > 0 ? (
          <ScrollArea className="h-80">
            <div className="space-y-1">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex items-start space-x-3 p-3 cursor-pointer",
                    !notification.isRead && "bg-muted/50"
                  )}
                  asChild
                >
                  <div>
                    {/* Avatar do ator */}
                    <Avatar className="h-8 w-8 mt-0.5">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {getActorInitials(notification.metadata?.actorName)}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Conteúdo da notificação */}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm leading-5",
                        !notification.isRead && "font-medium"
                      )}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                    
                    {/* Indicador de não lida e ação */}
                    <div className="flex items-center space-x-1">
                      {!notification.isRead && (
                        <>
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="p-6 text-center">
            <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhuma notificação
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Você está em dia!
            </p>
          </div>
        )}
        
        {/* Footer - Ver todas */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link 
                to="/notifications" 
                className="flex items-center justify-center p-3 text-sm font-medium text-primary hover:text-primary/80"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver todas as notificações
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}