 import { Card, User } from '@/types';
 
 export const mockUser: User = {
   id: 'user-1',
   createdAt: new Date('2024-01-01'),
   updatedAt: new Date('2024-01-01'),
   name: 'João Silva',
   email: 'joao@exemplo.com',
 };
 
 export const mockCards: Card[] = [
   {
     id: 'card-1',
     createdAt: new Date('2024-01-15'),
     updatedAt: new Date('2024-01-15'),
     title: 'Implementar autenticação',
     content: 'Criar sistema de login com JWT e refresh tokens. Incluir validação de email.',
     status: 'done',
     userId: 'user-1',
   },
   {
     id: 'card-2',
     createdAt: new Date('2024-01-16'),
     updatedAt: new Date('2024-01-16'),
     title: 'Design do Dashboard',
     content: 'Criar layout responsivo para o dashboard principal com cards de métricas.',
     status: 'doing',
     userId: 'user-1',
   },
   {
     id: 'card-3',
     createdAt: new Date('2024-01-17'),
     updatedAt: new Date('2024-01-17'),
     title: 'Integração com API',
     content: 'Conectar frontend com backend usando React Query para cache e mutations.',
     status: 'pending',
     userId: 'user-1',
   },
   {
     id: 'card-4',
     createdAt: new Date('2024-01-18'),
     updatedAt: new Date('2024-01-18'),
     title: 'Testes unitários',
     content: 'Escrever testes para componentes principais usando Vitest e Testing Library.',
     status: 'pending',
     userId: 'user-1',
   },
   {
     id: 'card-5',
     createdAt: new Date('2024-01-19'),
     updatedAt: new Date('2024-01-19'),
     title: 'Documentação',
     content: 'Documentar APIs e fluxos principais do sistema.',
     status: 'doing',
     userId: 'user-1',
   },
 ];
 
 export const generateMockCardsFromVoice = (): Card[] => {
   const newCards: Card[] = [
     {
       id: `card-${Date.now()}-1`,
       createdAt: new Date(),
       updatedAt: new Date(),
       title: 'Revisar código do módulo de pagamentos',
       content: 'Verificar implementação do gateway de pagamento e tratar erros de transação.',
       status: 'pending',
       userId: 'user-1',
     },
     {
       id: `card-${Date.now()}-2`,
       createdAt: new Date(),
       updatedAt: new Date(),
       title: 'Otimizar performance do banco de dados',
       content: 'Criar índices para queries frequentes e revisar N+1 queries.',
       status: 'pending',
       userId: 'user-1',
     },
     {
       id: `card-${Date.now()}-3`,
       createdAt: new Date(),
       updatedAt: new Date(),
       title: 'Implementar notificações push',
       content: 'Adicionar sistema de notificações em tempo real usando WebSockets.',
       status: 'pending',
       userId: 'user-1',
     },
   ];
   return newCards;
 };