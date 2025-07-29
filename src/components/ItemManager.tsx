import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useStore } from '@/stores'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import type { Item } from '@/lib/types'

interface EditingItem {
  id: string
  name: string
  price: string
}

export function ItemManager() {
  const { items, addItem, updateItem, deleteItem } = useStore()
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null)
  const [newItem, setNewItem] = useState({ name: '', price: '' })
  const [isAddingNew, setIsAddingNew] = useState(false)

  const handleAddItem = () => {
    if (!newItem.name.trim() || !newItem.price) return

    const price = parseFloat(newItem.price)
    if (isNaN(price) || price <= 0) return

    addItem({
      name: newItem.name.trim(),
      current_price: price,
    })

    setNewItem({ name: '', price: '' })
    setIsAddingNew(false)
  }

  const startEditing = (item: Item) => {
    setEditingItem({
      id: item.id,
      name: item.name,
      price: item.current_price.toString(),
    })
  }

  const cancelEditing = () => {
    setEditingItem(null)
  }

  const saveEditing = () => {
    if (!editingItem || !editingItem.name.trim() || !editingItem.price) return

    const price = parseFloat(editingItem.price)
    if (isNaN(price) || price <= 0) return

    updateItem(editingItem.id, {
      name: editingItem.name.trim(),
      current_price: price,
    })

    setEditingItem(null)
  }

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItem(itemId)
    }
  }

  return (
    <div className="space-y-4">
      {/* Items List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Manage Items</CardTitle>
            {!isAddingNew && (
              <Button
                onClick={() => setIsAddingNew(true)}
                size="sm"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Add New Item Form - at top of list */}
          {isAddingNew && (
            <div className="p-3 border rounded-lg bg-muted/50">
              <div className="space-y-3">
                <Input
                  placeholder="Item name (e.g., Samosa)"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  autoFocus
                />
                <Input
                  type="number"
                  placeholder="Price (e.g., 15)"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  min="0"
                  step="0.01"
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddItem} size="sm" className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsAddingNew(false)
                      setNewItem({ name: '', price: '' })
                    }}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Existing Items */}
          {items.map((item) => {
            const isEditing = editingItem?.id === item.id

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                {isEditing ? (
                  <div className="flex-1 space-y-2">
                    <Input
                      value={editingItem.name}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, name: e.target.value })
                      }
                      placeholder="Item name"
                    />
                    <Input
                      type="number"
                      value={editingItem.price}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, price: e.target.value })
                      }
                      placeholder="Price"
                      min="0"
                      step="0.01"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveEditing}>
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEditing}>
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        ₨{item.current_price}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditing(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardHeader>
          <CardTitle>App Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Items:</span>
            <span>{items.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version:</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Storage:</span>
            <span>Local + Supabase</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}