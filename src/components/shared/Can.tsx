/**
 * Can Component
 * 
 * Wrapper component that conditionally renders children based on user permissions.
 * Uses the usePermissions hook internally to check if the current user has
 * the required permission for the specified action and subject.
 */

import { ReactNode } from 'react';
import { usePermissions } from '@/lib/hooks/usePermissions';

interface CanProps {
  /** The action to check permission for */
  action: string;
  /** The subject/resource to check permission for */
  subject: string;
  /** Content to render if permission is granted */
  children: ReactNode;
  /** Optional fallback content to render if permission is denied */
  fallback?: ReactNode;
}

/**
 * Can component for conditional rendering based on permissions
 * 
 * @example
 * ```tsx
 * <Can action="create" subject="Project">
 *   <Button>Create Project</Button>
 * </Can>
 * 
 * <Can 
 *   action="delete" 
 *   subject="User" 
 *   fallback={<span>Insufficient permissions</span>}
 * >
 *   <Button variant="destructive">Delete User</Button>
 * </Can>
 * ```
 */
export const Can = ({ action, subject, children, fallback = null }: CanProps) => {
  const { can, isLoading } = usePermissions();

  // Don't render anything while loading permissions
  if (isLoading) {
    return null;
  }

  // Check if user has the required permission
  if (can(action, subject)) {
    return <>{children}</>;
  }

  // Return fallback if provided, otherwise nothing
  return <>{fallback}</>;
};