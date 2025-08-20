import { useState } from 'react'
import integrate from 'integrate-adaptive-simpson'
import Axios from "axios";

function App() {
    let [inputFx, setinputFx] = useState("");
    let [inputxstart, setinputxstart] = useState("");
    let [inputxend, setinputxend] = useState("");
    let [inputn, setinputn] = useState("");
    let [data, setdata] = useState([]);
    const [dataList, setDataList] = useState([])
    const [showresult, setshowresult] = useState("No");
    function savedata() {
        let save = { inputn: inputn, inputFx: inputFx, inputxstart: inputxstart, inputxend: inputxend };
        var json = JSON.stringify(save);
        Axios.post("http://localhost:3001/IntegrationAdd", {
            topic: "Compositesim",
            input: json,
        }).then(() => { });
    }
    function getdata() {
        Axios.get("http://localhost:3001/IntegrationGet/Compositesim", {}).then(
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
        inputn = temp.inputn;
        inputFx = temp.inputFx;
        inputxstart = temp.inputxstart;
        inputxend = temp.inputxend;
        Calculate();
        setshowresult("show");
    }
    function Calculate() {
        let x0 = parseFloat(inputxstart);
        let xn = parseFloat(inputxend);
        let n = parseInt(inputn);
        let x, fxi1, fxi2, sigmai1 = 0, I, sigmai2 = 0;
        let h = (xn - x0) / n
        x = x0
        let fx0 = eval(inputFx)
        x = xn
        let fxn = eval(inputFx)

        for (let i = 1; i <= n - 1; i += 2) {
            x = x0 + (i * h)
            fxi1 = eval(inputFx)
            sigmai1 = sigmai1 + fxi1
        }
        for (let i = 2; i <= n - 2; i += 2) {
            x = x0 + (i * h)
            fxi2 = eval(inputFx)
            sigmai2 = sigmai2 + fxi2
        }
        I = (h / 3) * (fx0 + fxn + (4 * sigmai1) + (2 * sigmai2))

        //i=h/3(fx0+fxn+4fxin-1)+2fxin-2

        function f(x) {
            return eval(inputFx)
        }
        let integratevalue = integrate(f, x0, xn)
        let err = Math.abs((integratevalue - I) / integratevalue)
        let result = { I: I.toFixed(3), Error: err.toFixed(3) }
        data.push(result)
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
                        Composite Simpson's Rule
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
                            <input value={inputxstart} onChange={(e) => setinputxstart(parseFloat(e.target.value))} class="w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500" type='number'>
                            </input>
                        </div>

                        <div>
                            <label className="text-3xl fold-bold text-slate-950">
                                X end
                            </label>
                            <input value={inputxend} onChange={(e) => setinputxend(parseFloat(e.target.value))} class="w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500" type='number'>
                            </input>
                        </div>

                        <div>
                            <label className="text-3xl fold-bold text-slate-950">
                                N
                            </label>
                            <input value={inputn} onChange={(e) => setinputn(parseInt(e.target.value))} class="w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500" type='number'>
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
                            Composite Simpson's Rule
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
                )
            }
            <div>
                <a href='/compositesim' className='text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>Back</a>
            </div>
        </>
    )
}
export default App