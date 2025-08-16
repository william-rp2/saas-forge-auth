/**
 * FormDivider Component
 * 
 * Provides a visual separator for forms with:
 * - Horizontal line with centered text
 * - Consistent styling across auth forms
 * - Responsive design
 */

interface FormDividerProps {
  /** Text to display in the center of the divider */
  text?: string;
}

/**
 * Form divider component with optional centered text
 */
export const FormDivider = ({ text = 'ou' }: FormDividerProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          {text}
        </span>
      </div>
    </div>
  );
};