"use client";

import React, { useState } from "react";
import { CalendarComponent } from "@/components/ui/calendar"; // Adjust the path accordingly
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Schedule from "./schedule";

interface CalendarProps {
  // selectedDates: Date[]; // Pass selectedDates as a prop
  onDateSelect: (dates: Date[]) => void; // Function to update selectedDates
}

const CalendarPage: React.FC<CalendarProps> = ({
  // selectedDates,
  onDateSelect,
}) => {
  // State to store selected dates (an array of dates)
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  // Handle date selection/deselection
  const handleSelectDate = (dates: Date[] | undefined) => {
    // If undefined or no dates, reset selected dates
    if (!dates) {
      setSelectedDates([]);
    } else {
      setSelectedDates(dates);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Team Meeting Scheduler</h1>
      {/* Calendar Component */}
      <CalendarComponent
        mode="multiple" // Allow multiple date selections
        selected={selectedDates} // Pass selectedDates array to Calendar
        onSelect={handleSelectDate} // Handle selecting/deselecting dates
        // className="rounded-md border"
      />

      {/* Display selected dates */}
      <div className="mt-6">
        <h3 className="font-semibold">Selected Dates:</h3>
        <ul className="space-y-2">
          {selectedDates
            .slice() // Create a copy to avoid mutating the original array
            .sort((a, b) => a.getTime() - b.getTime()) // Use getTime() for numeric comparison
            .map((date, index) => (
              <li key={index}>{date.toDateString()}</li>
            ))}
        </ul>
      </div>
      <div className="mt-4">
        <Label htmlFor="new-participant"></Label>
        <div className="flex mt-1">
          <Input
            id="new-participant"
            placeholder="Name"
            className="flex-grow"
          />
          <Button className="ml-2">Create Event</Button>
          {/* <Schedule selectedDates={selectedDates}></Schedule> */}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
