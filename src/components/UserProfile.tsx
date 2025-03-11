
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Award, Check, X, Cloud, RefreshCw } from 'lucide-react';
import { getUserProfile, updateUserProfile } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

interface UserProfileProps {
  user: any | null;
  points: number;
  totalSpins: number;
  syncSettings?: () => Promise<void>;
  syncStats?: () => Promise<void>;
  favoriteColor?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  points, 
  totalSpins,
  syncSettings,
  syncStats,
  favoriteColor 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedColor, setSelectedColor] = useState(favoriteColor || '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await updateUserProfile(user.id, {
        username: username,
        display_name: displayName,
        favorite_color: selectedColor
      });
      
      toast({
        title: "Perfil actualizado",
        description: "Tus datos han sido guardados correctamente."
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error al actualizar perfil",
        description: error.message || "Ha ocurrido un error inesperado",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncAll = async () => {
    if (!user) return;
    
    setIsSyncing(true);
    try {
      // Sync settings if function is provided
      if (syncSettings) {
        await syncSettings();
      }
      
      // Sync stats if function is provided
      if (syncStats) {
        await syncStats();
      }
      
      toast({
        title: "Sincronización completada",
        description: "Tus datos han sido sincronizados con la nube."
      });
    } catch (error: any) {
      toast({
        title: "Error de sincronización",
        description: error.message || "No se pudieron sincronizar todos los datos",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Cargar datos del perfil desde Supabase
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        const profile = await getUserProfile(user.id);
        
        if (profile) {
          setUsername(profile.username || '');
          setDisplayName(profile.display_name || '');
          setSelectedColor(profile.favorite_color || '');
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };
    
    loadProfile();
  }, [user]);
  
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Perfil de Usuario</CardTitle>
          <CardDescription>Inicia sesión para ver y editar tu perfil</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <User className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
          <p className="text-muted-foreground text-center">
            Accede a tu cuenta para gestionar tu perfil y ver tus estadísticas
          </p>
        </CardContent>
      </Card>
    );
  }

  const colorOptions = [
    { name: 'Rojo', value: '#ef4444' },
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Verde', value: '#22c55e' },
    { name: 'Púrpura', value: '#a855f7' },
    { name: 'Ámbar', value: '#f59e0b' },
    { name: 'Rosa', value: '#ec4899' },
    { name: 'Esmeralda', value: '#10b981' },
    { name: 'Cian', value: '#06b6d4' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Tu Perfil</span>
          {!isEditing ? (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSyncAll}
                disabled={isSyncing}
                className="flex items-center gap-1"
              >
                <Cloud className="h-4 w-4" />
                {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)}
              >
                Editar
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="bg-green-500/10 hover:bg-green-500/20"
              >
                <Check className="h-4 w-4 mr-1" />
                Guardar
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
                className="bg-red-500/10 hover:bg-red-500/20"
              >
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.user_metadata?.avatar_url || ''} />
            <AvatarFallback style={{ backgroundColor: selectedColor || favoriteColor || 'var(--primary)' }}>
              {displayName?.charAt(0) || username?.charAt(0) || user.email?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-medium">
              {displayName || username || 'Usuario'}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
              <Mail className="h-3 w-3" /> {user.email}
            </p>
          </div>
        </div>
        
        {isEditing ? (
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tu nombre de usuario"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="displayName">Nombre a mostrar</Label>
              <Input 
                id="displayName" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Tu nombre visible"
              />
            </div>
            
            <div className="space-y-1">
              <Label>Color favorito</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`w-8 h-8 rounded-full focus:ring-2 focus:ring-offset-2 ${
                      selectedColor === color.value ? 'ring-2 ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setSelectedColor(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-primary/10 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold">{points}</div>
              <div className="text-xs text-muted-foreground mt-1">Puntos Totales</div>
            </div>
            
            <div className="bg-secondary/10 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold">{totalSpins}</div>
              <div className="text-xs text-muted-foreground mt-1">Giros Realizados</div>
            </div>
            
            <div className="col-span-2 bg-accent/10 p-4 rounded-lg flex items-center justify-center gap-2">
              <Award className="h-5 w-5 text-accent-foreground" />
              <span>Nivel: {Math.floor(points / 1000) + 1}</span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <div className="flex items-center text-xs text-muted-foreground gap-1">
          <Cloud className="h-3 w-3" />
          <span>Datos sincronizados con la nube</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserProfile;
