import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { requireAuth } from "@/lib/auth"
import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import { Users, Trophy, DollarSign, Settings, Save } from "lucide-react"
import { Suspense } from "react"

async function TournamentSetupContent({ params }: { params: { id: string } }) {
  const session = await requireAuth()
  const tournamentId = Number.parseInt(params.id)

  if (isNaN(tournamentId)) {
    notFound()
  }

  // Get tournament details
  const tournamentResult = await sql`
    SELECT 
      id, name, description, start_date, end_date, location, status,
      organizer, chairman, referee_chief, treasurer, admin_tournament, registration_fee
    FROM tournaments 
    WHERE id = ${tournamentId}
  `

  if (tournamentResult.length === 0) {
    notFound()
  }

  const tournament = tournamentResult[0]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kelengkapan Kejuaraan</h1>
        <p className="text-gray-600 mt-2">Configure tournament details and settings</p>
      </div>

      <form action={`/api/tournaments/${tournamentId}/update`} method="POST">
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
                <Input
                  id="tournament-name"
                  name="name"
                  placeholder="Enter tournament name"
                  defaultValue={tournament.name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tournament description"
                  defaultValue={tournament.description || ""}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    name="start_date"
                    type="date"
                    defaultValue={new Date(tournament.start_date).toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    name="end_date"
                    type="date"
                    defaultValue={new Date(tournament.end_date).toISOString().split("T")[0]}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Tournament venue"
                  defaultValue={tournament.location}
                />
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
                <Input
                  id="organizer"
                  name="organizer"
                  placeholder="Organizing body"
                  defaultValue={tournament.organizer || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chairman">Chairman</Label>
                <Input
                  id="chairman"
                  name="chairman"
                  placeholder="Tournament chairman"
                  defaultValue={tournament.chairman || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referee-chief">Chief Referee</Label>
                <Input
                  id="referee-chief"
                  name="referee_chief"
                  placeholder="Chief referee name"
                  defaultValue={tournament.referee_chief || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="treasurer">Treasurer</Label>
                <Input
                  id="treasurer"
                  name="treasurer"
                  placeholder="Tournament treasurer"
                  defaultValue={tournament.treasurer || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin">Tournament Admin</Label>
                <Input
                  id="admin"
                  name="admin_tournament"
                  placeholder="Tournament administrator"
                  defaultValue={tournament.admin_tournament || ""}
                />
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
                <Input
                  id="registration-fee"
                  name="registration_fee"
                  type="number"
                  placeholder="0"
                  defaultValue={tournament.registration_fee || ""}
                />
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
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button type="button" variant="outline">
            Preview
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function TournamentSetupPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <TournamentSetupContent params={params} />
    </Suspense>
  )
}
