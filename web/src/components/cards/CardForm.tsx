 import { useState, useEffect } from 'react';
 import { Card, CardStatus } from '@/types';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Textarea } from '@/components/ui/textarea';
 import { Label } from '@/components/ui/label';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import { ArrowLeft, Save } from 'lucide-react';
 import { useNavigate } from 'react-router-dom';
 
 interface CardFormProps {
   initialData?: Card;
   onSubmit: (data: { title: string; content: string; status: CardStatus }) => void;
   isEditing?: boolean;
 }
 
 export const CardForm = ({ initialData, onSubmit, isEditing = false }: CardFormProps) => {
   const navigate = useNavigate();
   const [title, setTitle] = useState(initialData?.title || '');
   const [content, setContent] = useState(initialData?.content || '');
   const [status, setStatus] = useState<CardStatus>(initialData?.status || 'pending');
   const [isSubmitting, setIsSubmitting] = useState(false);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!title.trim() || !content.trim()) return;
 
     setIsSubmitting(true);
     await new Promise(resolve => setTimeout(resolve, 300));
     onSubmit({ title, content, status });
     setIsSubmitting(false);
   };
 
   return (
     <form onSubmit={handleSubmit} className="space-y-6">
       <div className="flex items-center gap-4 mb-8">
         <Button
           type="button"
           variant="ghost"
           size="icon"
           onClick={() => navigate('/dashboard')}
         >
           <ArrowLeft className="h-5 w-5" />
         </Button>
         <h1 className="text-2xl font-bold">
           {isEditing ? 'Editar Card' : 'Novo Card'}
         </h1>
       </div>
 
       <div className="space-y-4">
         <div className="space-y-2">
           <Label htmlFor="title">Título</Label>
           <Input
             id="title"
             placeholder="Digite o título do card"
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             required
           />
         </div>
 
         <div className="space-y-2">
           <Label htmlFor="content">Conteúdo</Label>
           <Textarea
             id="content"
             placeholder="Descreva o conteúdo do card"
             value={content}
             onChange={(e) => setContent(e.target.value)}
             rows={6}
             required
           />
         </div>
 
         <div className="space-y-2">
           <Label htmlFor="status">Status</Label>
           <Select value={status} onValueChange={(value: CardStatus) => setStatus(value)}>
             <SelectTrigger>
               <SelectValue placeholder="Selecione o status" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="pending">Pendente</SelectItem>
               <SelectItem value="doing">Fazendo</SelectItem>
               <SelectItem value="done">Feito</SelectItem>
             </SelectContent>
           </Select>
         </div>
       </div>
 
       <div className="flex gap-3 pt-4">
         <Button
           type="button"
           variant="outline"
           className="flex-1"
           onClick={() => navigate('/dashboard')}
         >
           Cancelar
         </Button>
         <Button
           type="submit"
           className="flex-1 gradient-primary"
           disabled={isSubmitting || !title.trim() || !content.trim()}
         >
           <Save className="h-4 w-4 mr-2" />
           {isSubmitting ? 'Salvando...' : 'Salvar'}
         </Button>
       </div>
     </form>
   );
 };