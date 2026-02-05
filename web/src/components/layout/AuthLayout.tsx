 import React from 'react';
 
 interface AuthLayoutProps {
   children: React.ReactNode;
   title: string;
   subtitle?: string;
 }
 
 export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
   return (
     <div className="min-h-screen flex">
       {/* Left side - Branding */}
       <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12">
         <div className="max-w-md text-center">
           <div className="w-20 h-20 rounded-2xl bg-primary-foreground/10 backdrop-blur flex items-center justify-center mx-auto mb-8">
             <svg
               className="w-10 h-10 text-primary-foreground"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
             >
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 strokeWidth={2}
                 d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
               />
             </svg>
           </div>
           <h1 className="text-4xl font-bold text-primary-foreground mb-4">
             VoiceCards
           </h1>
           <p className="text-primary-foreground/80 text-lg">
             Crie cards de forma inteligente usando sua voz e inteligência artificial.
           </p>
         </div>
       </div>
 
       {/* Right side - Form */}
       <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
         <div className="w-full max-w-md">
           <div className="lg:hidden mb-8 text-center">
             <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
               VoiceCards
             </h1>
           </div>
           
           <div className="mb-8">
             <h2 className="text-2xl font-bold text-foreground">{title}</h2>
             {subtitle && (
               <p className="text-muted-foreground mt-2">{subtitle}</p>
             )}
           </div>
 
           {children}
         </div>
       </div>
     </div>
   );
 };