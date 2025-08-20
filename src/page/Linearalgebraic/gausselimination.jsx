import { useState } from 'react'
import { clone } from 'mathjs';
import Axios from "axios";

function App() {
    let [row, setrow] = useState("");
    let [column, setcolumn] = useState("");
    let [data, setdata] = useState([]);
    let [showresult, setshowresult] = useState("inputn");
    let [matrixa, setmatrixa] = useState([]);
    let [matrixb, setmatrixb] = useState([]);
    const [dataList, setDataList] = useState([])
    function savedata() {
        let save = { row: row, column: column, matrixa: matrixa, matrixb: matrixb };
        var json = JSON.stringify(save);
        Axios.post("http://localhost:3001/linearAdd", {
            topic: "Gausselimination",
            input: json,
        }).then(() => { });
    }
    function getdata() {
        Axios.get("http://localhost:3001/linearGet/Gausselimination", {}).then(
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
        column = temp.column;
        matrixa = temp.matrixa;
        matrixb = temp.matrixb;
        setmatrixb(matrixb);
        Calculate();
        setshowresult("show");
    }
    function Calculate() {
        let a = clone(matrixa)
        let b = clone(matrixb)
        let x = []

        for (let k = 0; k < row - 1; k++) {
            for (let i = k + 1; i < row; i++) {
                let factor = a[i][k] / a[k][k]
                for (let j = k; j <= column; j++) {
                    a[i][j] = a[i][j] - factor * a[k][j]
                }
                b[i] = b[i] - factor * b[k]
            }
        }
        x[row - 1] = b[row - 1] / a[row - 1][row - 1]
        for (let i = row - 2; i > -1; i--) {
            let sum = b[i]
            for (let j = i + 1; j < column; j++) {
                sum = sum - a[i][j] * x[j]
            }
            x[i] = sum / a[i][i]
        }
        // console.log(x)
        data.push(x)
        // console.log(data)
        setshowresult("yes");
    }
    function check() {
        Calculate()
        savedata()
    }
    function table() {
        for (let i = 0; i < parseInt(row); i++) {
            matrixa.push([])
            matrixb.push(0)
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
                        Gauss Elimination Method
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
                        Gauss Elimination Method
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
                        Gauss Elimination Method
                    </h1>
                    <h2 className="text-5xl font-bold text-rose-400">
                        Result
                    </h2>
                    <div>
                        {data[0].map((item, index) => (
                            <h5 className="text-3xl font-bold text-zinc-900">
                                X  {item.toFixed(5)}
                            </h5>
                        ))}
                    </div>
                </>
            )}
            <div>
                <a href='/gausselimination' className='text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>Back</a>
            </div>
        </>
    )

}
export default App