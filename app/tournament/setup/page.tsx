import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { requireAuth } from "@/lib/auth"
import { Users, Trophy, DollarSign, Settings } from "lucide-react"
import { Suspense } from "react"

async function TournamentSetupContent() {
  const session = await requireAuth()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tournament Setup</h1>
        <p className="text-gray-600 mt-2">Configure tournament details and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Tournament basic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tournament-name">Tournament Name</Label>
              <Input id="tournament-name" placeholder="Enter tournament name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Tournament description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input id="end-date" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Tournament venue" />
            </div>
          </CardContent>
        </Card>

        {/* Officials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Tournament Officials
            </CardTitle>
            <CardDescription>Key personnel information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organizer">Organizer</Label>
              <Input id="organizer" placeholder="Organizing body" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chairman">Chairman</Label>
              <Input id="chairman" placeholder="Tournament chairman" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="referee-chief">Chief Referee</Label>
              <Input id="referee-chief" placeholder="Chief referee name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="treasurer">Treasurer</Label>
              <Input id="treasurer" placeholder="Tournament treasurer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin">Tournament Admin</Label>
              <Input id="admin" placeholder="Tournament administrator" />
            </div>
          </CardContent>
        </Card>

        {/* Financial Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Settings
            </CardTitle>
            <CardDescription>Registration fees and costs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="registration-fee">Registration Fee (IDR)</Label>
              <Input id="registration-fee" type="number" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="late-fee">Late Registration Fee (IDR)</Label>
              <Input id="late-fee" type="number" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-fee">Team Registration Fee (IDR)</Label>
              <Input id="team-fee" type="number" placeholder="0" />
            </div>
          </CardContent>
        </Card>

        {/* Tournament Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Tournament Settings
            </CardTitle>
            <CardDescription>Competition configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="max-participants">Max Participants per Class</Label>
              <Input id="max-participants" type="number" placeholder="32" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courts">Number of Courts</Label>
              <Input id="courts" type="number" placeholder="4" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="match-duration">Match Duration (minutes)</Label>
              <Input id="match-duration" type="number" placeholder="3" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="break-duration">Break Between Matches (minutes)</Label>
              <Input id="break-duration" type="number" placeholder="5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <Button>Save Tournament Setup</Button>
        <Button variant="outline">Save as Draft</Button>
        <Button variant="outline">Preview</Button>
      </div>
    </div>
  )
}

export default function TournamentSetupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <TournamentSetupContent />
    </Suspense>
  )
}
