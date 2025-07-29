import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { QuickAddGrid } from '@/components/QuickAddGrid'
import { PurchaseHistory } from '@/components/PurchaseHistory'
import { PeriodSelector } from '@/components/PeriodSelector'
import { ItemManager } from '@/components/ItemManager'
import { useStore } from '@/stores'
import { Coffee, History, Moon, Sun, Settings } from 'lucide-react'

type Tab = 'add' | 'history' | 'settings'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('add')
  const { darkMode, toggleDarkMode } = useStore()

  const tabs = [
    { id: 'add' as Tab, label: 'Add', icon: Coffee },
    { id: 'history' as Tab, label: 'History', icon: History },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Chai Hissab</h1>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-md mx-auto px-4 py-6">
        {activeTab === 'add' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Quick Add</h2>
              <p className="text-muted-foreground">
                Tap items to add them to your daily expenses
              </p>
            </div>
            <QuickAddGrid />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Purchase History</h2>
              <p className="text-muted-foreground">
                View and manage your expense history
              </p>
            </div>
            <PeriodSelector />
            <PurchaseHistory />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Settings</h2>
              <p className="text-muted-foreground">
                Manage your app preferences and items
              </p>
            </div>
            <ItemManager />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className="flex-1 h-16 rounded-none"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{tab.label}</span>
                  </div>
                </Button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Bottom padding to account for fixed navigation */}
      <div className="h-16" />
    </div>
  )
}

export default App