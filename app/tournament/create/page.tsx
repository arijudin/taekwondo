"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createTournament } from "@/app/actions/tournament"
import { AlertCircle, CheckCircle } from "lucide-react"
import { useActionState } from "react"

export default function CreateTournamentPage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createTournament, undefined)
  const [status, setStatus] = useState("planning")

  if (state?.success) {
    router.push(`/tournament/${state.tournamentId}`)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Tournament</h1>
        <p className="text-gray-600 mt-2">Set up a new Taekwondo tournament</p>
      </div>

      {state?.error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state?.success && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Tournament created successfully! Redirecting...</AlertDescription>
        </Alert>
      )}

      <form action={formAction}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the tournament details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tournament Name *</Label>
              <Input id="name" name="name" placeholder="Enter tournament name" required disabled={isPending} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide a description of the tournament"
                disabled={isPending}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input id="start_date" name="start_date" type="date" required disabled={isPending} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date *</Label>
                <Input id="end_date" name="end_date" type="date" required disabled={isPending} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" name="location" placeholder="Tournament venue" required disabled={isPending} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" disabled={isPending} value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="registration">Registration</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="status" value={status} />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tournament Officials</CardTitle>
            <CardDescription>Enter information about tournament officials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organizer">Organizer</Label>
              <Input id="organizer" name="organizer" placeholder="Organizing body" disabled={isPending} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chairman">Chairman</Label>
              <Input id="chairman" name="chairman" placeholder="Tournament chairman" disabled={isPending} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referee_chief">Chief Referee</Label>
              <Input id="referee_chief" name="referee_chief" placeholder="Chief referee name" disabled={isPending} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="treasurer">Treasurer</Label>
              <Input id="treasurer" name="treasurer" placeholder="Tournament treasurer" disabled={isPending} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin_tournament">Tournament Admin</Label>
              <Input
                id="admin_tournament"
                name="admin_tournament"
                placeholder="Tournament administrator"
                disabled={isPending}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Financial Settings</CardTitle>
            <CardDescription>Set registration fees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="registration_fee">Registration Fee (IDR)</Label>
              <Input id="registration_fee" name="registration_fee" type="number" placeholder="0" disabled={isPending} />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? "Creating..." : "Create Tournament"}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.back()} disabled={isPending}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
