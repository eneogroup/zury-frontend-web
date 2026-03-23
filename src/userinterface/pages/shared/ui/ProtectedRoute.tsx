import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../../store/store'
import { KeycloakService } from '../../../../service/auth/KeycloakService'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // Avoid triggering login if we just came back from Keycloak or if we are already authenticated
    const hasCode = window.location.href.includes('code=') || window.location.href.includes('state=')
    
    if (isInitialized && !isAuthenticated && !hasCode) {
      // Use origin + pathname to avoid redirect loops with fragments
      const redirectUri = window.location.origin + window.location.pathname
      KeycloakService.login({ redirectUri })
    }
  }, [isInitialized, isAuthenticated])

  if (!isInitialized || !isAuthenticated) {
    // Show a loading screen while Keycloak is checking SSO or redirecting
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 flex-col gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-gray-500 font-medium tracking-wide animate-pulse">
          {!isInitialized ? 'Vérification de session...' : 'Redirection vers Connexion...'}
        </p>
      </div>
    )
  }

  return <>{children}</>
}
