
import React, { useState } from 'react';
import { Prize, saveCustomPrizes } from '@/utils/prizes';
import { Settings, Save, RotateCcw, Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

interface PrizeCustomizerProps {
  prizes: Prize[];
  onUpdate: (prizes: Prize[]) => void;
}

const PrizeCustomizer: React.FC<PrizeCustomizerProps> = ({ prizes, onUpdate }) => {
  const [editedPrizes, setEditedPrizes] = useState<Prize[]>([...prizes]);
  const { toast } = useToast();
  
  const handleSave = () => {
    // Validation: ensure all prizes have names
    const hasEmptyNames = editedPrizes.some(prize => !prize.name.trim());
    if (hasEmptyNames) {
      toast({
        title: "Error",
        description: "Todos los premios deben tener un nombre",
        variant: "destructive"
      });
      return;
    }
    
    onUpdate(editedPrizes);
    saveCustomPrizes(editedPrizes);
    toast({
      title: "Guardado",
      description: "Los premios han sido actualizados correctamente",
    });
  };
  
  const handleReset = () => {
    setEditedPrizes([...prizes]);
  };
  
  const updatePrizeName = (index: number, name: string) => {
    const newPrizes = [...editedPrizes];
    newPrizes[index] = { ...newPrizes[index], name };
    setEditedPrizes(newPrizes);
  };
  
  const updatePrizeValue = (index: number, valueStr: string) => {
    const value = parseInt(valueStr) || 0;
    const newPrizes = [...editedPrizes];
    newPrizes[index] = { ...newPrizes[index], value };
    setEditedPrizes(newPrizes);
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 control-button bg-white/20 backdrop-blur-sm hover:bg-white/30"
        >
          <Settings className="h-4 w-4" />
          <span>Personalizar Premios</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Edit2 className="h-5 w-5" />
            Personalizar Premios
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <ScrollArea className="h-[60vh] md:h-[400px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
              {editedPrizes.map((prize, index) => (
                <Card key={prize.id} className="overflow-hidden">
                  <div 
                    className="h-2" 
                    style={{ 
                      backgroundColor: prize.color.startsWith('roulette-') 
                        ? `var(--${prize.color.replace('roulette-', '')})` 
                        : prize.color 
                    }}
                  ></div>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base font-medium">Premio {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Nombre</label>
                      <Input 
                        value={prize.name} 
                        onChange={(e) => updatePrizeName(index, e.target.value)}
                        className="border border-input"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Valor</label>
                      <Input 
                        type="number" 
                        value={prize.value.toString()} 
                        onChange={(e) => updatePrizeValue(index, e.target.value)}
                        className="border border-input"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restablecer
          </Button>
          <DialogClose asChild>
            <Button className="w-full sm:w-auto" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrizeCustomizer;
