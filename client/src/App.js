import "./App.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

function App() {
  let [todo, setTodo] = useState([]);
  let [inputValue, setInputValue] = useState("");
  let [date, setDate] = useState("");
  let todoRef = useRef();
  let DateRef = useRef();

  useEffect(() => {
    axios.get("/board").then((result) => {
      setTodo(result.data);
    });
  }, []);
  function changeInput(e) {
    setInputValue(e.target.value);
  }
  function changeDate(e) {
    setDate(e.target.value);
  }
  async function sendData(e) {
    try {
      await axios.post("/board", {
        todo: inputValue,
        date: date,
      });
      await axios.get("/board").then((result) => {
        console.log(result.data);
        setTodo(result.data);
      });
      todoRef.current.value = "";
      DateRef.current.value = "";
      setInputValue("");
      setDate("");
    } catch (e) {
      console.log(e);
    }
  }
  async function todoDelete(e) {
    try {
      console.log(e.target.id);
      await axios.delete("/board", { data: { _id: e.target.id } });
      await axios.get("/board").then((result) => {
        console.log(result.data);
        setTodo(result.data);
      });
    } catch (e) {
      console.log("에러발생" + e);
    }
  }
  return (
    <div className="body">
      <h1 className="title">Todos</h1>
      <div className="container">
        <div className="send">
          <p>할일을 입력하세요!</p>
          <input
            ref={todoRef}
            type="text"
            onChange={changeInput}
            placeholder="할일을 입력하세요!"
          ></input>
          <p>날짜를 입력하세요!</p>
          <input
            ref={DateRef}
            type="text"
            onChange={changeDate}
            placeholder="날짜를 입력하세요!"
          ></input>
          <button onClick={sendData}>할일 등록하기</button>
        </div>
        <div className="todos">
          <h1 className="todo-title">오늘의 할일</h1>
          <div className="todo">
            {todo.map((item, index) => {
              return (
                <div className="list" key={index}>
                  <div className="listLeft">
                    <div
                      className={item.input ? "inputCheck" : "inputNoCheck"}
                      onClick={(e) => {
                        let id = item._id;
                        axios
                          .put("/board/" + id, { todo: item.todo })
                          .then((result) => {
                            setTodo(result.data);
                          });
                      }}
                    ></div>
                    <div>
                      <p className={item.input ? "content" : ""}>
                        할일:{item.todo}
                      </p>
                      <p className={item.input ? "content" : ""}>
                        {item.date} 까지
                      </p>
                    </div>
                  </div>
                  <button id={item._id} onClick={todoDelete}>
                    삭제
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
