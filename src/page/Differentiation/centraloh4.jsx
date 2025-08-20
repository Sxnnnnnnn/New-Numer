import { useState } from 'react'
import { derivative } from "mathjs";
import Axios from "axios";
import { evaluate } from 'mathjs';
function App() {
    let [inputFx, setinputFx] = useState("");
    let [inputx, setinputx] = useState("");
    let [inputh, setinputh] = useState("");
    let [choose, setchoose] = useState("");
    let [data, setdata] = useState([]);
    const [showresult, setshowresult] = useState("No");
    const [dataList, setDataList] = useState([])
    function savedata() {
        let save = { inputFx: inputFx, inputx: inputx, inputh: inputh, choose: choose };
        var json = JSON.stringify(save);
        Axios.post("http://localhost:3001/DifferentiationAdd", {
            topic: "Centraloh4",
            input: json,
        }).then(() => { });
    }
    function getdata() {
        Axios.get("http://localhost:3001/DifferentiationGet/Centraloh4", {}).then(
            (response) => {
                setDataList(response.data);
                dataList.push(response.data);
                console.log(dataList);
            }
        );
    }
    function selectdata(item) {
        console.log(item);
        let temp = JSON.parse(item);
        inputFx = temp.inputFx;
        inputh = temp.inputh;
        inputx = temp.inputx;
        choose = temp.choose;
        Calculate();
        setshowresult("show");
    }
    function Calculate() {
        let xi = parseFloat(inputx);
        let h = parseFloat(inputh);
        let plus = [], minus = [];
        let x;
        let fpxi, diff, diffture, err;

        for (let i = 0; i < 7; i++) {
            x = xi - (i * h)
            minus[i] = evaluate(inputFx, { x: x })
        }
        for (let i = 0; i < 7; i++) {
            x = xi + (i * h)
            plus[i] = evaluate(inputFx, { x: x })
        }

        if (choose == "First") {
            fpxi = (-plus[2] + (8 * plus[1]) - (8 * minus[1]) + minus[2]) / (12 * h)
            diff = derivative(inputFx, "x").toString()

        } else if (choose == "Second") {
            fpxi = (-plus[2] + (16 * plus[1]) - (30 * plus[0]) + (16 * minus[1]) - minus[2]) / (12 * (h ** 2))
            diff = derivative(inputFx, "x").toString()
            diff = derivative(diff, "x").toString()

        } else if (choose == "Third") {
            fpxi = (-plus[3] + (8 * plus[2]) - (13 * plus[1]) + (13 * minus[1]) - (8 * minus[2]) + minus[3]) / (8 * (h ** 3))
            diff = derivative(inputFx, "x").toString()
            diff = derivative(diff, "x").toString()
            diff = derivative(diff, "x").toString()

        } else if (choose == "Fourth") {
            fpxi = (-plus[3] + (12 * plus[2]) - (39 * plus[1]) + (56 * plus[0]) - (39 * minus[1]) + (12 * minus[2]) - minus[3]) / (6 * (h ** 4))
            diff = derivative(inputFx, "x").toString()
            diff = derivative(diff, "x").toString()
            diff = derivative(diff, "x").toString()
            diff = derivative(diff, "x").toString()
        }
        x = xi
        diffture = evaluate(diff, { x: xi })
        err = diffture - fpxi
        let Result = { appox: fpxi.toFixed(5), truevule: diffture.toFixed(5), err: err.toFixed(5) }
        data.push(Result)
        setshowresult("Yes")

    }
    function check() {
        Calculate()
        savedata()
    }

    return (
        <>
            {showresult == "No" ? (
                <>
                    <h1 className="text-7xl font-bold text-rose-500">
                        Central Divided-Differences O(h^4)
                    </h1>
                    <div class="grid grid-cols-1 gap-x-8 gap-y-6 ">
                        <div>
                            <label className="text-3xl fold-bold text-slate-950">
                                F(x)
                            </label>
                            <input value={inputFx} onChange={(e) => setinputFx(e.target.value)} class="w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500" type='text'>
                            </input>
                        </div>

                        <div>
                            <label className="text-3xl fold-bold text-slate-950">
                                X
                            </label>
                            <input value={inputx} onChange={(e) => setinputx(e.target.value)} class="w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500" type='number'>
                            </input>
                        </div>

                        <div>
                            <label className="text-3xl fold-bold text-slate-950">
                                H
                            </label>
                            <input value={inputh} onChange={(e) => setinputh(e.target.value)} class="w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500" type='number'>
                            </input>
                        </div>

                        <div>
                            <a>{choose} Divided Difference</a>
                            <p>
                                <a onClick={() => setchoose("First")}>
                                    First
                                </a>
                            </p>
                            <p>
                                <a onClick={() => setchoose("Second")}>
                                    Second
                                </a>
                            </p>
                            <p>
                                <a onClick={() => setchoose("Third")}>
                                    Third
                                </a>
                            </p>
                            <p>
                                <a onClick={() => setchoose("Fourth")}>
                                    Fourth
                                </a>
                            </p>
                        </div>

                        <div>
                            <button onClick={check} className='text-max fold-bold text-slate-950 border text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>
                                Calculate
                            </button>
                        </div>
                        {dataList.length === 0 ? (
                            <>
                                <div>
                                    <button onClick={getdata} className='text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>DataList
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {dataList.map((item, index) => (
                                    <>
                                        <p>
                                            <label>
                                                Data {index + 1} {item.input}
                                            </label>
                                        </p>
                                        <div>
                                            <button onClick={() => selectdata(item.input)} className='text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>Select</button>
                                        </div>
                                    </>
                                ))}
                            </>
                        )}
                    </div>

                </>
            ) :
                (
                    <>
                        <h1 className="text-7xl font-bold text-rose-500">
                            Central Divided-Differences O(h^4)
                        </h1>
                        <h2 className="text-5xl font-bold text-rose-400">
                            Result
                        </h2>
                        <p>
                            <label className="text-3xl font-bold text-slate-950">
                                Appoximate value {data[data.length - 1].appox}
                            </label>
                        </p>
                        <p>
                            <label className="text-3xl font-bold text-slate-950">
                                True value {data[data.length - 1].truevule}
                            </label>
                        </p>
                        <p>
                            <label className="text-3xl font-bold text-slate-950">
                                Error {data[0].err}
                            </label>
                        </p>

                    </>
                )
            }
            <div>
                <a href='/centraloh2' className='text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>Back</a>
            </div>
        </>
    )
}
export default App