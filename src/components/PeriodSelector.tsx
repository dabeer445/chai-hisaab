import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useStore } from '@/stores'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import type { PeriodType } from '@/lib/types'

const PERIODS: { value: PeriodType; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

export function PeriodSelector() {
  const { selectedPeriod, selectedDate, setSelectedPeriod, setSelectedDate } = useStore()

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate)
    
    switch (selectedPeriod) {
      case 'day':
        currentDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1))
        break
      case 'week':
        currentDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7))
        break
      case 'month':
        currentDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1))
        break
    }
    
    setSelectedDate(currentDate)
  }

  const formatSelectedDate = () => {
    const date = new Date(selectedDate)
    
    switch (selectedPeriod) {
      case 'day':
        return date.toLocaleDateString('en-PK', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      case 'week': {
        const startOfWeek = new Date(date)
        startOfWeek.setDate(date.getDate() - date.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        
        return `${startOfWeek.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}`
      }
      case 'month':
        return date.toLocaleDateString('en-PK', {
          month: 'long',
          year: 'numeric'
        })
      default:
        return ''
    }
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  const isToday = () => {
    const today = new Date()
    const selected = new Date(selectedDate)
    
    switch (selectedPeriod) {
      case 'day':
        return today.toDateString() === selected.toDateString()
      case 'week': {
        const startOfWeek = new Date(selected)
        startOfWeek.setDate(selected.getDate() - selected.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        return today >= startOfWeek && today <= endOfWeek
      }
      case 'month':
        return today.getMonth() === selected.getMonth() && today.getFullYear() === selected.getFullYear()
      default:
        return false
    }
  }

  return (
    <div className="space-y-4">
      {/* Period Type Selector */}
      <Card>
        <CardContent className="p-3">
          <div className="flex rounded-lg bg-muted p-1">
            {PERIODS.map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? 'default' : 'ghost'}
                size="sm"
                className="flex-1"
                onClick={() => setSelectedPeriod(period.value)}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Date Navigation */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDate('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{formatSelectedDate()}</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDate('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          {!isToday() && (
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="w-full"
              >
                Go to Today
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}