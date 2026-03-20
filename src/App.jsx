import React, { useState } from 'react'
import { Header } from './shared/layout/Header'
import { Dashboard } from './modules/Taekwondo/pages/Dashboard'
import { PlayersList } from './modules/Taekwondo/pages/PlayersList'
import { TeamsList } from './modules/Taekwondo/pages/TeamsList'
import { EventsList } from './modules/Taekwondo/pages/EventsList'
import { ImportHub } from './modules/Taekwondo/importers/ImportHub'
import { mockTeams, mockPlayers, mockEvents, mockParticipations } from './modules/Taekwondo/data/mockData'
import './index.css'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [showImport, setShowImport] = useState(false)

  const handleImport = (data) => {
    console.log('📥 Importando datos:', data)
    
    // Agregar nuevas academias
    if (data.teams && data.teams.length > 0) {
      console.log(`Agregando ${data.teams.length} academias`)
      mockTeams.push(...data.teams)
    }
    
    // Agregar nuevos deportistas
    if (data.players && data.players.length > 0) {
      console.log(`Agregando ${data.players.length} deportistas`)
      mockPlayers.push(...data.players)
    }
    
    // Agregar nuevo evento
    if (data.event) {
      console.log('Agregando evento:', data.event.name)
      mockEvents.push(data.event)
    }
    
    // Agregar participaciones
    if (data.participations && data.participations.length > 0) {
      console.log(`Agregando ${data.participations.length} participaciones`)
      mockParticipations.push(...data.participations)
    }
    
    // Mostrar log en consola
    console.log('Log de importación:', data.log)
    
    // Mostrar notificación
    setTimeout(() => {
      alert(`✅ Importación completada: 
• ${data.teams?.length || 0} academias
• ${data.players?.length || 0} deportistas
• ${data.event ? '1 evento' : '0 eventos'}
• ${data.participations?.length || 0} participaciones`)
    }, 500)
  }

  const renderView = () => {
    switch(currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'players':
        return <PlayersList />
      case 'teams':
        return <TeamsList />
      case 'events':
        return <EventsList />
      default:
        return <Dashboard />
    }
  }

  return (
    <div>
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onImportClick={() => setShowImport(true)}
        user={{ name: 'Admin' }}
      />
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {renderView()}
      </div>

      {showImport && (
        <ImportHub 
          onImport={handleImport}
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  )
}

export default App