import React from "react";
import { useState } from "react";


function todoForm({addTodo}){
    const [input , setInput] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        if(input.trim()) return;
        addTodo(input);
        setInput("");
    }

    return(
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add a new todo"
            />
            <button type="submit">
                Add
            </button>
        </form>

    )
}

export default todoForm;