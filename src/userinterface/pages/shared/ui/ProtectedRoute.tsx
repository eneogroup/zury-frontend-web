import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../../store/store'
import { KeycloakService } from '../../../../service/auth/KeycloakService'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth)

  if (!isInitialized) {
    // Show a loading screen while Keycloak is checking SSO
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Automatically trigger Keycloak login and redirect them back to where they were trying to go
    KeycloakService.login({ redirectUri: window.location.href })
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <p className="text-gray-500">Redirection vers la connexion...</p>
      </div>
    )
  }

  return <>{children}</>
}
