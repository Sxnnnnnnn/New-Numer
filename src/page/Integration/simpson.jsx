import { useState } from 'react'
import integrate from 'integrate-adaptive-simpson'
import Axios from "axios";

function App() {
    let [inputFx, setinputFx] = useState("");
    let [inputxstart, setinputxstart] = useState("");
    let [inputxend, setinputxend] = useState("");
    let [data, setdata] = useState([]);
    let [showresult, setshowresult] = useState("No");
    const [dataList, setDataList] = useState([])
    function savedata() {
        let save = { inputFx: inputFx, inputxstart: inputxstart, inputxend: inputxend };
        var json = JSON.stringify(save);
        Axios.post("http://localhost:3001/IntegrationAdd", {
            topic: "Simpsons",
            input: json,
        }).then(() => { });
    }
    function getdata() {
        Axios.get("http://localhost:3001/IntegrationGet/Simpsons", {}).then(
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
        inputxstart = temp.inputxstart;
        inputxend = temp.inputxend;
        Calculate();
        setshowresult("show");
    }
    function Calculate() {
        let x0 = parseFloat(inputxstart);
        let x2 = parseFloat(inputxend);
        let x, a, b, i, x1;
        a = x0
        b = x2
        let h = (b - a) / 2;
        x1 = b - h
        x = a
        let fx0 = eval(inputFx)
        x = x1
        let fx1 = eval(inputFx)
        x = b
        let fx2 = eval(inputFx)
        //I=(h/3)*((fx0)+4*(fx1)+(fx2))
        i = (h / 3) * (fx0 + (4 * fx1) + fx2)

        function f(x) {
            return eval(inputFx)
        }
        let integratevalue = integrate(f, a, b)
        let error = Math.abs((integratevalue - i) / integratevalue)
        let Result = { I: i.toFixed(3), Error: error.toFixed(3) }
        data.push(Result)
        setshowresult("Yes")

        // console.log(i);
        // console.log(a);
        // console.log(b);
        // console.log(h);
        // console.log(x1);
        // console.log(fx0);
        // console.log(fx1);
        // console.log(fx2);
        // console.log(data)
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
                        Simpson's Rule
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
                                X start
                            </label>
                            <input value={inputxstart} onChange={(e) => setinputxstart(e.target.value)} class="w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500" type='number'>
                            </input>
                        </div>

                        <div>
                            <label className="text-3xl fold-bold text-slate-950">
                                X end
                            </label>
                            <input value={inputxend} onChange={(e) => setinputxend(e.target.value)} class="w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500" type='number'>
                            </input>
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
                            Simpson's Rule
                        </h1>
                        <h2 className="text-5xl font-bold text-rose-400">
                            Result
                        </h2>
                        <p>
                            <label className="text-3xl font-bold text-slate-950">
                                I {data[0].I}
                            </label>
                        </p>
                        <p>
                            <label className="text-3xl font-bold text-slate-950">
                                Error {data[0].Error}
                            </label>
                        </p>
                    </>
                )}
            <div>
                <a href='/simpson' className='text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>Back</a>
            </div>
        </>
    )
}
export default App