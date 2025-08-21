/**
 * NotificationService - Serviço central para gerenciamento de notificações
 * 
 * Responsabilidades:
 * 1. Criar notificações no sistema
 * 2. Integrar com webhook N8N para envio de e-mails
 * 3. Gerenciar estado de leitura das notificações
 */

import { mockDb } from '@/mocks/db';

// Types
export type NotificationActionType = 
  | 'PRODUCT_CREATED'
  | 'PRODUCT_UPDATED'
  | 'PRODUCT_DELETED'
  | 'USER_INVITED'
  | 'USER_JOINED'
  | 'TEAM_CREATED'
  | 'TEAM_UPDATED'
  | 'DOCUMENT_UPLOADED'
  | 'PLAN_CHANGED';

export interface CreateNotificationParams {
  recipientUserId: string;
  actorUserId?: string;
  actionType: NotificationActionType;
  entityId?: string;
  entityType?: string;
  teamId?: string;
  message?: string;
  metadata?: Record<string, any>;
}

export interface NotificationWebhookPayload {
  eventType: NotificationActionType;
  recipient: {
    name: string;
    email: string;
  };
  actor?: {
    name: string;
  };
  team?: {
    name: string;
  };
  entity?: {
    type: string;
    name: string;
    url?: string;
  };
  metadata?: Record<string, any>;
}

export interface Notification {
  id: string;
  recipientUserId: string;
  actorUserId?: string;
  actionType: NotificationActionType;
  entityId?: string;
  entityType?: string;
  teamId?: string;
  isRead: boolean;
  message?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

class NotificationService {
  private webhookUrl: string;

  constructor() {
    // Em produção, isso viria de uma variável de ambiente
    this.webhookUrl = import.meta.env.VITE_N8N_NOTIFICATION_WEBHOOK_URL || 'http://localhost:5678/webhook/notifications';
  }

  /**
   * Cria uma nova notificação no sistema
   */
  async create(params: CreateNotificationParams): Promise<Notification> {
    try {
      // Criar notificação no banco de dados (mockado)
      const notification = mockDb.createNotification({
        recipientUserId: params.recipientUserId,
        actorUserId: params.actorUserId,
        actionType: params.actionType,
        entityId: params.entityId,
        entityType: params.entityType,
        teamId: params.teamId,
        message: params.message,
        metadata: params.metadata,
      });

      // Enviar webhook para N8N (não aguarda para não bloquear)
      this.sendWebhook(notification).catch(error => {
        console.error('Erro ao enviar webhook:', error);
        // Em produção, isso deveria ser logado em um sistema de monitoramento
      });

      return notification;
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw new Error('Falha ao criar notificação');
    }
  }

  /**
   * Cria notificações para todos os membros de uma equipe (exceto o autor)
   */
  async createForTeamMembers(params: Omit<CreateNotificationParams, 'recipientUserId'> & { excludeUserId?: string }): Promise<Notification[]> {
    if (!params.teamId) {
      throw new Error('teamId é obrigatório para notificações de equipe');
    }

    try {
      const teamMembers = mockDb.getTeamMembers(params.teamId);
      const notifications: Notification[] = [];

      for (const member of teamMembers) {
        // Pular o usuário que executou a ação
        if (params.excludeUserId && member.userId === params.excludeUserId) {
          continue;
        }

        const notification = await this.create({
          ...params,
          recipientUserId: member.userId,
        });

        notifications.push(notification);
      }

      return notifications;
    } catch (error) {
      console.error('Erro ao criar notificações para equipe:', error);
      throw new Error('Falha ao criar notificações para equipe');
    }
  }

  /**
   * Marca uma notificação como lida
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      mockDb.markNotificationAsRead(notificationId, userId);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw new Error('Falha ao marcar notificação como lida');
    }
  }

  /**
   * Marca todas as notificações de um usuário como lidas
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      mockDb.markAllNotificationsAsRead(userId);
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      throw new Error('Falha ao marcar todas as notificações como lidas');
    }
  }

  /**
   * Busca notificações de um usuário
   */
  async getUserNotifications(userId: string, options?: { limit?: number; offset?: number; unreadOnly?: boolean }): Promise<{
    notifications: Notification[];
    total: number;
    unreadCount: number;
  }> {
    try {
      return mockDb.getUserNotifications(userId, options);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      throw new Error('Falha ao buscar notificações');
    }
  }

  /**
   * Envia webhook para N8N
   */
  private async sendWebhook(notification: Notification): Promise<void> {
    try {
      // Buscar dados do destinatário
      const recipient = mockDb.getUserById(notification.recipientUserId);
      if (!recipient) {
        throw new Error('Destinatário não encontrado');
      }

      // Buscar dados do ator (se existir)
      let actor;
      if (notification.actorUserId) {
        actor = mockDb.getUserById(notification.actorUserId);
      }

      // Buscar dados da equipe (se existir)
      let team;
      if (notification.teamId) {
        team = mockDb.getTeamById(notification.teamId);
      }

      // Buscar dados da entidade (se existir)
      let entity;
      if (notification.entityId && notification.entityType) {
        entity = this.getEntityData(notification.entityId, notification.entityType);
      }

      // Montar payload do webhook
      const payload: NotificationWebhookPayload = {
        eventType: notification.actionType,
        recipient: {
          name: recipient.fullName,
          email: recipient.email,
        },
        ...(actor && {
          actor: {
            name: actor.fullName,
          },
        }),
        ...(team && {
          team: {
            name: team.name,
          },
        }),
        ...(entity && { entity }),
        ...(notification.metadata && { metadata: notification.metadata }),
      };

      // Enviar webhook
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed with status: ${response.status}`);
      }

      console.log('Webhook enviado com sucesso para N8N');
    } catch (error) {
      console.error('Erro ao enviar webhook:', error);
      throw error;
    }
  }

  /**
   * Busca dados da entidade baseado no tipo e ID
   */
  private getEntityData(entityId: string, entityType: string): { type: string; name: string; url?: string } | null {
    try {
      switch (entityType.toLowerCase()) {
        case 'product':
          const product = mockDb.getProductById(entityId);
          return product ? {
            type: 'Product',
            name: product.name,
            url: `${window.location.origin}/admin/products/${entityId}`,
          } : null;

        case 'team':
          const team = mockDb.getTeamById(entityId);
          return team ? {
            type: 'Team',
            name: team.name,
            url: `${window.location.origin}/settings/team`,
          } : null;

        case 'user':
          const user = mockDb.getUserById(entityId);
          return user ? {
            type: 'User',
            name: user.fullName,
          } : null;

        default:
          return {
            type: entityType,
            name: `${entityType} ${entityId}`,
          };
      }
    } catch (error) {
      console.error('Erro ao buscar dados da entidade:', error);
      return null;
    }
  }
}

// Singleton instance
export const notificationService = new NotificationService();

// Helper functions para casos de uso comuns
export const NotificationHelpers = {
  /**
   * Cria notificação para criação de produto
   */
  async productCreated(productId: string, productName: string, creatorId: string, teamId: string) {
    return notificationService.createForTeamMembers({
      actorUserId: creatorId,
      actionType: 'PRODUCT_CREATED',
      entityId: productId,
      entityType: 'Product',
      teamId,
      message: `Novo produto "${productName}" foi criado`,
      excludeUserId: creatorId,
    });
  },

  /**
   * Cria notificação para convite de usuário
   */
  async userInvited(invitedEmail: string, inviterName: string, teamId: string, teamName: string) {
    // Para convites, criamos uma notificação especial que será processada quando o usuário aceitar
    // Por enquanto, apenas enviamos o webhook
    const payload: NotificationWebhookPayload = {
      eventType: 'USER_INVITED',
      recipient: {
        name: invitedEmail.split('@')[0], // Usar parte do email como nome temporário
        email: invitedEmail,
      },
      actor: {
        name: inviterName,
      },
      team: {
        name: teamName,
      },
      entity: {
        type: 'Team',
        name: teamName,
        url: `${window.location.origin}/teams/join`,
      },
    };

    // Enviar diretamente o webhook para convites
    try {
      const response = await fetch(import.meta.env.VITE_N8N_NOTIFICATION_WEBHOOK_URL || 'http://localhost:5678/webhook/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao enviar webhook de convite:', error);
    }
  },

  /**
   * Cria notificação para upload de documento
   */
  async documentUploaded(documentName: string, uploaderId: string, teamId: string) {
    return notificationService.createForTeamMembers({
      actorUserId: uploaderId,
      actionType: 'DOCUMENT_UPLOADED',
      entityType: 'Document',
      teamId,
      message: `Novo documento "${documentName}" foi enviado`,
      excludeUserId: uploaderId,
    });
  },
};