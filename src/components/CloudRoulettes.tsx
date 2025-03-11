
import React, { useState, useEffect } from 'react';
import { Cloud, Save, Plus, Trash2, Check, X, Download } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter,
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { saveCustomRoulette, getUserRoulettes, deleteCustomRoulette } from '@/integrations/supabase/client';
import { Prize } from '@/utils/prizes';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface CloudRoulettesProps {
  user: any | null;
  currentPrizes: Prize[];
  onLoadRoulette: (prizes: Prize[]) => void;
}

const CloudRoulettes: React.FC<CloudRoulettesProps> = ({ 
  user, 
  currentPrizes, 
  onLoadRoulette
}) => {
  const [savedRoulettes, setSavedRoulettes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingName, setSavingName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const { toast } = useToast();

  // Load saved roulettes
  useEffect(() => {
    const loadRoulettes = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const roulettes = await getUserRoulettes(user.id);
        setSavedRoulettes(roulettes);
      } catch (error: any) {
        console.error('Error loading roulettes:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las ruletas guardadas",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadRoulettes();
  }, [user, toast]);

  const handleSaveRoulette = async () => {
    if (!user) return;
    if (!savingName.trim()) {
      toast({
        title: "Error",
        description: "Debes proporcionar un nombre para la ruleta",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      await saveCustomRoulette(user.id, savingName, currentPrizes);
      
      // Refresh the list
      const roulettes = await getUserRoulettes(user.id);
      setSavedRoulettes(roulettes);
      
      toast({
        title: "Guardado",
        description: `Ruleta "${savingName}" guardada en la nube`,
      });
      
      setShowSaveDialog(false);
      setSavingName('');
    } catch (error: any) {
      console.error('Error saving roulette:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la ruleta",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadRoulette = (roulette: any) => {
    try {
      const prizes = JSON.parse(roulette.prizes);
      onLoadRoulette(prizes);
      
      toast({
        title: "Cargada",
        description: `Ruleta "${roulette.name}" cargada correctamente`,
      });
    } catch (error) {
      console.error('Error parsing roulette:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la ruleta",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRoulette = async (rouletteId: string, name: string) => {
    if (!user) return;
    
    try {
      await deleteCustomRoulette(user.id, rouletteId);
      
      // Update the list
      setSavedRoulettes(prev => prev.filter(r => r.id !== rouletteId));
      
      toast({
        title: "Eliminada",
        description: `Ruleta "${name}" eliminada correctamente`,
      });
    } catch (error) {
      console.error('Error deleting roulette:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la ruleta",
        variant: "destructive"
      });
    }
  };

  // If no user, show sign in message
  if (!user) {
    return (
      <Card className="glass-panel h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Ruletas en la Nube
          </CardTitle>
          <CardDescription>
            Inicia sesión para guardar y sincronizar tus ruletas
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[200px]">
          <Cloud className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
          <p className="text-muted-foreground text-center">
            Accede para guardar y recuperar tus ruletas personalizadas desde cualquier dispositivo
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Ruletas en la Nube
        </CardTitle>
        <CardDescription>
          Guarda y sincroniza tus configuraciones
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Guardar Ruleta Actual</DialogTitle>
              <DialogDescription>
                Guarda tu configuración actual de premios en la nube
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  placeholder="Nombre de la ruleta"
                  value={savingName}
                  onChange={(e) => setSavingName(e.target.value)}
                />
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm font-medium mb-2">Premios a guardar:</p>
                <div className="flex flex-wrap gap-2">
                  {currentPrizes.slice(0, 3).map((prize) => (
                    <Badge key={prize.id} variant="outline">
                      {prize.name}
                    </Badge>
                  ))}
                  {currentPrizes.length > 3 && (
                    <Badge variant="outline">
                      +{currentPrizes.length - 3} más
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex space-x-2 sm:justify-end">
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button type="submit" onClick={handleSaveRoulette} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <div className="space-y-3">
          <Button 
            onClick={() => setShowSaveDialog(true)} 
            className="w-full flex items-center gap-2"
            disabled={loading}
          >
            <Save className="h-4 w-4" />
            Guardar Ruleta Actual
          </Button>
          
          <div className="pt-2">
            <p className="text-sm font-medium mb-2">Mis Ruletas Guardadas:</p>
            
            <ScrollArea className="h-[200px]">
              {loading ? (
                <div className="flex justify-center items-center h-[150px]">
                  <p className="text-muted-foreground">Cargando ruletas...</p>
                </div>
              ) : savedRoulettes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[150px] text-muted-foreground">
                  <Cloud className="h-8 w-8 mb-2 opacity-50" />
                  <p>No tienes ruletas guardadas</p>
                  <p className="text-xs mt-1">Personaliza y guarda tu primera ruleta</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedRoulettes.map((roulette) => (
                    <div 
                      key={roulette.id}
                      className="bg-background/80 border border-border/50 rounded-md p-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{roulette.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(roulette.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteRoulette(roulette.id, roulette.name)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full flex items-center gap-1"
                        onClick={() => handleLoadRoulette(roulette)}
                      >
                        <Download className="h-3 w-3" />
                        <span>Cargar</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CloudRoulettes;
