
import { Input } from "@/components/ui/input"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { JSX, SVGProps } from "react"

export function Component() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Find your flight</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="from" className="block text-sm font-medium text-gray-700">
                  From
                </label>
                <Input id="from" placeholder="Enter departure location" />
              </div>
              <div>
                <label htmlFor="to" className="block text-sm font-medium text-gray-700">
                  To
                </label>
                <Input id="to" placeholder="Enter arrival location" />
              </div>
              <div>
                <label htmlFor="departure-date" className="block text-sm font-medium text-gray-700">
                  Departure Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="departure-date"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                      Select date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar initialFocus mode="single" />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label htmlFor="return-date" className="block text-sm font-medium text-gray-700">
                  Return Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button id="return-date" variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                      Select date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar initialFocus mode="single" />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label htmlFor="passengers" className="block text-sm font-medium text-gray-700">
                  Passengers
                </label>
                <Select id="passengers">
                  <SelectTrigger>
                    <SelectValue placeholder="1 passenger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 passenger</SelectItem>
                    <SelectItem value="2">2 passengers</SelectItem>
                    <SelectItem value="3">3 passengers</SelectItem>
                    <SelectItem value="4">4 passengers</SelectItem>
                    <SelectItem value="5">5 passengers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1 md:col-span-2">
                <Button className="w-full">Search Flights</Button>
              </div>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4">Filters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="airline" className="block text-sm font-medium text-gray-700">
                  Airline
                </label>
                <Select id="airline">
                  <SelectTrigger>
                    <SelectValue placeholder="All airlines" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All airlines</SelectItem>
                    <SelectItem value="american">American Airlines</SelectItem>
                    <SelectItem value="delta">Delta Air Lines</SelectItem>
                    <SelectItem value="united">United Airlines</SelectItem>
                    <SelectItem value="southwest">Southwest Airlines</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="departure-time" className="block text-sm font-medium text-gray-700">
                  Departure Time
                </label>
                <Select id="departure-time">
                  <SelectTrigger>
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any time</SelectItem>
                    <SelectItem value="morning">Morning (6am - 12pm)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12pm - 6pm)</SelectItem>
                    <SelectItem value="evening">Evening (6pm - 12am)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="arrival-time" className="block text-sm font-medium text-gray-700">
                  Arrival Time
                </label>
                <Select id="arrival-time">
                  <SelectTrigger>
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any time</SelectItem>
                    <SelectItem value="morning">Morning (6am - 12pm)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12pm - 6pm)</SelectItem>
                    <SelectItem value="evening">Evening (6pm - 12am)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="stops" className="block text-sm font-medium text-gray-700">
                  Stops
                </label>
                <Select id="stops">
                  <SelectTrigger>
                    <SelectValue placeholder="Any stops" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any stops</SelectItem>
                    <SelectItem value="nonstop">Nonstop</SelectItem>
                    <SelectItem value="1stop">1 stop</SelectItem>
                    <SelectItem value="2stops">2 stops</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4">Flight Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Flight #AB123</div>
                    <div className="text-sm bg-green-500 px-1 py-0.5 rounded-md text-foreground">On Time</div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm text-muted-foreground">Departure</div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-medium">SFO</div>
                      </div>
                      <div>10:30 AM</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm text-muted-foreground">Arrival</div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-medium">JFK</div>
                      </div>
                      <div>5:45 PM</div>
                    </div>
                  </div>
                </CardContent>
                <Separator />
                <CardFooter className="flex items-center justify-between flex-row gap-16">
                  <div className="text-sm text-muted-foreground">Duration: 7h 15m</div>
                  <Button variant="outline" size="sm">
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardContent className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Flight #CD456</div>
                    <div className="text-sm bg-yellow-500 px-1 py-0.5 rounded-md text-foreground">Delayed</div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm text-muted-foreground">Departure</div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-medium">LAX</div>
                      </div>
                      <div>11:00 AM</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm text-muted-foreground">Arrival</div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-medium">ORD</div>
                      </div>
                      <div>6:30 PM</div>
                    </div>
                  </div>
                </CardContent>
                <Separator />
                <CardFooter className="flex items-center justify-between flex-row gap-16">
                  <div className="text-sm text-muted-foreground">Duration: 7h 30m</div>
                  <Button variant="outline" size="sm">
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardContent className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Flight #EF789</div>
                    <div className="text-sm bg-red-500 px-1 py-0.5 rounded-md text-foreground">Canceled</div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm text-muted-foreground">Departure</div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-medium">ORD</div>
                      </div>
                      <div>9:00 AM</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm text-muted-foreground">Arrival</div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-medium">LGA</div>
                      </div>
                      <div>3:15 PM</div>
                    </div>
                  </div>
                </CardContent>
                <Separator />
                <CardFooter className="flex items-center justify-between flex-row gap-16">
                  <div className="text-sm text-muted-foreground">Duration: 6h 15m</div>
                  <Button variant="outline" size="sm" disabled>
                    Unavailable
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CalendarDaysIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  )
}
