 import { useState, useEffect } from 'react';
 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
 } from '@/components/ui/dialog';
 import { Button } from '@/components/ui/button';
 import { Card } from '@/types';
 import { generateMockCardsFromVoice } from '@/lib/mockData';
 import { Mic, Square, Check, X, Loader2 } from 'lucide-react';
 import { cn } from '@/lib/utils';
 import { StatusBadge } from '@/components/ui/StatusBadge';
 
 interface RecordingModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onCardsGenerated: (cards: Card[]) => void;
 }
 
 type RecordingState = 'idle' | 'recording' | 'processing' | 'results';
 
 export const RecordingModal = ({ open, onOpenChange, onCardsGenerated }: RecordingModalProps) => {
   const [state, setState] = useState<RecordingState>('idle');
   const [recordingTime, setRecordingTime] = useState(0);
   const [generatedCards, setGeneratedCards] = useState<Card[]>([]);
   const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
 
   useEffect(() => {
     let interval: NodeJS.Timeout;
     if (state === 'recording') {
       interval = setInterval(() => {
         setRecordingTime(prev => prev + 1);
       }, 1000);
     }
     return () => clearInterval(interval);
   }, [state]);
 
   useEffect(() => {
     if (!open) {
       setState('idle');
       setRecordingTime(0);
       setGeneratedCards([]);
       setSelectedCards(new Set());
     }
   }, [open]);
 
   const formatTime = (seconds: number) => {
     const mins = Math.floor(seconds / 60);
     const secs = seconds % 60;
     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
   };
 
   const handleStartRecording = () => {
     setState('recording');
     setRecordingTime(0);
   };
 
   const handleStopRecording = async () => {
     setState('processing');
     
     // Simula processamento da LLM
     await new Promise(resolve => setTimeout(resolve, 2000));
     
     const cards = generateMockCardsFromVoice();
     setGeneratedCards(cards);
     setSelectedCards(new Set(cards.map(c => c.id)));
     setState('results');
   };
 
   const toggleCardSelection = (cardId: string) => {
     setSelectedCards(prev => {
       const next = new Set(prev);
       if (next.has(cardId)) {
         next.delete(cardId);
       } else {
         next.add(cardId);
       }
       return next;
     });
   };
 
   const handleConfirm = () => {
     const cardsToAdd = generatedCards.filter(c => selectedCards.has(c.id));
     onCardsGenerated(cardsToAdd);
     onOpenChange(false);
   };
 
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-center">
              {state === 'idle' && 'Gravação de Voz'}
              {state === 'recording' && 'Gravando...'}
              {state === 'processing' && 'Processando com IA...'}
              {state === 'results' && 'Cards Gerados'}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden py-4">
            {(state === 'idle' || state === 'recording') && (
              <div className="flex flex-col items-center gap-6">
                <button
                  onClick={state === 'idle' ? handleStartRecording : handleStopRecording}
                  className={cn(
                    'w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all duration-300',
                    state === 'idle'
                      ? 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl hover:scale-105'
                      : 'bg-recording recording-pulse'
                  )}
                >
                  {state === 'idle' ? (
                    <Mic className="h-10 w-10 sm:h-12 sm:w-12 text-primary-foreground" />
                  ) : (
                    <Square className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground" />
                  )}
                </button>
                
                {state === 'recording' && (
                  <div className="text-center animate-fade-in">
                    <p className="text-2xl sm:text-3xl font-mono font-bold text-foreground">
                      {formatTime(recordingTime)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Clique para parar a gravação
                    </p>
                  </div>
                )}
                
                {state === 'idle' && (
                  <p className="text-sm text-muted-foreground text-center px-4">
                    Clique para começar a gravar sua voz.<br />
                    A IA irá gerar cards automaticamente.
                  </p>
                )}
              </div>
            )}

            {state === 'processing' && (
              <div className="flex flex-col items-center gap-4 py-8 animate-fade-in">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full gradient-primary opacity-20 animate-ping absolute" />
                  <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center relative">
                    <Loader2 className="h-8 w-8 text-primary-foreground animate-spin" />
                  </div>
                </div>
                <p className="text-muted-foreground">Analisando sua gravação...</p>
              </div>
            )}

            {state === 'results' && (
              <div className="flex flex-col h-full animate-fade-in">
                <p className="text-sm text-muted-foreground text-center mb-3 flex-shrink-0">
                  Selecione os cards que deseja criar:
                </p>
                
                <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1">
                  {generatedCards.map((card, index) => (
                    <div
                      key={card.id}
                      className={cn(
                        'p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all animate-slide-up',
                        selectedCards.has(card.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground/50'
                      )}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => toggleCardSelection(card.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
                          selectedCards.has(card.id)
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground/50'
                        )}>
                          {selectedCards.has(card.id) && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className="font-medium text-sm truncate max-w-[150px] sm:max-w-none">{card.title}</h4>
                            <StatusBadge status={card.status} />
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {card.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {state === 'results' && (
            <div className="flex gap-2 sm:gap-3 pt-3 border-t flex-shrink-0">
              <Button
                variant="outline"
                className="flex-1 h-10 sm:h-11 text-sm"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Cancelar</span>
                <span className="xs:hidden">Não</span>
              </Button>
              <Button
                className="flex-1 h-10 sm:h-11 gradient-primary text-sm"
                onClick={handleConfirm}
                disabled={selectedCards.size === 0}
              >
                <Check className="h-4 w-4 mr-1 sm:mr-2" />
                Criar {selectedCards.size} Card{selectedCards.size !== 1 ? 's' : ''}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  };