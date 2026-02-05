 import { Card, User } from '@/types';
 
 export const mockUser: User = {
   id: 'user-1',
   created_at: new Date('2024-01-01'),
   name: 'João Silva',
   email: 'joao@exemplo.com',
 };
 
 export const mockCards: Card[] = [
   {
     id: 'card-1',
     created_at: new Date('2024-01-15'),
     updated_at: new Date('2024-01-15'),
     title: 'Implementar autenticação',
     content: 'Criar sistema de login com JWT e refresh tokens. Incluir validação de email.',
     status: 'done',
     user_id: 'user-1',
   },
   {
     id: 'card-2',
     created_at: new Date('2024-01-16'),
     updated_at: new Date('2024-01-16'),
     title: 'Design do Dashboard',
     content: 'Criar layout responsivo para o dashboard principal com cards de métricas.',
     status: 'doing',
     user_id: 'user-1',
   },
   {
     id: 'card-3',
     created_at: new Date('2024-01-17'),
     updated_at: new Date('2024-01-17'),
     title: 'Integração com API',
     content: 'Conectar frontend com backend usando React Query para cache e mutations.',
     status: 'undone',
     user_id: 'user-1',
   },
   {
     id: 'card-4',
     created_at: new Date('2024-01-18'),
     updated_at: new Date('2024-01-18'),
     title: 'Testes unitários',
     content: 'Escrever testes para componentes principais usando Vitest e Testing Library.',
     status: 'undone',
     user_id: 'user-1',
   },
   {
     id: 'card-5',
     created_at: new Date('2024-01-19'),
     updated_at: new Date('2024-01-19'),
     title: 'Documentação',
     content: 'Documentar APIs e fluxos principais do sistema.',
     status: 'doing',
     user_id: 'user-1',
   },
 ];
 
 export const generateMockCardsFromVoice = (): Card[] => {
   const newCards: Card[] = [
     {
       id: `card-${Date.now()}-1`,
       created_at: new Date(),
       updated_at: new Date(),
       title: 'Revisar código do módulo de pagamentos',
       content: 'Verificar implementação do gateway de pagamento e tratar erros de transação.',
       status: 'undone',
       user_id: 'user-1',
     },
     {
       id: `card-${Date.now()}-2`,
       created_at: new Date(),
       updated_at: new Date(),
       title: 'Otimizar performance do banco de dados',
       content: 'Criar índices para queries frequentes e revisar N+1 queries.',
       status: 'undone',
       user_id: 'user-1',
     },
     {
       id: `card-${Date.now()}-3`,
       created_at: new Date(),
       updated_at: new Date(),
       title: 'Implementar notificações push',
       content: 'Adicionar sistema de notificações em tempo real usando WebSockets.',
       status: 'undone',
       user_id: 'user-1',
     },
   ];
   return newCards;
 };