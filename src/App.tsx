import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { store } from './store/store'
import Header from './userinterface/layout/Header'
import Footer from './userinterface/layout/Footer'
import { HomePage } from './userinterface/pages/home/HomePage'
import { ExplorerPage } from './userinterface/pages/explorer/ExplorerPage'
import { EstablishmentDetailPage } from './userinterface/pages/establishments/EstablishmentDetailPage'
import { EventsPage } from './userinterface/pages/events/EventsPage'
import { EventDetailPage } from './userinterface/pages/events/EventDetailPage'
import { CartePage } from './userinterface/pages/carte/CartePage'
import { EneoAcademyPage } from './userinterface/pages/eneo-academy/EneoAcademyPage'
import { JoinZuryPage } from './userinterface/pages/rejoindre-zury/JoinZuryPage'
import { FavoritesPage } from './userinterface/pages/favoris/FavoritesPage'
import ScrollToTop from './service/utils/ScrollToTop'
import { KeycloakService } from './service/auth/KeycloakService'

function App() {
  useEffect(() => {
    KeycloakService.init()
  }, [])

  return (
    <HelmetProvider>
      <Provider store={store}>
        <BrowserRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explorer" element={<ExplorerPage />} />
                <Route path="/establishments/:id" element={<EstablishmentDetailPage />} />
                <Route path="/evenements" element={<EventsPage />} />
                <Route path="/evenements/:id" element={<EventDetailPage />} />
                <Route path="/carte" element={<CartePage />} />
                <Route path="/eneo-academy" element={<EneoAcademyPage />} />
                <Route path="/rejoindre-zury" element={<JoinZuryPage />} />
                <Route path="/favoris" element={<FavoritesPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  )
}

export default App
