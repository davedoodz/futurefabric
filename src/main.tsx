import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'dialkit/styles.css'
import './index.css'
import App from './App.tsx'
import {
  hasManagedLayoutState,
  hydrateSharedLayout,
  saveSharedLayout,
  setSharedLayoutSavingEnabled,
} from './lib/layoutPersistence'

const LOCAL_DEVELOPMENT_HOSTS = new Set(['127.0.0.1', 'localhost'])

async function bootstrap() {
  const localIsLayoutSource = import.meta.env.DEV && LOCAL_DEVELOPMENT_HOSTS.has(window.location.hostname)
  const shouldPublishLocalLayout = localIsLayoutSource && hasManagedLayoutState()
  if (localIsLayoutSource) setSharedLayoutSavingEnabled(shouldPublishLocalLayout)
  if (!localIsLayoutSource) await hydrateSharedLayout()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )

  if (shouldPublishLocalLayout) window.setTimeout(() => void saveSharedLayout(), 0)
}

void bootstrap()
