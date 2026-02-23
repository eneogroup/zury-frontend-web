import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
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

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
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
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </Provider>
  )
}

export default App
