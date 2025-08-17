import React from "react"; 



function TodoItem({todo, toggleComplete, deleteTodo}){
    return(
        <li className={`todo-item ${todo.completed ? 'completed' : ' '}`}>
           <span>{todo.text}</span>
           <div>
           <button onClick={()=>toggleComplete(todo.id)}>Complete</button>
           <button onClick={()=>deleteTodo(todo.id)}>Delete</button>  
           </div>      
        </li>
    )
} 

export default TodoItem;