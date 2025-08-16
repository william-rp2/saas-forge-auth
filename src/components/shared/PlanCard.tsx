/**
 * PlanCard Component
 * 
 * Displays pricing plan information with:
 * - Plan name and pricing
 * - Feature highlights
 * - Selection state management
 * - Responsive design
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlanFeature {
  /** Feature description */
  text: string;
  /** Whether the feature is included in this plan */
  included: boolean;
}

interface PlanCardProps {
  /** Plan identifier */
  id: 'basic' | 'pro' | 'enterprise';
  /** Display name of the plan */
  name: string;
  /** Plan description */
  description: string;
  /** Price information */
  price: {
    /** Numerical price value */
    amount: number;
    /** Currency symbol */
    currency: string;
    /** Billing period */
    period: string;
  };
  /** List of features for this plan */
  features: PlanFeature[];
  /** Whether this plan is currently selected */
  isSelected: boolean;
  /** Whether this plan is popular/recommended */
  isPopular?: boolean;
  /** Callback when plan is selected */
  onSelect: (planId: 'basic' | 'pro' | 'enterprise') => void;
}

/**
 * Plan selection card component
 */
export const PlanCard = ({
  id,
  name,
  description,
  price,
  features,
  isSelected,
  isPopular = false,
  onSelect,
}: PlanCardProps) => {
  return (
    <Card
      className={cn(
        'relative cursor-pointer transition-all duration-200 hover:shadow-md',
        isSelected && 'ring-2 ring-primary shadow-brand',
        isPopular && 'border-primary'
      )}
      onClick={() => onSelect(id)}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">
            Mais Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-semibold">{name}</CardTitle>
        <div className="space-y-2">
          <div className="flex items-baseline justify-center space-x-1">
            <span className="text-3xl font-bold text-foreground">
              {price.currency}{price.amount}
            </span>
            <span className="text-muted-foreground">/{price.period}</span>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start space-x-3',
                !feature.included && 'opacity-50'
              )}
            >
              <div className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0',
                feature.included 
                  ? 'bg-success text-success-foreground' 
                  : 'bg-muted text-muted-foreground'
              )}>
                <Check className="w-3 h-3" />
              </div>
              <span className="text-sm text-foreground">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-center space-x-2 text-primary">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">Plano Selecionado</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};