import { useState } from 'react'
import { clone, index } from 'mathjs';
import { abs } from 'mathjs';
import Axios from "axios";

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
        let save = { inputX: inputX, row: row, column: column, matrixa: matrixa, matrixb: matrixb };
        var json = JSON.stringify(save);
        Axios.post("http://localhost:3001/linearAdd", {
            topic: "Jacobi",
            input: json,
        }).then(() => { });
    }
    function getdata() {
        Axios.get("http://localhost:3001/linearGet/Jacobi", {}).then(
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
        row = temp.row;
        inputX = temp.inputX;
        column = temp.column;
        matrixa = temp.matrixa;
        matrixb = temp.matrixb;
        setmatrixb(matrixb);

        Calculate();
        setshowresult("show");
    }

    function Calculate() {
        let n = row;
        let x = inputX
        let errValue = 0.001;
        let count = 1;
        let outloob = false;
        let b = clone(matrixb)
        let a = clone(matrixa)

        while (outloob != true) {
            let prevx = clone(x);
            let newx = [];
            for (let i = 0; i < n; i++) {
                let temp = b[i];
                for (let j = 0; j < n; j++) {
                    if (i != j) {
                        temp = temp - a[i][j] * x[j];
                    }
                }
                newx.push(temp / a[i][i]);
            }
            let Result = [];
            Result.push(count)
            for (let i = 0; i < n; i++) {
                Result.push(newx[i].toFixed(6))
            }
            data.push(Result)
            if (count != 1) {
                for (let i = 0; i < n; i++) {
                    let err = abs((newx[i] - prevx[i]) / newx[i]);
                    if (err < errValue) {
                        outloob = true;
                        break;
                    }
                }
            }
            x = clone(newx);
            count++;

        }
        console.log(data)
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
                        Jacobi Iteration Method
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
                            <button onClick={table} className='text-max fold-bold text-slate-950 border text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>
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
                        Jacobi Iteration Method
                    </h1>
                    <div class="grid grid-cols-1 gap-x-8 gap-y-6 ">
                        <h3 className="text-2xl font-bold text-zinc-900">
                            Matrix A
                        </h3>
                        <table className="table center">
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
                        <table className="table center">
                            <tbody>
                                {matrixb.map((item, index) => (
                                    <tr key={index}>
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
                        <table className="table center">
                            <tbody>
                                {inputX.map((item, index) => (
                                    <tr key={index}>
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
                        Jacobi Iteration Method
                    </h1>
                    <h2 className="text-5xl font-bold text-rose-400">
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
                <a href='/jacobi' className='text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>Black</a>
            </div>
        </>
    )

}
export default App