import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('farmer' | 'buyer' | 'specialist' | 'admin')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      // Redirect to auth if not logged in
      if (!user) {
        navigate('/auth');
        return;
      }

      // Redirect to appropriate dashboard based on role
      if (userRole && allowedRoles && !allowedRoles.includes(userRole)) {
        navigate(getRoleDashboard(userRole));
      }
    }
  }, [user, userRole, loading, navigate, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">🌱</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const getRoleDashboard = (role: string): string => {
  switch (role) {
    case 'farmer':
      return '/dashboard-farmer';
    case 'buyer':
      return '/dashboard-buyer';
    case 'specialist':
      return '/dashboard-specialist';
    case 'admin':
      return '/dashboard-admin';
    default:
      return '/';
  }
};

export default ProtectedRoute;
