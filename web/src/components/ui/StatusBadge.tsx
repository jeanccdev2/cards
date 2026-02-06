 import { cn } from '@/lib/utils';
 import { CardStatus } from '@/types';
 
 interface StatusBadgeProps {
   status: CardStatus;
   className?: string;
 }
 
 const statusConfig: Record<CardStatus, { label: string; className: string }> = {
   done: {
     label: 'Feito',
     className: 'bg-status-done/10 text-status-done border-status-done/20',
   },
   undone: {
     label: 'Pendente',
     className: 'bg-status-pending/10 text-status-pending border-status-pending/20',
   },
   doing: {
     label: 'Fazendo',
     className: 'bg-status-doing/10 text-status-doing border-status-doing/20',
   },
 };
 
 export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
   const config = statusConfig[status];
   
   return (
     <span
       className={cn(
         'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
         config.className,
         className
       )}
     >
       {config.label}
     </span>
   );
 };