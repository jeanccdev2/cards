 import { useNavigate } from 'react-router-dom';
 import { useCardsStore } from '@/stores/cardsStore';
 import { DashboardLayout } from '@/components/layout/DashboardLayout';
 import { CardForm } from '@/components/cards/CardForm';
 import { CardStatus } from '@/types';
 import { toast } from 'sonner';
 
 const CreateCard = () => {
   const navigate = useNavigate();
   const addCard = useCardsStore((state) => state.addCard);
 
   const handleSubmit = (data: { title: string; content: string; status: CardStatus }) => {
     addCard(data);
     toast.success('Card criado com sucesso!');
     navigate('/dashboard');
   };
 
   return (
     <DashboardLayout>
       <div className="max-w-2xl mx-auto">
         <CardForm onSubmit={handleSubmit} />
       </div>
     </DashboardLayout>
   );
 };
 
 export default CreateCard;