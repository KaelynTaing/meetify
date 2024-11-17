"use client";
import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { CalendarComponent } from "@/components/ui/calendar"; // Adjust the path accordingly
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const App: React.FC = () => {
  // State for the selcted dates and event name
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [eventName, setEventName] = useState("");

  // Function to handle the selected dates
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

        <div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="new-event"></Label>
            <div className="flex items-center gap-2">
              {/* Input for the event name */}
              <Input
                id="new-event"
                placeholder="Event Name"
                className="flex-grow"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />

              {/* Button/Link to reroute user to schedule route. Checks if the user has selected at least one
              date and typed an event name */}
              {selectedDates.length > 0 && eventName.trim() ? (
                <Link
                  href={{
                    // Pass the selected dates and event name as query parameters
                    pathname: "/schedule",
                    query: {
                      // Encode the selected dates as a JSON string
                      selectedDates: JSON.stringify(selectedDates),
                      // Pass the event name as a query parameter
                      eventName: eventName,
                    },
                  }}
                >
                  <Button>Create Event</Button>
                </Link>
              ) : (
                <Button disabled>Create Event</Button>
              )}
            </div>
          </div>
        </div>
      </div>

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
