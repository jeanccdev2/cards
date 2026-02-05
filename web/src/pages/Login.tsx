 import { useState } from 'react';
 import { useNavigate, Link } from 'react-router-dom';
 import { useAuthStore } from '@/stores/authStore';
 import { AuthLayout } from '@/components/layout/AuthLayout';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Loader2 } from 'lucide-react';
 import { toast } from 'sonner';
 
 const Login = () => {
   const navigate = useNavigate();
   const login = useAuthStore((state) => state.login);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [isLoading, setIsLoading] = useState(false);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true);
 
     try {
       const success = await login(email, password);
       if (success) {
         toast.success('Login realizado com sucesso!');
         navigate('/dashboard');
       } else {
         toast.error('Email ou senha inválidos');
       }
     } catch (error) {
       toast.error('Erro ao fazer login');
     } finally {
       setIsLoading(false);
     }
   };
 
   return (
     <AuthLayout
       title="Bem-vindo de volta"
       subtitle="Entre na sua conta para continuar"
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
 
         <div className="space-y-2">
           <div className="flex items-center justify-between">
             <Label htmlFor="password">Senha</Label>
             <Link
               to="/forgot-password"
               className="text-sm text-primary hover:underline"
             >
               Esqueceu a senha?
             </Link>
           </div>
           <Input
             id="password"
             type="password"
             placeholder="••••••••"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
             autoComplete="current-password"
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
               Entrando...
             </>
           ) : (
             'Entrar'
           )}
         </Button>
 
         <p className="text-center text-sm text-muted-foreground">
           Não tem uma conta?{' '}
           <Link to="/register" className="text-primary font-medium hover:underline">
             Criar conta
           </Link>
         </p>
       </form>
     </AuthLayout>
   );
 };
 
 export default Login;