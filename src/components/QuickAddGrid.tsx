import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useStore } from '@/stores'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import type { Item } from '@/lib/types'

interface QuantityState {
  [itemId: string]: number
}

export function QuickAddGrid() {
  const { items, addPurchase, getItemById } = useStore()
  const [quantities, setQuantities] = useState<QuantityState>({})
  const [isAdding, setIsAdding] = useState(false)

  const updateQuantity = (itemId: string, delta: number) => {
    setQuantities(prev => {
      const newQuantity = Math.max(0, (prev[itemId] || 0) + delta)
      if (newQuantity === 0) {
        const { [itemId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [itemId]: newQuantity }
    })
  }

  const setQuantity = (itemId: string, value: string) => {
    const quantity = parseInt(value) || 0
    if (quantity === 0) {
      const { [itemId]: _, ...rest } = quantities
      setQuantities(rest)
    } else {
      setQuantities(prev => ({ ...prev, [itemId]: quantity }))
    }
  }

  const handleAddPurchases = async () => {
    if (Object.keys(quantities).length === 0) return

    setIsAdding(true)
    const today = new Date().toISOString().split('T')[0]

    try {
      for (const [itemId, quantity] of Object.entries(quantities)) {
        const item = getItemById(itemId)
        if (!item) continue

        const total = item.current_price * quantity
        addPurchase({
          item_id: itemId,
          item_name: item.name,
          quantity,
          unit_price: item.current_price,
          total,
          date: today,
        })
      }

      // Clear quantities after successful add
      setQuantities({})
    } catch (error) {
      console.error('Failed to add purchases:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const getTotalCost = () => {
    return Object.entries(quantities).reduce((total, [itemId, quantity]) => {
      const item = getItemById(itemId)
      if (!item) return total
      return total + (item.current_price * quantity)
    }, 0)
  }

  const hasItems = Object.keys(quantities).length > 0
  const totalCost = getTotalCost()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {items.map((item: Item) => {
          const quantity = quantities[item.id] || 0
          return (
            <Card key={item.id} className="relative">
              <CardContent className="p-3">
                <div className="text-center space-y-2">
                  <div>
                    <h3 className="font-semibold text-base">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ₨{item.current_price}
                    </p>
                  </div>
                  
                  {quantity === 0 ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(item.id, e.target.value)}
                          className="w-16 text-center"
                          min="0"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Total: ₨{item.current_price * quantity}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {hasItems && (
        <Card className="border-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold">Total Cost</p>
                <p className="text-2xl font-bold text-primary">₨{totalCost}</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                {Object.keys(quantities).length} item(s)
              </div>
            </div>
            <Button
              onClick={handleAddPurchases}
              disabled={isAdding}
              className="w-full"
              size="lg"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isAdding ? 'Adding...' : 'Add to Expenses'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}