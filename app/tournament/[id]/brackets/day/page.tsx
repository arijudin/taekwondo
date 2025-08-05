"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  useGetTournamentDaysQuery,
  useCreateTournamentDayMutation,
  useUpdateTournamentDayMutation,
  useDeleteTournamentDayMutation,
} from "@/lib/api/tournamentApi"
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux"
import { setCurrentDay } from "@/lib/slices/daySlice"
import type { TournamentDay } from "@/lib/slices/daySlice"
import { Calendar, Plus, Edit, Trash2, Clock, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"
import { useParams } from "next/navigation"

interface DayFormData {
  day_number: number
  date: string
  name: string
  description: string
  start_time: string
  end_time: string
  is_active: boolean
}

const initialFormData: DayFormData = {
  day_number: 1,
  date: "",
  name: "",
  description: "",
  start_time: "08:00",
  end_time: "18:00",
  is_active: true,
}

export default function TournamentDayPage() {
  const params = useParams()
  const dispatch = useAppDispatch()
  const tournamentId = Number.parseInt(params.id as string)

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [formData, setFormData] = useState<DayFormData>(initialFormData)
  const [editingDay, setEditingDay] = useState<TournamentDay | null>(null)
  const [deletingDay, setDeletingDay] = useState<TournamentDay | null>(null)

  // RTK Query hooks
  const { data: days = [], isLoading, error, refetch } = useGetTournamentDaysQuery(tournamentId)

  const [createDay, { isLoading: isCreating }] = useCreateTournamentDayMutation()
  const [updateDay, { isLoading: isUpdating }] = useUpdateTournamentDayMutation()
  const [deleteDay, { isLoading: isDeleting }] = useDeleteTournamentDayMutation()

  // Redux state
  const { currentDay } = useAppSelector((state) => state.day)

  const handleInputChange = (field: keyof DayFormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setEditingDay(null)
  }

  const handleCreate = async () => {
    try {
      await createDay({
        tournamentId,
        data: formData,
      }).unwrap()

      setIsCreateDialogOpen(false)
      resetForm()
      refetch()
    } catch (error) {
      console.error("Failed to create day:", error)
    }
  }

  const handleEdit = (day: TournamentDay) => {
    setEditingDay(day)
    setFormData({
      day_number: day.day_number,
      date: day.date,
      name: day.name,
      description: day.description || "",
      start_time: day.start_time,
      end_time: day.end_time,
      is_active: day.is_active,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingDay) return

    try {
      await updateDay({
        tournamentId,
        dayId: editingDay.id,
        data: formData,
      }).unwrap()

      setIsEditDialogOpen(false)
      resetForm()
      refetch()
    } catch (error) {
      console.error("Failed to update day:", error)
    }
  }

  const handleDelete = async () => {
    if (!deletingDay) return

    try {
      await deleteDay({
        tournamentId,
        dayId: deletingDay.id,
      }).unwrap()

      setIsDeleteDialogOpen(false)
      setDeletingDay(null)
      refetch()
    } catch (error) {
      console.error("Failed to delete day:", error)
    }
  }

  const handleSetCurrentDay = (day: TournamentDay) => {
    dispatch(setCurrentDay(day))
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading tournament days...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load tournament days. Please try again.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tournament Days</h1>
          <p className="text-gray-600 mt-2">Manage tournament schedule and days</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Day
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Tournament Day</DialogTitle>
              <DialogDescription>Add a new day to the tournament schedule.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="day_number">Day Number</Label>
                  <Input
                    id="day_number"
                    type="number"
                    min="1"
                    value={formData.day_number}
                    onChange={(e) => handleInputChange("day_number", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Day Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Opening Day, Finals Day"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the day's events"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => handleInputChange("start_time", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => handleInputChange("end_time", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Day"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Day Display */}
      {currentDay && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Calendar className="h-5 w-5" />
              Current Day: {currentDay.name}
            </CardTitle>
            <CardDescription className="text-blue-600">
              Day {currentDay.day_number} • {new Date(currentDay.date).toLocaleDateString()} •{currentDay.start_time} -{" "}
              {currentDay.end_time}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Days Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tournament Days ({days.length})</CardTitle>
          <CardDescription>Manage the schedule and timing for each day of the tournament</CardDescription>
        </CardHeader>
        <CardContent>
          {days.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No days scheduled</h3>
              <p className="text-gray-500 mb-4">Create your first tournament day to get started</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Day
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {days.map((day) => (
                  <TableRow key={day.id}>
                    <TableCell className="font-medium">Day {day.day_number}</TableCell>
                    <TableCell>{new Date(day.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{day.name}</div>
                        {day.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">{day.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {day.start_time} - {day.end_time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={day.is_active ? "default" : "secondary"}>
                        {day.is_active ? (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {currentDay?.id === day.id ? (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Current
                        </Badge>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => handleSetCurrentDay(day)} className="text-xs">
                          Set Current
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(day)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeletingDay(day)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Tournament Day</DialogTitle>
            <DialogDescription>Update the tournament day information.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_day_number">Day Number</Label>
                <Input
                  id="edit_day_number"
                  type="number"
                  min="1"
                  value={formData.day_number}
                  onChange={(e) => handleInputChange("day_number", Number.parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_date">Date</Label>
                <Input
                  id="edit_date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_name">Day Name</Label>
              <Input
                id="edit_name"
                placeholder="e.g., Opening Day, Finals Day"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                placeholder="Brief description of the day's events"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_start_time">Start Time</Label>
                <Input
                  id="edit_start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => handleInputChange("start_time", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_end_time">End Time</Label>
                <Input
                  id="edit_end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => handleInputChange("end_time", e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit_is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange("is_active", checked)}
              />
              <Label htmlFor="edit_is_active">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Day"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tournament Day</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingDay?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Day"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
