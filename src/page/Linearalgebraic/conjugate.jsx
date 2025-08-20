import { useState } from 'react'
import Axios from "axios";
import { evaluate, add, clone, sqrt } from "mathjs"
import { subtract, multiply, transpose } from "mathjs"

function App() {
    let [row, setrow] = useState("");
    let [column, setcolumn] = useState("");
    let [inputX, setinputX] = useState([]);
    let [data, setdata] = useState([]);
    let [showresult, setshowresult] = useState("inputn");
    let [matrixa, setmatrixa] = useState([]);
    let [matrixb, setmatrixb] = useState([]);
    const [dataList, setDataList] = useState([])
    function savedata() {
        let save = { inputX: inputX, column: column, row: row, matrixa: matrixa, matrixb: matrixb };
        var json = JSON.stringify(save);
        Axios.post("http://localhost:3001/linearAdd", {
            topic: "Conjugate",
            input: json,
        }).then(() => { });
    }
    function getdata() {
        Axios.get("http://localhost:3001/linearGet/Conjugate", {}).then(
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
        inputX = temp.inputX;
        row = temp.row;
        column = temp.column;
        matrixa = temp.matrixa;
        matrixb = temp.matrixb;
        setmatrixb(matrixb);
        Calculate();
        setshowresult("show");
    }

    function Calculate() {
        let a = clone(matrixa);
        let b = clone(matrixb);
        let x = clone(inputX);
        let n = row;
        let errValue = 0.001;
        let count = 1;
        //Start
        let r = subtract(multiply(a, x), b);
        let d = multiply(r, -1);
        //loop
        while (true) {
            let grammaUp = multiply(transpose(d), r);
            let grammaDown = multiply(multiply(transpose(d), a), d);
            let gramma = -(grammaUp / grammaDown);
            // console.log(gramma);
            x = add(x, multiply(gramma, d));
            // console.log(x);
            r = subtract(multiply(a, x), b);
            let err = sqrt(multiply(transpose(r), r));
            console.log(err);

            let Result = [];
            Result.push(count);
            for (let i = 0; i < n; i++) {
                Result.push(x[i].toFixed(6));
            }
            data.push(Result);

            if (err < errValue) {
                break;
            }
            let alphaUp = multiply(multiply(transpose(r), a), d);
            let alphaDown = multiply(multiply(transpose(d), a), d);
            let alpha = alphaUp / alphaDown;
            // console.log(alpha);
            d = add(multiply(alpha, d), multiply(r, -1));
            // console.log(d);
            count++;
        }
        setshowresult("yes")
    }
    function check() {
        Calculate()
        savedata()
    }

    function table() {
        for (let i = 0; i < parseInt(row); i++) {
            matrixa.push([])
            matrixb.push(0)
            inputX.push(0)
            for (let j = 0; j < parseInt(column); j++) {
                matrixa[i][j] = [0]
            }
        }
        setshowresult("input")
    }

    return (
        <>
            {showresult == "inputn" ? (
                <>
                    <h1 className="text-7xl font-bold text-rose-500">
                        Conjugate Gradient Method
                    </h1>
                    <div class="grid grid-cols-1 gap-x-8 gap-y-6 ">
                        <div>
                            <label className="text-3xl fold-bold text-slate-950">
                                Row
                            </label>
                            <input value={row} onChange={(e) => setrow(parseInt(e.target.value))} className='w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500' type='number'>
                            </input>
                        </div>

                        <div>
                            <label className="text-3xl fold-bold text-slate-950">
                                Column
                            </label>
                            <input value={column} onChange={(e) => setcolumn(parseInt(e.target.value))} className='w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500' type='number'>
                            </input>
                        </div>

                        <div>
                            <button onClick={table} className='text-middle fold-bold text-slate-950 border text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>
                                Next
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
            ) : showresult == "input" ? (
                <>
                    <h1 className="text-7xl font-bold text-rose-500">
                        Conjugate Gradient Method
                    </h1>
                    <h3 className="text-2xl font-bold text-zinc-900">
                        Matrix A
                    </h3>
                    <div class="grid grid-cols-1 gap-x-8 gap-y-6 ">
                        <table className='table center'>
                            <tbody>
                                {matrixa.map((item, index) => (
                                    <tr key={index}>
                                        {item.map((item2, index2) => (
                                            <td>
                                                <input onChange={(e) => { matrixa[index][index2] = parseFloat(e.currentTarget.value) }} className='w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500' type='number'>
                                                </input>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <h3 className="text-2xl font-bold text-zinc-900">
                            Matrix B
                        </h3>
                        <table className='table center'>
                            <tbody>
                                {matrixb.map((item, index) => (
                                    <tr>
                                        <td>
                                            <input onChange={(e) => { matrixb[index] = parseFloat(e.currentTarget.value) }} className='w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500' type='number'>
                                            </input>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <h3 className="text-2xl font-bold text-zinc-900">
                            X
                        </h3>
                        <table className='table center'>
                            <tbody>
                                {inputX.map((item, index) => (
                                    <tr>
                                        <td>
                                            <input onChange={(e) => { inputX[index] = parseFloat(e.currentTarget.value) }} className='w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500' type='number'>
                                            </input>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

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
            ) : (
                <>
                    <h1 className="text-7xl font-bold text-rose-500">
                        Conjugate Gradient Method
                    </h1>
                    <h2 className="text-4xl font-bold text-rose-400">
                        Result
                    </h2>
                    <table className="table center">
                        <thead>
                            <th>Iter</th>
                            {matrixb.map((item, index) => (
                                <th>X{index + 1}</th>
                            ))}
                        </thead>
                        <tbody >
                            {data.map((item, index) => (
                                <tr>
                                    {item.map((item2, index2) => (
                                        <td>{item2}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </>
            )}
            <div>
                <a href='/conjugate' className='text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>Back</a>
            </div>
        </>
    )

}
export default App