/**
 * Componente seletor de equipes
 * Permite alternar entre equipes e criar novas
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronsUpDown, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useTeams } from '@/lib/contexts/TeamContext';

interface TeamSwitcherProps {
  /** Se deve mostrar o botão compacto (apenas ícone) */
  compact?: boolean;
  /** Classes CSS customizadas */
  className?: string;
}

/**
 * Seletor de equipes para alternar entre diferentes espaços de trabalho
 */
export default function TeamSwitcher({ compact = false, className }: TeamSwitcherProps) {
  const [open, setOpen] = useState(false);
  const { currentTeam, userTeams, switchTeam, isLoading } = useTeams();

  if (isLoading) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <div className="w-8 h-8 bg-muted rounded-lg animate-pulse" />
        {!compact && <div className="w-24 h-4 bg-muted rounded animate-pulse" />}
      </div>
    );
  }

  if (userTeams.length === 0) {
    return (
      <Button variant="outline" size="sm" asChild className={className}>
        <Link to="/teams/create">
          <Plus className="w-4 h-4 mr-2" />
          {!compact && "Criar Equipe"}
        </Link>
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Selecionar equipe"
          className={cn(
            "justify-between bg-background",
            compact ? "w-10 h-10 p-0" : "w-[200px]",
            className
          )}
        >
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-md flex items-center justify-center text-xs font-semibold">
              {currentTeam?.name.charAt(0).toUpperCase() || 'T'}
            </div>
            {!compact && (
              <span className="truncate">
                {currentTeam?.name || 'Selecionar equipe'}
              </span>
            )}
          </div>
          {!compact && <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[250px] p-0 bg-background border border-border shadow-md">
        <Command>
          <CommandInput placeholder="Buscar equipe..." />
          <CommandEmpty>Nenhuma equipe encontrada.</CommandEmpty>
          <CommandList>
            <CommandGroup heading="Suas Equipes">
              {userTeams.map((team) => (
                <CommandItem
                  key={team.id}
                  value={team.name}
                  onSelect={() => {
                    switchTeam(team.id);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-md flex items-center justify-center text-xs font-semibold">
                      {team.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{team.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {team.ownerId === '1' ? 'Proprietário' : 'Membro'}
                      </div>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentTeam?.id === team.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            
            <CommandSeparator />
            
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  // Navigate to create team page
                }}
                className="cursor-pointer"
              >
                <Link to="/teams/create" className="flex items-center space-x-3 w-full">
                  <div className="w-6 h-6 bg-muted rounded-md flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span>Criar nova equipe</span>
                </Link>
              </CommandItem>
              
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <Link to="/settings/team" className="flex items-center space-x-3 w-full">
                  <div className="w-6 h-6 bg-muted rounded-md flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span>Gerenciar equipe</span>
                </Link>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}