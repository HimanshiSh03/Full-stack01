const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';

import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

const columns = {
  todo: { name: "To Do", bg: "bg-red-200", id: "todo" },
  inprogress: { name: "In Progress", bg: "bg-orange-200", id: "inprogress" },
  done: { name: "Done", bg: "bg-green-200", id: "done" },
};

const Kanban = () => {
  const [tasks, setTasks] = useState([]);
  const [inputs, setInputs] = useState([
    { id: "input1", value: "", location: "todo" },
    { id: "input2", value: "", location: "inprogress" },
    { id: "input3", value: "", location: "done" },
  ]);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  // FETCH ALL TASKS ON COMPONENT MOUNT
useEffect(() => {
  const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tasks`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorData.message || 'Unknown error'}`);
      }
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  fetchTasks();
}, []);


  // ADD A NEW TASK FUNCTIONALITY
  const handleAddTask = async (inputId, status) => {
    const input = inputs.find((inp) => inp.id === inputId);
    const title = input.value.trim();
    if (!title) return; // Don't add empty tasks

    try {
      const res = await fetch(`${API_URL}/api/tasks`, { // Consider using process.env.REACT_APP_BACKEND_URL here
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Ensure you send description, assignedUser, priority if you add input fields for them
        body: JSON.stringify({ title, status, description: "", assignedUser: "Unassigned", priority: "Medium" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorData.message || 'Unknown error'}`);
      }

      const newTask = await res.json(); // Backend should return the newly created task (including its _id)
      setTasks((prev) => [...prev, newTask]); // Add the new task to the local state

      // Clear the input field for the specific column after successful addition
      setInputs((prev) =>
        prev.map((inp) =>
          inp.id === inputId ? { ...inp, value: "" } : inp
        )
      );
    } catch (error) {
      console.error("Error adding task:", error);
      // You can add user-facing error feedback here
    }
  };

  // DELETE A TASK
  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, { // Consider using process.env.REACT_APP_BACKEND_URL here
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorData.message || 'Unknown error'}`);
      }
      
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // UPDATE A TASK'S TITLE
  const handleUpdateTask = async (id) => {
    if (!editingTitle.trim()) return;

    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, { // Consider using process.env.REACT_APP_BACKEND_URL here
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingTitle }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorData.message || 'Unknown error'}`);
      }

      const updatedTask = await res.json();
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? updatedTask : task))
      );

      setEditingTaskId(null);
      setEditingTitle("");
    } catch (error) {
      console.error("Error updating task title:", error);
    }
  };

  // HANDLE DRAG AND DROP
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || destination.droppableId === source.droppableId) {
      return;
    }

    if (draggableId.startsWith("input")) {
      setInputs((prev) =>
        prev.map((inp) =>
          inp.id === draggableId
            ? { ...inp, location: destination.droppableId }
            : inp
        )
      );
      return;
    }

    // Optimistic UI update first
    const updatedTasks = tasks.map((task) =>
      task._id === draggableId
        ? { ...task, status: destination.droppableId }
        : task
    );
    setTasks(updatedTasks);

    try {
      const res = await fetch(`${API_URL}/api/tasks/${draggableId}`, { // Consider using process.env.REACT_APP_BACKEND_URL here
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: destination.droppableId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorData.message || 'Unknown error'}`);
      }

    } catch (error) {
      console.error("Error updating task status on drag and drop:", error);
      // Revert UI state if backend update fails
      setTasks(tasks); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">TASK MANAGER</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row justify-center gap-6"> {/* Updated for responsiveness */}
          {Object.entries(columns).map(([status, col]) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`w-full md:w-1/3 ${col.bg} rounded-lg shadow p-4 mb-6 md:mb-0`} // Updated for responsiveness
                  style={{ minHeight: "600px" }}
                >
                  <h2 className="text-xl font-bold text-center mb-4">
                    {col.name}
                  </h2>

                  {/* Input field for adding new tasks */}
                  {inputs
                    .filter((i) => i.location === status)
                    .map((inputData, index) => (
                      <Draggable
                        draggableId={inputData.id}
                        index={index}
                        key={inputData.id}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-4"
                          >
                            <div className="flex items-center">
                              <input
                                type="text"
                                value={inputData.value}
                                onChange={(e) =>
                                  setInputs((prev) =>
                                    prev.map((inp) =>
                                      inp.id === inputData.id
                                        ? { ...inp, value: e.target.value }
                                        : inp
                                    )
                                  )
                                }
                                // --- NEW FEATURE: Add task on Enter key press ---
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddTask(inputData.id, status);
                                  }
                                }}
                                // -------------------------------------------------
                                placeholder="Add a Task"
                                className="p-2 border rounded-l w-full"
                              />
                              <button
                                onClick={() =>
                                  handleAddTask(inputData.id, status)
                                }
                                className="bg-blue-800 text-white font-bold px-4 py-2 rounded-r"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {/* Display existing tasks */}
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index + 10} // Offset index to avoid conflict with input draggable
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-3 rounded mb-3 shadow-sm flex justify-between items-center transition-all duration-200 ease-in-out hover:scale-[1.01] hover:shadow-md" // Added hover effects
                          >
                            {editingTaskId === task._id ? (
                              <>
                                <input
                                  type="text"
                                  value={editingTitle}
                                  onChange={(e) =>
                                    setEditingTitle(e.target.value)
                                  }
                                  className="p-2 border rounded w-full mr-2"
                                />
                                <button
                                  onClick={() => handleUpdateTask(task._id)}
                                  className="text-green-600 font-bold mr-2"
                                >
                                  ✅
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingTaskId(null);
                                    setEditingTitle("");
                                  }}
                                  className="text-gray-600 font-bold"
                                >
                                  ❌
                                </button>
                              </>
                            ) : (
                              <>
                                {/* Display Title */}
                                <div className="flex-1">
                                    <span className="font-semibold text-lg">{task.title}</span>
                                    {/* Display Description (if it exists) */}
                                    {task.description && (
                                        <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                                    )}
                                    {/* Display Assigned User */}
                                    <p className="text-gray-500 text-xs mt-1">
                                        Assigned: <span className="font-medium">{task.assignedUser || 'Unassigned'}</span>
                                    </p>
                                    {/* Display Priority with basic styling */}
                                    <p className={`text-xs font-bold mt-1
                                        ${task.priority === 'High' ? 'text-red-600' : ''}
                                        ${task.priority === 'Medium' ? 'text-orange-600' : ''}
                                        ${task.priority === 'Low' ? 'text-green-600' : ''}
                                    `}>
                                        Priority: {task.priority || 'Medium'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingTaskId(task._id);
                                      setEditingTitle(task.title);
                                    }}
                                    className="text-blue-600"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTask(task._id)}
                                    className="text-red-600"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                  <div className="h-20" />
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Kanban;