"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSearchParams } from "next/navigation";

const Schedule = () => {
  // Get the `selectedDates` and `eventName` query parameters
  const searchParams = useSearchParams();
  const search = searchParams.get("selectedDates");
  const eventName = searchParams.get("eventName") ?? "Event";

  // Decode and parse the `selectedDates` query parameter
  let selectedDates: Date[] = [];
  if (search) {
    try {
      const decoded = decodeURIComponent(search); // Decode the URL-encoded string
      const parsed = JSON.parse(decoded); // Parse the JSON string into an array
      selectedDates = parsed.map((date: string) => new Date(date)); // Convert strings to Date objects
    } catch (error) {
      console.error("Error parsing selectedDates:", error);
    }
  }

  // Sort the selected dates
  selectedDates.sort((a, b) => a.getTime() - b.getTime());

  const placeholderDates = [
    new Date(2024, 5, 17, 12, 34),
    new Date(2024, 5, 17, 12, 34),
    new Date(2024, 5, 17, 12, 34),
    new Date(2024, 5, 17, 12, 34),
    // new Date(2024, 10, 16, 12, 34),
  ];
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());

  // const [selectedSlots, setSelectedSlots] = useState<Map<string, Set<string>>>(new Map());

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const times = Array.from({ length: 12 }, (_, i) => i + 9); // 9 AM to 8 PM

  const toggleSlot = (day: string, time: number) => {
    const slot = `${day}-${time}`;
    const newSelectedSlots = new Set(selectedSlots);
    if (newSelectedSlots.has(slot)) {
      newSelectedSlots.delete(slot);
    } else {
      newSelectedSlots.add(slot);
    }
    setSelectedSlots(newSelectedSlots);

  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Header which displays the event name */}
      <h1 className="flex justify-center text-3xl bold">Event: {eventName}</h1>
      <h1 className="text-2xl font-bold mb-4">Team Meeting Scheduler</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-muted font-semibold">
              {/* maybe should switch with toggle */}
              Select Your Availability/Unavailablility
            </div>
            <ScrollArea className="h-[500px] w-full">
              <div
                className="grid grid-cols-6 gap-1 p-4"
                style={{
                  gridTemplateColumns: `auto repeat(${selectedDates.length}, 1fr)`,
                }}
              >
                <div></div> {/* Empty cell to align dates with times */}
                {selectedDates.map((date, index) => (
                  <div key={index} className="text-center font-semibold">
                    {date.toDateString()}
                  </div>
                ))}
                {times.map((time) => (
                  <>
                    <div key={`time-${time}`} className="text-right pr-2">
                      {time % 12 || 12} {time < 12 ? "AM" : "PM"}
                    </div>
                    {selectedDates.map((date) => (
                      <Button
                        key={`${date.toDateString()}-${time}`}
                        variant={
                          selectedSlots.has(`${date.toDateString()}-${time}`)
                            ? "default"
                            : "outline"
                        }
                        className="w-full h-8"
                        onClick={() => toggleSlot(date.toDateString(), time)}
                      />
                    ))}
                  </>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div>
          <div className="bg-card text-card-foreground rounded-lg shadow-lg mb-4">
            <div className="p-4 bg-muted font-semibold">
              Toggle Marking Available/Unavailable
            </div>
            <div className="p-4">
              <form>
                <div className="space-y-2">
                  {[
                    "Marking When Unavailable/Busy",
                    "Marking When Available/Free",
                    "Marking When Available/Free Virtually",
                  ].map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`option-${index}`}
                        name="marking-option" // Updated name for clarity
                        value={option}
                        className="radio-input"
                        defaultChecked={index === 0} // Default to the first option
                      />
                      <Label
                        htmlFor={`option-${index}`}
                        className="cursor-pointer"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </form>
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-lg shadow-lg mb-4">
            <div className="p-4 bg-muted font-semibold">Participants</div>
            <div className="p-4">
              <ul className="space-y-2">
                <li>Alice</li>
                <li>Bob</li>
                <li>Charlie</li>
              </ul>
              <div className="mt-4">
                <Label htmlFor="new-participant">Add Participant</Label>
                <div className="flex mt-1">
                  <Input
                    id="new-participant"
                    placeholder="Name"
                    className="flex-grow"
                  />
                  <Button className="ml-2">Add</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-lg shadow-lg">
            <div className="p-4 bg-muted font-semibold">Best Times</div>
            <div className="p-4">
              <ul className="space-y-2">
                <li>Tuesday 2 PM - 4 PM</li>
                <li>Wednesday 10 AM - 12 PM</li>
                <li>Friday 1 PM - 3 PM</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
