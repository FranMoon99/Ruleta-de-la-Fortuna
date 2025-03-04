
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Award, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface UserProfileProps {
  user: any | null;
  points: number;
  totalSpins: number;
  favoriteColor?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  points, 
  totalSpins,
  favoriteColor 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.user_metadata?.username || '');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update the profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ 
          username: username,
          // We use any type here since we know these fields exist in our database
          // but might not be reflected in TypeScript types yet
          ...(displayName ? { display_name: displayName } as any : {})
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
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

  // Cargar datos del perfil desde Supabase
  React.useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, display_name')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setUsername(data.username || '');
          // Type assertion to access new fields
          setDisplayName((data as any).display_name || '');
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Tu Perfil</span>
          {!isEditing ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
            >
              Editar
            </Button>
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
            <AvatarFallback style={{ backgroundColor: favoriteColor || 'var(--primary)' }}>
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
    </Card>
  );
};

export default UserProfile;
