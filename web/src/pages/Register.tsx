 import { useState } from 'react';
 import { useNavigate, Link } from 'react-router-dom';
 import { useAuthStore } from '@/stores/authStore';
 import { AuthLayout } from '@/components/layout/AuthLayout';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Loader2 } from 'lucide-react';
 import { toast } from 'sonner';
 
 const Register = () => {
   const navigate = useNavigate();
   const register = useAuthStore((state) => state.register);
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [isLoading, setIsLoading] = useState(false);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
 
     if (password !== confirmPassword) {
       toast.error('As senhas não coincidem');
       return;
     }
 
     if (password.length < 6) {
       toast.error('A senha deve ter pelo menos 6 caracteres');
       return;
     }
 
     setIsLoading(true);
 
     try {
       const success = await register(name, email, password);
       if (success) {
         toast.success('Conta criada com sucesso!');
         navigate('/dashboard');
       } else {
         toast.error('Erro ao criar conta');
       }
     } catch (error) {
       toast.error('Erro ao criar conta');
     } finally {
       setIsLoading(false);
     }
   };
 
   return (
     <AuthLayout
       title="Criar conta"
       subtitle="Comece a usar o VoiceCards hoje"
     >
       <form onSubmit={handleSubmit} className="space-y-4">
         <div className="space-y-2">
           <Label htmlFor="name">Nome</Label>
           <Input
             id="name"
             type="text"
             placeholder="Seu nome"
             value={name}
             onChange={(e) => setName(e.target.value)}
             required
             autoComplete="name"
           />
         </div>
 
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
 
         <div className="space-y-2">
           <Label htmlFor="password">Senha</Label>
           <Input
             id="password"
             type="password"
             placeholder="••••••••"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
             autoComplete="new-password"
           />
         </div>
 
         <div className="space-y-2">
           <Label htmlFor="confirmPassword">Confirmar senha</Label>
           <Input
             id="confirmPassword"
             type="password"
             placeholder="••••••••"
             value={confirmPassword}
             onChange={(e) => setConfirmPassword(e.target.value)}
             required
             autoComplete="new-password"
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
               Criando conta...
             </>
           ) : (
             'Criar conta'
           )}
         </Button>
 
         <p className="text-center text-sm text-muted-foreground">
           Já tem uma conta?{' '}
           <Link to="/login" className="text-primary font-medium hover:underline">
             Entrar
           </Link>
         </p>
       </form>
     </AuthLayout>
   );
 };
 
 export default Register;