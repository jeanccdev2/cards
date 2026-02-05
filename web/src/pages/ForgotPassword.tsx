 import { useState } from 'react';
 import { Link } from 'react-router-dom';
 import { useAuthStore } from '@/stores/authStore';
 import { AuthLayout } from '@/components/layout/AuthLayout';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
 import { toast } from 'sonner';
 
 const ForgotPassword = () => {
   const forgotPassword = useAuthStore((state) => state.forgotPassword);
   const [email, setEmail] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [isSuccess, setIsSuccess] = useState(false);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true);
 
     try {
       const success = await forgotPassword(email);
       if (success) {
         setIsSuccess(true);
         toast.success('Email enviado com sucesso!');
       } else {
         toast.error('Erro ao enviar email');
       }
     } catch (error) {
       toast.error('Erro ao enviar email');
     } finally {
       setIsLoading(false);
     }
   };
 
   if (isSuccess) {
     return (
       <AuthLayout
         title="Email enviado!"
         subtitle="Verifique sua caixa de entrada"
       >
         <div className="text-center space-y-6">
           <div className="w-16 h-16 rounded-full bg-status-done/10 flex items-center justify-center mx-auto">
             <CheckCircle className="h-8 w-8 text-status-done" />
           </div>
           <p className="text-muted-foreground">
             Enviamos um link para <strong>{email}</strong> com instruções para
             redefinir sua senha.
           </p>
           <Link to="/login">
             <Button variant="outline" className="w-full">
               <ArrowLeft className="mr-2 h-4 w-4" />
               Voltar para o login
             </Button>
           </Link>
         </div>
       </AuthLayout>
     );
   }
 
   return (
     <AuthLayout
       title="Esqueceu a senha?"
       subtitle="Digite seu email para receber um link de recuperação"
     >
       <form onSubmit={handleSubmit} className="space-y-4">
         <div className="space-y-2">
           <Label htmlFor="email">Email</Label>
           <Input
             id="email"
             type="email"
             placeholder="seu@email.com"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
             autoComplete="email"
           />
         </div>
 
         <Button
           type="submit"
           className="w-full gradient-primary"
           disabled={isLoading}
         >
           {isLoading ? (
             <>
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               Enviando...
             </>
           ) : (
             'Enviar link'
           )}
         </Button>
 
         <Link to="/login" className="block">
           <Button variant="ghost" className="w-full">
             <ArrowLeft className="mr-2 h-4 w-4" />
             Voltar para o login
           </Button>
         </Link>
       </form>
     </AuthLayout>
   );
 };
 
 export default ForgotPassword;