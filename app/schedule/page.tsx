"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  addUser,
  Event,
  fetchEvent,
  updateTimes,
} from "@/lib/firebase/firestore";

// Define times outside the component
const times = Array.from({ length: 12 }, (_, i) => i + 9); // 9 AM to 8 PM

const Schedule = () => {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [eventData, setEventData] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeUser, setActiveUser] = useState("");
  const [showNameModal, setShowNameModal] = useState(true);
  const [nameInput, setNameInput] = useState("");
  const [bestTimes, setBestTimes] = useState<{
    [date: string]: Array<{ start: number; end: number }>;
  }>({});
  const [userColors, setUserColors] = useState<{ [userName: string]: string }>(
    {}
  );
  const [unavailableUsersPerSlot, setUnavailableUsersPerSlot] = useState<{
    [slot: string]: string[];
  }>({});

  const [error, setError] = useState<string | null>(null);

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

  // Calculate best times and assign colors when eventData changes
  useEffect(() => {
    if (eventData) {
      const calculatedBestTimes = calculateBestTimes(eventData);
      setBestTimes(calculatedBestTimes);

      // Assign colors to users
      const colorPalette = [
        "#3498db", // Light Blue
        "#1abc9c", // Turquoise
        "#9b59b6", // Amethyst
        "#2ecc71", // Emerald
        "#2980b9", // Belize Hole Blue
        "#8e44ad", // Wisteria
        "#16a085", // Green Sea
        "#27ae60", // Nephritis
        "#34495e", // Wet Asphalt
        "#2c3e50", // Midnight Blue
        // Add more cool colors if needed
      ];
      const userColorsMap: { [userName: string]: string } = {};
      eventData.users.forEach((user, index) => {
        userColorsMap[user.name] = colorPalette[index % colorPalette.length];
      });
      setUserColors(userColorsMap);

      // Build mapping from slot to unavailable users
      const mapping: { [slot: string]: string[] } = {};
      eventData.users.forEach((user) => {
        user.times.forEach((slot) => {
          if (!mapping[slot]) {
            mapping[slot] = [];
          }
          mapping[slot].push(user.name);
        });
      });
      setUnavailableUsersPerSlot(mapping);
    }
  }, [eventData]);

  // Handles sync button
  const handleSync = async () => {
    if (!id) {
      console.log("id not found");
      return;
    }

    if (selectedSlots == null) {
      return;
    }

    if (eventData == null) {
      console.log("no event data");
      return;
    }

    await updateTimes(
      id,
      Array.from(selectedSlots.values()).sort(),
      activeUser,
      eventData
    );

    // Refresh event data
    const updatedEvent = await fetchEvent(id);
    setEventData(updatedEvent);
  };

  const handleSignIn = async (input: string) => {
    if (!id) {
      console.log("id not found");
      return;
    }

    if (eventData == null) {
      console.log("no event data");
      return;
    }

    const existingUser = eventData.users.find((e) => e.name === input);

    if (existingUser) {
      setSelectedSlots(new Set<string>(existingUser.times));
    } else {
      await addUser(id, input, eventData);
      const updatedEvent = await fetchEvent(id);
      setEventData(updatedEvent);
    }
  };

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

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Sign-in Modal */}
      {showNameModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl mb-4">Please enter your name</h2>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="border p-2 mb-4 w-full"
              placeholder="Your Name"
            />
            <button
              onClick={() => {
                setActiveUser(nameInput);
                setShowNameModal(false);
                handleSignIn(nameInput);
              }}
              className={`px-4 py-2 rounded ${
                nameInput.trim() === ""
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
              disabled={nameInput.trim() === ""}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      <h1 className="flex justify-center text-3xl font-bold mb-4">
        Event: {eventData.eventName}
      </h1>
      <h2 className="text-2xl font-bold mb-4">Team Meeting Scheduler</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-gray-100 font-semibold">
              Select Your Unavailability
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
                  <div key={`row-${time}`} className="contents">
                    <div className="text-right pr-2">
                      {time % 12 || 12} {time < 12 ? "AM" : "PM"}
                    </div>
                    {eventData.calendarDays.map((date) => {
                      const slot = `${date}-${time}`;

                      // Get the list of unavailable users for this slot
                      let unavailableUsers = unavailableUsersPerSlot[slot] || [];

                      // Include the active user's selections
                      if (
                        selectedSlots.has(slot) &&
                        !unavailableUsers.includes(activeUser)
                      ) {
                        unavailableUsers = [...unavailableUsers, activeUser];
                      }

                      // Get colors for the unavailable users
                      const colors = unavailableUsers.map(
                        (userName) => userColors[userName]
                      );

                      // Create background style
                      let backgroundStyle: React.CSSProperties = {};

                      if (colors.length === 0) {
                        // No users are unavailable during this slot
                        backgroundStyle = { backgroundColor: "white" };
                      } else if (colors.length === 1) {
                        // Only one user is unavailable
                        backgroundStyle = { backgroundColor: colors[0] };
                      } else {
                        // Multiple users are unavailable
                        const gradientColors = colors.join(", ");
                        backgroundStyle = {
                          backgroundImage: `linear-gradient(90deg, ${gradientColors})`,
                        };
                      }

                      return (
                        <button
                          key={slot}
                          style={backgroundStyle}
                          className="w-full h-8 border rounded"
                          onClick={() => toggleSlot(date, time)}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            className="m-3 px-4 py-2 float-right bg-gray-900 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            onClick={handleSync}
          >
            Sync
          </button>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-lg mb-4">
            <div className="p-4 bg-gray-100 font-semibold">Participants</div>
            <div className="p-4">
              <ul className="space-y-2">
                {eventData.users.map((user, index) => (
                  <li key={index} className="flex items-center">
                    <span
                      className="w-4 h-4 mr-2 rounded-full"
                      style={{ backgroundColor: userColors[user.name] }}
                    ></span>
                    {user.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-4 bg-gray-100 font-semibold">Best Times</div>
            <div className="p-4">
              {Object.keys(bestTimes).length === 0 ? (
                <p>No common available times found.</p>
              ) : (
                <ul className="space-y-2">
                  {Object.entries(bestTimes).map(([date, ranges]) => (
                    <li key={date}>
                      <strong>{date}:</strong>
                      <ul className="ml-4">
                        {ranges.map((range, index) => {
                          const startLabel = `${range.start % 12 || 12} ${
                            range.start < 12 ? "AM" : "PM"
                          }`;
                          const endHour = range.end + 1; // Since the end time is inclusive
                          const endLabel = `${endHour % 12 || 12} ${
                            endHour < 12 ? "AM" : "PM"
                          }`;
                          return (
                            <li key={index}>
                              {startLabel} - {endLabel}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;

// Calculate Best Times Function
const calculateBestTimes = (eventData: Event) => {
  // Create a set of all unavailable time slots
  const unavailableSlots = new Set<string>();
  eventData.users.forEach((user) => {
    user.times.forEach((unavailableSlot) => {
      unavailableSlots.add(unavailableSlot);
    });
  });

  // For each day, find available time ranges
  const availableTimeRanges: {
    [date: string]: Array<{ start: number; end: number }>;
  } = {};

  eventData.calendarDays.forEach((date) => {
    const availableTimes: number[] = [];

    times.forEach((time) => {
      const slot = `${date}-${time}`;
      if (!unavailableSlots.has(slot)) {
        availableTimes.push(time);
      }
    });

    // Group available times into ranges
    const ranges: Array<{ start: number; end: number }> = [];
    let startTime: number | null = null;
    let prevTime: number | null = null;

    availableTimes.forEach((time) => {
      if (startTime === null) {
        startTime = time;
      }
      if (prevTime !== null && time !== prevTime + 1) {
        // Time is not consecutive, end current range
        ranges.push({ start: startTime, end: prevTime });
        startTime = time;
      }
      prevTime = time;
    });

    // Add the last range
    if (startTime !== null && prevTime !== null) {
      ranges.push({ start: startTime, end: prevTime });
    }

    if (ranges.length > 0) {
      availableTimeRanges[date] = ranges;
    }
  });

  return availableTimeRanges; // Returns an object with dates as keys and arrays of time ranges
};
