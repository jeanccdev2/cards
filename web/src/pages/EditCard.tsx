 import { useNavigate, useParams } from 'react-router-dom';
 import { useCardsStore } from '@/stores/cardsStore';
 import { DashboardLayout } from '@/components/layout/DashboardLayout';
 import { CardForm } from '@/components/cards/CardForm';
 import { CardStatus } from '@/types';
 import { toast } from 'sonner';
 import { useEffect } from 'react';
 
 const EditCard = () => {
   const navigate = useNavigate();
   const { id } = useParams<{ id: string }>();
   const { getCardById, updateCard } = useCardsStore();
 
   const card = id ? getCardById(id) : undefined;
 
   useEffect(() => {
     if (!card && id) {
       toast.error('Card não encontrado');
       navigate('/dashboard');
     }
   }, [card, id, navigate]);
 
   if (!card) {
     return null;
   }
 
   const handleSubmit = (data: { title: string; content: string; status: CardStatus }) => {
     updateCard(card.id, data);
     toast.success('Card atualizado com sucesso!');
     navigate('/dashboard');
   };
 
   return (
     <DashboardLayout>
       <div className="max-w-2xl mx-auto">
         <CardForm
           initialData={card}
           onSubmit={handleSubmit}
           isEditing
         />
       </div>
     </DashboardLayout>
   );
 };
 
 export default EditCard;