
import React, { useState } from 'react';
import { Prize } from '@/utils/prizes';
import { Dices, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter, 
  CardDescription
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface CustomRouletteModeProps {
  prizes: Prize[];
  customMode: boolean;
  onUpdate: (prizes: Prize[]) => void;
  onToggleMode: () => void;
}

const CustomRouletteMode: React.FC<CustomRouletteModeProps> = ({ prizes, customMode, onUpdate, onToggleMode }) => {
  const [selectedPrizes, setSelectedPrizes] = useState<string[]>(() => 
    prizes.map(prize => prize.id)
  );
  
  const handleTogglePrize = (id: string) => {
    setSelectedPrizes(prev => {
      if (prev.includes(id)) {
        return prev.filter(prizeId => prizeId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const handleApply = () => {
    // Ensure at least 2 prizes are selected
    if (selectedPrizes.length < 2) {
      return;
    }
    
    // Filter prizes based on selection
    const filteredPrizes = prizes.filter(prize => 
      selectedPrizes.includes(prize.id)
    );
    
    onUpdate(filteredPrizes);
    onToggleMode();
  };
  
  const handleSelectAll = () => {
    setSelectedPrizes(prizes.map(prize => prize.id));
  };
  
  const handleSelectNone = () => {
    setSelectedPrizes([]);
  };
  
  return (
    <Card className="glass-panel">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Dices className="h-5 w-5" />
          Modo Personalizado
        </CardTitle>
        <CardDescription>
          Selecciona qué premios quieres incluir en la ruleta
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="text-xs"
          >
            Seleccionar todos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectNone}
            className="text-xs"
          >
            Deseleccionar todos
          </Button>
        </div>
        
        <ScrollArea className="h-[180px] pr-2">
          <div className="space-y-2">
            {prizes.map((prize) => (
              <div
                key={prize.id}
                className="flex items-center space-x-2 bg-white/40 backdrop-blur-sm border border-white/30 rounded-md p-2"
              >
                <Checkbox
                  id={`prize-${prize.id}`}
                  checked={selectedPrizes.includes(prize.id)}
                  onCheckedChange={() => handleTogglePrize(prize.id)}
                />
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ 
                    backgroundColor: prize.color.startsWith('roulette-') 
                      ? `var(--${prize.color.replace('roulette-', '')})` 
                      : prize.color 
                  }}
                ></div>
                <label
                  htmlFor={`prize-${prize.id}`}
                  className="flex-1 text-sm font-medium leading-none cursor-pointer"
                >
                  {prize.name}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="mt-3 flex justify-between items-center">
          <div className="text-sm">
            <span className="font-medium">Seleccionados: </span>
            <Badge variant="outline">{selectedPrizes.length} de {prizes.length}</Badge>
          </div>
          {selectedPrizes.length < 2 && (
            <p className="text-xs text-destructive">Selecciona al menos 2 premios</p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button 
          variant={customMode ? "default" : "outline"}
          size="sm"
          className="flex-1 gap-1"
          onClick={onToggleMode}
        >
          {customMode ? (
            <>
              <X className="h-4 w-4" />
              <span>Cancelar</span>
            </>
          ) : (
            <>
              <Dices className="h-4 w-4" />
              <span>Personalizar</span>
            </>
          )}
        </Button>
        
        {customMode && (
          <Button 
            variant="default"
            size="sm"
            className="flex-1 gap-1"
            onClick={handleApply}
            disabled={selectedPrizes.length < 2}
          >
            <Check className="h-4 w-4" />
            <span>Aplicar</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CustomRouletteMode;
