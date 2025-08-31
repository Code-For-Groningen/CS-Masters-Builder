import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Track } from "@/types"
import { trackInfo } from "@/data/courseData"

interface TrackSelectionProps {
  selectedTrack: Track | null
  onSelectTrack: (track: Track) => void
  onContinue: () => void
}

export function TrackSelection({ selectedTrack, onSelectTrack, onContinue }: TrackSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl font-bold text-slate-900">Choose Your Track</h1>
          <p className="text-lg text-slate-600">Select the specialization that matches your academic interests</p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {(Object.keys(trackInfo) as Track[]).map((track) => (
            <Card
              key={track}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedTrack === track ? trackInfo[track].color : "bg-white hover:bg-slate-50"
              }`}
              onClick={() => onSelectTrack(track)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{track}</CardTitle>
                <CardDescription className="font-medium text-slate-900">{trackInfo[track].title}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{trackInfo[track].description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedTrack && (
          <div className="text-center mt-8">
            <Button onClick={onContinue} className="bg-blue-600 hover:bg-blue-700">
              Continue to Course Planning
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
