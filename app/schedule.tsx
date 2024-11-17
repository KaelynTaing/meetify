"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ScheduleProps {
  selectedDates: Date[]; // Receive selectedDates as a prop
}

const Schedule: React.FC<ScheduleProps> = ({ selectedDates }) => {
  const placeholderDates = [
    new Date(2024, 5, 17, 12, 34),
    new Date(2024, 5, 17, 12, 34),
    new Date(2024, 5, 17, 12, 34),
    new Date(2024, 5, 17, 12, 34),
    new Date(2024, 10, 16, 12, 34),
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
    <div className="container mx-auto p-4 max-w-4xl">
      {/* wanted to print out the dates to see if they're accessible here */}
      <ul className="space-y-2">
        {selectedDates
          .slice() // Create a copy to avoid mutating the original array
          .sort((a, b) => a.getTime() - b.getTime()) // Use getTime() for numeric comparison
          .map((date, index) => (
            <li key={index}>{date.toDateString()}</li>
          ))}
      </ul>

      <h1 className="text-2xl font-bold mb-4">Team Meeting Scheduler</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-muted font-semibold">
              Select Your Availability
            </div>
            <ScrollArea className="h-[500px] w-full">
              <div className="grid grid-cols-6 gap-1 p-4">
                <div></div>
                {placeholderDates.map((date, index) => (
                  <div key={index} className="text-center font-semibold">
                    {date.getUTCDay()}
                  </div>
                ))}
                {times.map((time) => (
                  <>
                    <div key={`time-${time}`} className="text-right pr-2">
                      {time % 12 || 12} {time < 12 ? "AM" : "PM"}
                    </div>
                    {days.map((day) => (
                      <Button
                        key={`${day}-${time}`}
                        variant={
                          selectedSlots.has(`${day}-${time}`)
                            ? "default"
                            : "outline"
                        }
                        className="w-full h-8"
                        onClick={() => toggleSlot(day, time)}
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
