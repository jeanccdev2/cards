 import { Mic } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 
 interface FloatingRecordButtonProps {
   onClick: () => void;
 }
 
export const FloatingRecordButton = ({ onClick }: FloatingRecordButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="float-button w-14 h-14 sm:w-16 sm:h-16 rounded-full gradient-accent shadow-lg hover:shadow-xl transition-shadow duration-500 ease-out"
      size="icon"
    >
      <Mic className="h-6 w-6 sm:h-7 sm:w-7" />
    </Button>
  );
};