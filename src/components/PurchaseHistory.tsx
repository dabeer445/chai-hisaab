import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStore } from '@/stores'
import { Trash2, Calendar, Package } from 'lucide-react'
import type { Purchase } from '@/lib/types'

interface GroupedPurchases {
  [date: string]: Purchase[]
}

export function PurchaseHistory() {
  const { purchases, deletePurchase, selectedPeriod, selectedDate } = useStore()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Ensure selectedDate is always a Date object
  const currentDate = selectedDate instanceof Date ? selectedDate : new Date(selectedDate)

  // Get purchases for the selected period
  const getDateRange = () => {
    const date = new Date(currentDate)
    let from: Date, to: Date

    switch (selectedPeriod) {
      case 'day':
        from = new Date(date)
        to = new Date(date)
        break
      case 'week':
        from = new Date(date)
        from.setDate(date.getDate() - date.getDay()) // Start of week
        to = new Date(from)
        to.setDate(from.getDate() + 6) // End of week
        break
      case 'month':
        from = new Date(date.getFullYear(), date.getMonth(), 1)
        to = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        break
      default:
        from = new Date(date)
        to = new Date(date)
    }

    return { from, to }
  }

  const { from, to } = getDateRange()
  const filteredPurchases = purchases.filter((purchase) => {
    const purchaseDate = new Date(purchase.date)
    return purchaseDate >= from && purchaseDate <= to
  })

  // Group purchases by date
  const groupedPurchases = filteredPurchases.reduce<GroupedPurchases>((acc, purchase) => {
    const date = purchase.date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(purchase)
    return acc
  }, {})

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedPurchases).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-PK', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    }
  }

  const handleDelete = async (purchaseId: string) => {
    setDeletingId(purchaseId)
    try {
      deletePurchase(purchaseId)
    } catch (error) {
      console.error('Failed to delete purchase:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const getTotalForDate = (purchases: Purchase[]) => {
    return purchases.reduce((total, purchase) => total + purchase.total, 0)
  }

  const grandTotal = filteredPurchases.reduce((total, purchase) => total + purchase.total, 0)

  if (filteredPurchases.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No purchases found</h3>
          <p className="text-muted-foreground">
            No expenses recorded for the selected {selectedPeriod}.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {selectedPeriod === 'day' && formatDate(currentDate.toISOString().split('T')[0])}
            {selectedPeriod === 'week' && 'This Week'}
            {selectedPeriod === 'month' && currentDate.toLocaleDateString('en-PK', { month: 'long', year: 'numeric' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">₨{grandTotal}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {filteredPurchases.length} purchase{filteredPurchases.length !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-muted-foreground">
                {sortedDates.length} day{sortedDates.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase History by Date */}
      {sortedDates.map(date => {
        const dayPurchases = groupedPurchases[date]
        const dayTotal = getTotalForDate(dayPurchases)

        return (
          <Card key={date}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{formatDate(date)}</CardTitle>
                <span className="font-semibold">₨{dayTotal}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {dayPurchases.map(purchase => (
                <div
                  key={purchase.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{purchase.item_name}</h4>
                      <span className="text-sm text-muted-foreground">
                        × {purchase.quantity}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ₨{purchase.unit_price} each
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">₨{purchase.total}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(purchase.id)}
                      disabled={deletingId === purchase.id}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}