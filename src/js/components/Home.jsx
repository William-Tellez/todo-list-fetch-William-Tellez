import React, { useState, useEffect } from "react";
import { VscChromeClose } from "react-icons/vsc";

const Home = () => {
	const [task, setTask] = useState("");
	const [taskList, setTaskList] = useState([]);
	const nameAgenda = "wTellez";

	const createUser = () => {
		return fetch("https://playground.4geeks.com/todo/users?offset=0&limit=100", {
			method: "GET",
			headers: { "Content-Type": "application/json" }
		})
			.then((response) => response.json())
			.then((data) => {
				const existsUser = data.users.some((user) => user.name === nameAgenda)
				if (existsUser) {
					return true;
				} else {
					fetch("https://playground.4geeks.com/todo/users/wTellez", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ name: "wTellez" })
					})
						.then((res) => res.json())
						.then((userCreate) => {
							console.log(userCreate);
							return true;
						})
						.catch((erro) => console.log(erro, "error comunicacion con API crear usuarios"))
				}
			})
			.catch((error) => {
				console.log(error, "error comunicacion con API buscar usuarios")
				return false;
			})

	};

	const getTodos = () => {
		fetch("https://playground.4geeks.com/todo/users/wTellez", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		})
			.then((res) => res.json())
			.then((apiList) => setTaskList(apiList.todos))
			.catch((error) => console.log(error, "error comunicacion con API cargar tareas"))
	}

	const addTodos = (newTask) => {
		fetch("https://playground.4geeks.com/todo/todos/wTellez", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newTask),
		})
			.then((response) => response.json())
			.then((data) => setTaskList([...taskList, data]))
			.catch((error) => console.log(error)
			);
	};

	const deleteTodos = (id) => {
		fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
			method: "DELETE",
		})
			.then((response) => {
				if (response.ok) {
					console.log("tarea eliminada con éxito");
				} else
					console.log("Error al eliminar, status:", response.status);
			})
			.catch((error) => {
				console.error("Error en la petición DELETE:", error);
			});
	}

	useEffect(() => {
		createUser().then((ok) => {
			if (ok) {
				getTodos();
			}
		});
	}, []);

	const handleSubmit = (event) => {
		event.preventDefault();
		if (task.trim() !== "") {
			addTodos({ label: task, is_done: false });
			setTask("");
		}
	};

	const deleteTask = (id) => {
		deleteTodos(id);
		setTaskList(
			taskList.filter((item) => {
				if (item.id === id) return false;
				return true;
			})
		);
	};

	return (
		<>
			<h1 className="todo-title text-center mt-5">todos</h1>
			<div className="container mt-4" style={{ maxWidth: "500px" }}>
				<form onSubmit={handleSubmit}>
					<input
						onChange={(event) => {
							setTask(event.target.value);
						}}
						type="text"
						placeholder="What needs to be done"
						className="form-control shadow rounded-0 ps-5 task-text"
						name="task"
						value={task}
					/>
				</form>
				<ul className="list-group shadow">
					{taskList.map((item, index) => (
						<li key={item.id} className="list-group-item d-flex justify-content-between rounded-0 position-relative ps-5">
							<span className="task-text">{item.label}</span>
							<VscChromeClose
								className="delete-icon text-danger align-self-center"
								onClick={() => deleteTask(item.id)}
							/>
						</li>
					))}
					<li className="list-group-item rounded-0 counter-task">
						{taskList.length} item left
					</li>
				</ul>
			</div>
		</>
	);
};

export default Home;