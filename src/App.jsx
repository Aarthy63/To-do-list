import React, { useEffect, useState } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [todo, setTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [flippedCardIds, setFlippedCardIds] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [todolist, setTodoList] = useState(() => {
    const stored = localStorage.getItem("todolist");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const stored = localStorage.getItem("todolist");
    if (stored) {
      setTodoList(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("todolist", JSON.stringify(todolist));
  }, [todolist]);

  const addTodo = () => {
    if (todo.trim() === "") return;
    setTodoList([
      ...todolist,
      {
        id: Date.now(),
        text: todo,
        completed: false,
      },
    ]);
    setTodo("");
  };

  // const deleteTodo = (id) => {
  //   setTodoList(todolist.filter((item) => item.id !== id));
  //   closeModal();
  // };

  const toggleComplete = (id) => {
    setTodoList(
      todolist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingId(null);
    setEditText("");
    setShowModal(false);
  };

  const saveEdit = (id) => {
    setTodoList(
      todolist.map((item) =>
        item.id === id ? { ...item, text: editText } : item
      )
    );
    closeModal();
    toast.success("Saved changes successfully");
  };

  const deleteTodo = (id) => {
    setTodoList(todolist.filter((item) => item.id !== id));
    toast.error("Deleted task successfully");
  };

  const toggleCardFlip = (index) => {
    setFlippedCardIds((prev) =>
      prev.includes(index)
        ? prev.filter((id) => id !== index)
        : [...prev, index]
    );
  };

  const handleCommentChange = (index, value) => {
    setComments((prev) => ({ ...prev, [index]: value }));
  };

  const handleCommentKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      toggleCardFlip(index);
    }
  };

  return (
    <div className="app">
      <div className="input-bar">
        <input
          type="text"
          placeholder="Add new task..."
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <button className="btnn" onClick={addTodo}>
          Add
        </button>
      </div>

      <div className="bubbles">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bubble"></div>
        ))}
      </div>

      {!loading && (
        <div className="cards-container">
          {Array.from({ length: Math.ceil(todolist.length / 5) }).map(
            (_, cardIndex) => {
              const items = todolist.slice(cardIndex * 5, cardIndex * 5 + 5);
              return (
                <div
                  key={cardIndex}
                  className={`todo-card ${
                    flippedCardIds.includes(cardIndex) ? "flipped" : ""
                  }`}
                >
                  <div className="card-inner">
                    <div className="card-front">
                      <button
                        className="flip-btn"
                        onClick={() => toggleCardFlip(cardIndex)}
                      >
                        Flip
                      </button>
                      <ul>
                        {items.map((item) => (
                          <li
                            key={item.id}
                            className={item.completed ? "completed" : ""}
                          >
                            <span onClick={() => toggleComplete(item.id)}>
                              {item.text}
                            </span>
                            <div className="actions">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEdit(item.id, item.text);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTodo(item.id);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="card-back">
                      <textarea
                        placeholder="Add a comment..."
                        value={comments[cardIndex] || ""}
                        onChange={(e) =>
                          handleCommentChange(cardIndex, e.target.value)
                        }
                        onKeyDown={(e) => handleCommentKeyDown(e, cardIndex)}
                      />
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Task</h3>
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveEdit(editingId)}
            />

            <div className="modal-actions">
              <div style={{ marginTop: "1rem" }}>
                <button
                  onClick={() => saveEdit(editingId)}
                  style={{
                    marginRight: "30px",
                    marginLeft: "50px",
                    padding: "2px",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={closeModal}
                  style={{ padding: "2px" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
