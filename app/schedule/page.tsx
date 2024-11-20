"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addUser, Event, fetchEvent } from "@/lib/firebase/firestore";

const Schedule = () => {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [eventData, setEventData] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeUser, setActiveUser] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

 

  useEffect(() => {
    if (!id) {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const event = await fetchEvent(id);
        setEventData(event);
      } catch (err) {
        console.error("Failed to fetch event: ", err);
        setError("Failed to load event data. Please try again.");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, router]);


  const handleSignIn = async (e: React.FormEvent) => {
    if (!id) {
      router.push("/");
      return;
    }
    if (!eventData) {
      setError("Event data not found. Please try again.");
      return;
    }
    e.preventDefault();
    if (username.trim()) {
      setActiveUser(username);
    }
    console.log(activeUser)
    if(!eventData.users.find(function(o){return o.name===username})){
      await addUser(id, activeUser, eventData)
      
    }
  };

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

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-screen">
        <div className="text-xl">Loading schedule...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-screen">
        <div className="text-xl">No event data found</div>
      </div>
    );
  }

  if (!activeUser) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Sign In</h2>
          <p className="text-gray-600 mb-4">
            Please enter your name to continue to the scheduler
          </p>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={!username.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="flex justify-center text-3xl font-bold mb-4">
        Event: {eventData.eventName}
      </h1>
      <h2 className="text-2xl font-bold mb-4">Team Meeting Scheduler</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-gray-100 font-semibold">
              Select Your Availability/Unavailability
            </div>
            <div className="overflow-auto max-h-[500px]">
              <div
                className="grid gap-1 p-4"
                style={{
                  gridTemplateColumns: `auto repeat(${eventData.calendarDays.length}, 1fr)`,
                }}
              >
                <div></div>
                {eventData.calendarDays.map((date, index) => (
                  <div key={index} className="text-center font-semibold">
                    {date}
                  </div>
                ))}
                {times.map((time) => (
                  <>
                    <div key={`time-${time}`} className="text-right pr-2">
                      {time % 12 || 12} {time < 12 ? "AM" : "PM"}
                    </div>
                    {eventData.calendarDays.map((date) => (
                      <button
                        key={`${date}-${time}`}
                        className={`w-full h-8 border rounded ${
                          selectedSlots.has(`${date}-${time}`)
                            ? "bg-blue-600 text-white"
                            : "bg-white hover:bg-gray-50"
                        }`}
                        onClick={() => toggleSlot(date, time)}
                      />
                    ))}
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-lg mb-4">
            <div className="p-4 bg-gray-100 font-semibold">
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
                        name="marking-option"
                        value={option}
                        className="radio-input"
                        defaultChecked={index === 0}
                      />
                      <label
                        htmlFor={`option-${index}`}
                        className="cursor-pointer"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </form>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg mb-4">
            <div className="p-4 bg-gray-100 font-semibold">Participants</div>
            <div className="p-4">
              <ul className="space-y-2">
                {eventData.users.map((user, index) => (
                  <li key={index}>{user.name}</li>
                ))}
              </ul>
              <div className="mt-4">
                <label htmlFor="new-participant" className="block text-sm font-medium text-gray-700 mb-1">
                  Add Participant
                </label>
                <div className="flex mt-1">
                  <input
                    type="text"
                    id="new-participant"
                    placeholder="Name"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-4 bg-gray-100 font-semibold">Best Times</div>
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