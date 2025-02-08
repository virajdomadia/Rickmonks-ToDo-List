import axios from "axios";

// const API = "http://localhost:5000/api/todos";
const API = "https://richmonks-to-do-list-backend.onrender.com/api/todos";

export const getTodos = async (token, params) =>
  await axios.get(API, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

export const createTodo = async (token, task) => {
  try {
    const response = await axios.post(
      "https://richmonks-to-do-list-backend.onrender.com/api/todos",
      { task },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateTodo = async (token, id, updatedTask) =>
  await axios.put(`${API}/${id}`, updatedTask, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteTodo = async (token, id) =>
  await axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
