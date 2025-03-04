
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Trophy, Medal, BadgeCheck, RotateCcw, Edit2, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UserProfileProps {
  user: any;
  points: number;
  totalSpins: number;
  favoriteColor?: string;
  onUpdateProfile?: () => void;
}

interface ProfileData {
  id: string;
  created_at: string;
  updated_at: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  total_spins?: number;
  favorite_prize?: string;
  [key: string]: any; // Allow for any additional properties
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  points, 
  totalSpins, 
  favoriteColor,
  onUpdateProfile 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileDetails, setProfileDetails] = useState<ProfileData | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Cargar datos del perfil
  useEffect(() => {
    const fetchProfileDetails = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        // Set profileDetails with type safety
        const profileData = data as ProfileData;
        setProfileDetails(profileData);
        
        // Set displayName from profile data with fallbacks
        setDisplayName(
          profileData.display_name || 
          profileData.username || 
          user.email
        );
      } catch (error: any) {
        console.error('Error al cargar el perfil:', error.message);
      }
    };
    
    fetchProfileDetails();
  }, [user]);

  // Manejar actualización del perfil
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Create an update object with only valid fields
      const updateData: any = {};
      
      // Only add display_name if profiles table has this column
      if (displayName) {
        updateData.display_name = displayName;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado correctamente"
      });
      
      setIsEditing(false);
      if (onUpdateProfile) onUpdateProfile();
    } catch (error: any) {
      toast({
        title: "Error al actualizar el perfil",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Si no hay usuario, mostrar mensaje para iniciar sesión
  if (!user) {
    return (
      <Card className="glass-panel">
        <CardHeader className="text-center">
          <CardTitle>Perfil de Usuario</CardTitle>
          <CardDescription>
            Inicia sesión para ver tu perfil
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarFallback className="bg-primary/20">
              <User className="h-12 w-12 text-primary/60" />
            </AvatarFallback>
          </Avatar>
          <Button onClick={() => navigate('/auth')}>
            Iniciar Sesión
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil de Usuario
          </CardTitle>
          {!isEditing ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="h-8 gap-1"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:text-xs">Editar</span>
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(false)}
              className="h-8 text-xs"
            >
              Cancelar
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback 
              className="text-xl font-semibold"
              style={{ backgroundColor: favoriteColor || 'var(--primary)' }}
            >
              {displayName?.substring(0, 2).toUpperCase() || user.email?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center sm:text-left">
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="displayName">Nombre a mostrar</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="¿Cómo quieres que te llamemos?"
                />
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold">{displayName || user.email}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <Trophy className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">Puntos Acumulados</p>
            <p className="text-xl font-bold">{points || 0}</p>
          </div>
          
          <div className="bg-accent/10 rounded-lg p-3 text-center">
            <RotateCcw className="h-5 w-5 mx-auto mb-1 text-accent" />
            <p className="text-xs text-muted-foreground">Total de Giros</p>
            <p className="text-xl font-bold">{totalSpins || 0}</p>
          </div>
        </div>
        
        {profileDetails?.total_spins > 0 && (
          <div className="bg-secondary/10 rounded-lg p-3">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
              <BadgeCheck className="h-4 w-4" />
              Logros
            </h4>
            <div className="flex flex-wrap gap-2">
              {profileDetails.total_spins >= 1 && (
                <Badge variant="outline" className="bg-primary/5">Primer Giro</Badge>
              )}
              {profileDetails.total_spins >= 10 && (
                <Badge variant="outline" className="bg-primary/5">10 Giros</Badge>
              )}
              {profileDetails.total_spins >= 50 && (
                <Badge variant="outline" className="bg-primary/5">50 Giros</Badge>
              )}
              {points >= 1000 && (
                <Badge variant="outline" className="bg-primary/5">1000 Puntos</Badge>
              )}
              {points >= 5000 && (
                <Badge variant="outline" className="bg-primary/5">5000 Puntos</Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      {isEditing && (
        <CardFooter>
          <Button 
            onClick={handleUpdateProfile} 
            disabled={loading} 
            className="w-full flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            Guardar Cambios
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default UserProfile;
