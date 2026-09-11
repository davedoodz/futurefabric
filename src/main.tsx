import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'dialkit/styles.css'
import './index.css'
import App from './App.tsx'
import { hydrateSharedLayout } from './lib/layoutPersistence'

async function bootstrap() {
  await hydrateSharedLayout()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
