import Keycloak from 'keycloak-js'
import { store } from '../../store/store'
import { setAuth, logoutLocally, setInitialized } from '../../store/authSlice'

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
}

const keycloak = new Keycloak(keycloakConfig)
let isKeycloakInitialized = false

export const KeycloakService = {
  init: async () => {
    if (isKeycloakInitialized) return keycloak.authenticated
    try {
      const authenticated = await keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        pkceMethod: 'S256',
        checkLoginIframe: false,
      })
      
      if (authenticated) {
        KeycloakService.updateReduxState()
      }
      
      isKeycloakInitialized = true
      
      // Handle automatic token refresh
      keycloak.onTokenExpired = () => {
        keycloak.updateToken(30).then((refreshed) => {
          if (refreshed) {
            KeycloakService.updateReduxState()
          }
        }).catch(() => {
          KeycloakService.logout()
        })
      }

      store.dispatch(setInitialized(true))
      return authenticated
    } catch (error) {
      console.error('Keycloak initialization failed', error)
      store.dispatch(setInitialized(true))
      return false
    }
  },

  updateReduxState: () => {
    store.dispatch(setAuth({
      token: keycloak.token || null,
      user: keycloak.tokenParsed ? {
        id: keycloak.tokenParsed.sub,
        username: keycloak.tokenParsed.preferred_username,
        email: keycloak.tokenParsed.email,
        firstName: keycloak.tokenParsed.given_name,
        lastName: keycloak.tokenParsed.family_name,
        roles: keycloak.tokenParsed.realm_access?.roles || [],
      } : null
    }))
  },

  login: (options = {}) => keycloak.login(options),
  
  logout: () => {
    store.dispatch(logoutLocally())
    keycloak.logout({ redirectUri: window.location.origin })
  },
  
  register: () => keycloak.register({ redirectUri: window.location.origin }),

  getToken: () => keycloak.token,
  
  isLoggedIn: () => !!keycloak.token,
}
