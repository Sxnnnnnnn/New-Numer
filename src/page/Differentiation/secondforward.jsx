import { useState } from "react";
import axios from "axios";
function App() {
    const [inputfx, setinputfx] = useState("")
    const [x, setx] = useState("")
    const [h, seth] = useState("")

    function save() {
        let savedata = { inputfx: inputfx, x: x, h: h }
        const transformjson = JSON.stringify(savedata)
        axios.post("http://localhost:3001/save",{
            topic: "helpme",
            input: transformjson
        }).then()
    }

    return (
        <>
            <div>
                <label>FX</label>
                <input onChange={(e) => { setinputfx(e.target.value) }} type="text"></input>
            </div>
            <div>
                <label>x</label>
                <input onChange={(e) => { setx(e.target.value) }} type="number"></input>
            </div>
            <div>
                <label>h</label>
                <input onChange={(e) => { seth(e.target.value) }} type="number"></input>
            </div>
            <button onClick={save}>Save</button>
        </>
    )
} export default App