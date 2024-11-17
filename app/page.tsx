"use client";
import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";
import Schedule from "./schedule";
import { CalendarComponent } from "@/components/ui/calendar"; // Adjust the path accordingly
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const App: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const handleSelectDate = (dates: Date[] | undefined) => {
    setSelectedDates(dates || []);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="flex justify-center text-7xl bold">Meetify</h1>
      <h1 className="text-2xl font-bold mb-4">Event Creation</h1>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Calendar */}
        <CalendarComponent
          mode="multiple"
          selected={selectedDates}
          onSelect={handleSelectDate}
        />

        {/* Selected Dates and Create Event */}
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-semibold">Selected Dates:</h3>
            <ul className="space-y-2">
              {selectedDates
                .slice()
                .sort((a, b) => a.getTime() - b.getTime())
                .map((date, index) => (
                  <li key={index}>{date.toDateString()}</li>
                ))}
            </ul>
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="new-event"></Label>
            <div className="flex items-center gap-2">
              <Input
                id="new-event"
                placeholder="Event Name"
                className="flex-grow"
              />
              <Button>Create Event</Button>
            </div>
          </div>
        </div>
      </div>

      <Schedule selectedDates={selectedDates} />

      <style>
        {`
          .react-calendar__tile.selected-date {
            background-color: #0078d7;
            color: white;
          }
        `}
      </style>
    </div>
  );
};

export default App;
