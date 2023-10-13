#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";

interface Todo {
    id: number;
    task: string;
}

let todo: Todo[] = [];
let nextId = 1;

async function main() {
    while (true) {
        const action = await inquirer.prompt([
            {
                type: "list",
                name: "action",
                message: chalk.magenta("Choose an action:"),
                choices: ["Add task", "View tasks", "Update task", "Delete task", "Exit"],
            },
        ]);

        switch (action.action) {
            case "Add task":
                await addTodo();
                break;
            case "View tasks":
                viewTodos();
                break;
            case "Update task":
                await updateOrDeleteTodo("update");
                break;
            case "Delete task":
                await updateOrDeleteTodo("delete");
                break;
            case "Exit":
                console.log(chalk.green("Quit"));
                return;
        }
    }
}

async function addTodo() {
    const task = await inquirer.prompt([
        {
            type: "input",
            name: "task",
            message: chalk.magenta("Enter a new task:"),
        },
    ]);

    todo.push({ id: nextId++, task: task.task });
    console.log(chalk.green(`Added task: ${task.task}`));
}

function viewTodos() {
    if (todo.length === 0) {
        console.log(chalk.red("No todo found."));
    } else {
        console.log(chalk.yellow("Your Todo Tasks List:"));
        todo.forEach(({ id, task }) => {
            console.log(chalk.blue(`${id}. ${task}`));
        });
    }
}

async function updateOrDeleteTodo(action: "update" | "delete") {
    if (todo.length === 0) {
        console.log(chalk.red(`No todo to ${action}.`));
        return;
    }

    const { taskId } = await inquirer.prompt([
        {
            type: "number",
            name: "taskId",
            message: `Enter the ID of the task you want to ${action}:`,
        },
    ]);

    const todoIndex = todo.findIndex(({ id }) => id === taskId);

    if (todoIndex === -1) {
        console.log(chalk.red(`Task ${taskId} not found.`));
    } else {
        if (action === "update") {
            const { newTask } = await inquirer.prompt([
                {
                    type: "input",
                    name: "newTask",
                    message: chalk.magenta("Enter the new task description:"),
                },
            ]);
            todo[todoIndex].task = newTask;
            console.log(chalk.green(`Updated task ${taskId}: ${newTask}`));
        } else {
            const deletedTask = todo.splice(todoIndex, 1)[0];
            console.log(chalk.green(`Deleted task ${taskId}: ${deletedTask.task}`));
        }
    }
}

main();
