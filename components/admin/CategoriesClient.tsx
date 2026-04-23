'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useShop } from '@/lib/context'
import { AppCategory } from '@/lib/types'
import { generateId } from '@/lib/store'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  getCategories,
  addCategory as addCategoryAction,
  updateCategory as updateCategoryAction,
  deleteCategory as deleteCategoryAction,
} from '@/lib/actions/categories'

const empty = (): AppCategory => ({
  id: '', name: '', logo: '', banner: '', sortOrder: 0,
})

export default function CategoriesClient() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useShop()
  const [editing, setEditing] = useState<AppCategory | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [localCategories, setLocalCategories] = useState<AppCategory[]>(categories)
  const [isDragging, setIsDragging] = useState(false)

  // Only sync local categories when not dragging and not after a drag operation
  useEffect(() => {
    if (!isDragging && localCategories.length === 0) {
      setLocalCategories(categories)
    }
  }, [categories, isDragging, localCategories.length])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setIsDragging(false)

    if (over && active.id !== over.id) {
      const oldIndex = localCategories.findIndex((c) => c.id === active.id)
      const newIndex = localCategories.findIndex((c) => c.id === over.id)
      const newCategories = arrayMove(localCategories, oldIndex, newIndex)

      // Update local state immediately for smooth UI
      setLocalCategories(newCategories)

      // Update sort orders
      const updatedCategories = newCategories.map((c, index) => ({
        ...c,
        sortOrder: index,
      }))

      // Update all categories in parallel and wait for all to complete
      await Promise.all(updatedCategories.map((cat) => updateCategory(cat)))
    }
  }

  function handleDragStart() {
    setIsDragging(true)
  }

  function handleAdd() {
    const maxSortOrder = categories.length > 0 ? Math.max(...categories.map(c => c.sortOrder)) : 0
    setEditing({ ...empty(), id: generateId(), sortOrder: maxSortOrder + 1 })
    setIsNew(true)
  }
  function handleEdit(c: AppCategory) { setEditing({ ...c }); setIsNew(false) }
  function handleClose() { setEditing(null); setIsNew(false) }

  async function handleSave() {
    if (!editing || !editing.name.trim()) return
    if (isNew) await addCategory(editing)
    else await updateCategory(editing)
    handleClose()
  }

  function set<K extends keyof AppCategory>(k: K, v: AppCategory[K]) {
    setEditing((prev) => prev ? { ...prev, [k]: v } : prev)
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">หมวดหมู่แอป</h1>
          <p className="text-sm text-gray-400 mt-1">{localCategories.length} แอป</p>
        </div>
        <button onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer active:scale-95">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          เพิ่มแอป
        </button>
      </div>

      {editing && (
        <div className="mb-6 bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">
            {isNew ? 'เพิ่มแอปใหม่' : 'แก้ไขแอป'}
          </p>
          <div className="space-y-4">
            <Field label="ชื่อแอป *">
              <input type="text" value={editing.name} onChange={(e) => set('name', e.target.value)}
                className={inputCls} placeholder="เช่น Netflix, Viu" />
            </Field>
            <Field label="URL โลโก้แอป">
              <input type="url" value={editing.logo} onChange={(e) => set('logo', e.target.value)}
                className={inputCls} placeholder="https://..." />
            </Field>
            {editing.logo && (
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                <img src={editing.logo} alt="logo preview" className="w-full h-full object-contain" />
              </div>
            )}
            <Field label="URL แบนเนอร์ของแอป">
              <input type="url" value={editing.banner} onChange={(e) => set('banner', e.target.value)}
                className={inputCls} placeholder="https://... (แสดงด้านบนหน้าแอป)" />
            </Field>
            {editing.banner && (
              <div className="rounded-xl overflow-hidden border border-gray-200" style={{ maxWidth: '400px' }}>
                <img src={editing.banner} alt="banner preview" className="w-full h-auto object-cover" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 mt-6">
            <button onClick={handleSave}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer active:scale-95">
              บันทึก
            </button>
            <button onClick={handleClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200">
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      {localCategories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 text-sm mb-3">ยังไม่มีแอป</p>
          <button onClick={handleAdd} className="text-sm font-medium text-gray-900 hover:underline cursor-pointer">
            เพิ่มแอปแรก
          </button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider w-10" />
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">แอป</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">แบนเนอร์</th>
                  <th className="text-center px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">สินค้า</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <SortableContext items={localCategories.map(c => c.id)} strategy={verticalListSortingStrategy}>
                <tbody className="divide-y divide-gray-50">
                  {localCategories.map((c) => {
                    const count = products.filter((p) => p.category === c.id).length
                    return (
                      <SortableRow
                        key={c.id}
                        category={c}
                        count={count}
                        onEdit={() => handleEdit(c)}
                        onDelete={() => deleteCategory(c.id)}
                      />
                    )
                  })}
                </tbody>
              </SortableContext>
            </table>
          </div>
        </DndContext>
      )}
    </div>
  )
}

const inputCls = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all bg-white"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function SortableRow({ category, count, onEdit, onDelete }: {
  category: AppCategory
  count: number
  onEdit: () => void
  onDelete: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`hover:bg-gray-50/50 transition-colors group ${isDragging ? 'opacity-50' : ''}`}
    >
      <td className="px-5 py-4">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6h8M4 10h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {category.logo ? (
              <img src={category.logo} alt={category.name} className="w-full h-full object-contain" />
            ) : (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-gray-300">
                <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
                <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
                <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
                <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
              </svg>
            )}
          </div>
          <p className="font-medium text-gray-800">{category.name}</p>
        </div>
      </td>
      <td className="px-5 py-4">
        {category.banner ? (
          <div className="w-20 h-8 rounded-lg overflow-hidden bg-gray-100">
            <img src={category.banner} alt="banner" className="w-full h-full object-cover" />
          </div>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        )}
      </td>
      <td className="px-5 py-4 text-center">
        <span className="text-sm font-semibold text-gray-700">{count}</span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit}
            className="text-xs font-medium text-gray-600 hover:text-gray-900 cursor-pointer transition-colors">
            แก้ไข
          </button>
          <button onClick={onDelete}
            className="text-xs font-medium text-red-400 hover:text-red-600 cursor-pointer transition-colors">
            ลบ
          </button>
        </div>
      </td>
    </tr>
  )
}
