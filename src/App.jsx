import React, { useState } from 'react'
import { EventProvider, useEvents } from './store/EventContext'
import { MemoryProvider } from './store/MemoryContext'
import { AuthHub } from './screens/AuthHub'
import { Login } from './screens/Login'
import { Onboarding } from './screens/Onboarding'
import { ProfileSwitcher } from './screens/ProfileSwitcher'
import { Today } from './screens/Today'
import { Settings } from './screens/Settings'
import { History } from './screens/History'
import { Memories } from './screens/Memories'

function MainRouter() {
  const { profile, isLoading } = useEvents();

  // Choose initial screen based on profile state
  const initialScreen = (profile?.name && profile?.onboadingComplete) ? 'profiles' : 'auth-hub';
  const [currentScreen, setCurrentScreen] = useState(initialScreen);

  // Sync initial screen if profile loads later
  React.useEffect(() => {
    if (!isLoading && profile?.name && profile?.onboadingComplete && currentScreen === 'auth-hub') {
      setCurrentScreen('profiles');
    }
  }, [isLoading, profile, currentScreen]);

  if (isLoading) {
    return <div className="app-container justify-center items-center">Loading...</div>;
  }

  // Routing switch
  if (currentScreen === 'auth-hub') return <AuthHub onNavigate={setCurrentScreen} />;
  if (currentScreen === 'login') return <Login onNavigate={setCurrentScreen} />;
  if (currentScreen === 'onboarding') return <Onboarding onNavigate={setCurrentScreen} />;
  if (currentScreen === 'profiles') return <ProfileSwitcher onNavigate={setCurrentScreen} />;

  if (currentScreen === 'settings') return <Settings onBack={() => setCurrentScreen('today')} />;
  if (currentScreen === 'history') return <History onBack={() => setCurrentScreen('today')} />;
  if (currentScreen === 'memories') return <Memories onBack={() => setCurrentScreen('today')} />;

  return <Today onNavigate={setCurrentScreen} />;
}

function App() {
  return (
    <EventProvider>
      <MemoryProvider>
        <MainRouter />
      </MemoryProvider>
    </EventProvider>
  )
}

export default App
