import { useState } from 'react'
import { clone, det, evaluate } from "mathjs";
import Axios from "axios";

function App() {
    let [inputn, setinputn] = useState("");
    let [nX, setnX] = useState("");
    let [tablex, settablex] = useState([]);
    let [tabley, setytabley] = useState([]);
    let [showresult, setshowresult] = useState("inputn");
    let [inputxfind, setinputxfind] = useState([]);
    let [data, setData] = useState("");
    const [dataList, setDataList] = useState([])
    function savedata() {
        let save = { inputn: inputn, tablex: tablex, tabley: tabley, inputxfind: inputxfind, };
        var json = JSON.stringify(save);
        Axios.post("http://localhost:3001/leastsquaresAdd", {
            topic: "Multiple",
            input: json,
        }).then(() => { });
    }
    function getdata() {
        Axios.get("http://localhost:3001/leastsquaresGet/Multiple", {}).then(
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
        tablex = temp.tablex;
        tabley = temp.tabley;
        inputxfind = temp.inputxfind;
        Calculate();
        setshowresult("show");
    }
    function Calculate() {
        let n = inputn;
        let MatrixA = [];
        let sizeA = nX + 1;
        let tempR = 0;
        for (let i = 0; i < sizeA; i++) {
            let tempM = [];
            let tempValue = 0;
            if (i == 0) {
                tempM.push(n);
                for (let indexX = 0; indexX < nX; indexX++) {
                    tempValue = 0;
                    for (let valueX = 0; valueX < n; valueX++) {
                        tempValue += tablex[indexX][valueX];
                    }
                    tempM.push(tempValue);
                }
            } else {
                for (let valueX = 0; valueX < n; valueX++) {
                    tempValue += tablex[i - 1][valueX];
                }
                tempM.push(tempValue);

                let tempValuePow2 = 0;
                for (let valueX = 0; valueX < n; valueX++) {
                    tempValuePow2 += tablex[i - 1][valueX] ** 2;
                }

                let tempxx = [];
                for (let j = 0; j < nX; j++) {
                    for (let k = 0; k < nX; k++) {
                        tempValue = 0;
                        if (j < k) {
                            for (let l = 0; l < n; l++) {
                                tempValue += tablex[j][l] * tablex[k][l];
                            }
                            tempxx.push(tempValue);
                        }
                    }
                }
                console.log(tempxx);
                let tempIndex = 0;
                for (let j = 1; j < sizeA; j++) {
                    if (i == j) {
                        tempM.push(tempValuePow2);
                        tempIndex++;
                    } else {
                        tempM.push(tempxx[j - 1 - tempIndex]);
                    }
                }
                tempR++;
            }
            MatrixA.push(tempM);
        }
        console.log(MatrixA);

        let MatrixB = [];
        let MatrixBValue = 0;
        for (let i = 0; i < n; i++) {
            MatrixBValue += tabley[i];
        }
        MatrixB.push(MatrixBValue);
        for (let i = 0; i < nX; i++) {
            MatrixBValue = 0;
            for (let j = 0; j < n; j++) {
                MatrixBValue += tablex[i][j] * tabley[j];
            }
            MatrixB.push(MatrixBValue);
        }
        console.log(MatrixB);

        let detA = det(MatrixA);
        let a = [];
        for (let i = 0; i < sizeA; i++) {
            let copyA = clone(MatrixA);
            for (let j = 0; j < sizeA; j++) {
                copyA[j][i] = MatrixB[j];
            }
            a.push(det(copyA) / detA);
        }
        let ans = 0;
        ans += a[0];
        for (let i = 1; i < a.length; i++) {
            ans += a[i] * inputxfind[i - 1];
            console.log(ans);
        }
        data = ans;
        setData(data)
        setshowresult("Yes")
    }

    function check() {
        Calculate()
        savedata()
    }
    function table() {
        for (let i = 0; i < nX; i++) {
            tablex.push([]);
            for (let j = 0; j < inputn; j++) {
                tablex[i][j] = 0;
            }
        }
        for (let j = 0; j < inputn; j++) {
            tabley[j] = 0;
        }
        for (let j = 0; j < nX; j++) {
            inputxfind[j] = 0;
        }
        setshowresult("input")
    }

    return (
        <>
            {showresult == "inputn" ? (
                <>
                    <h1 className="text-7xl font-bold text-rose-500">
                        Multiple Linear Regression
                    </h1>
                    <div class="grid grid-cols-1 gap-x-8 gap-y-6 ">

                        <p>
                            <label className="text-3xl fold-bold text-slate-950">
                                X
                            </label>
                            <input type='number' onChange={(e) => setnX(parseInt(e.target.value))} className='w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500' >
                            </input>
                        </p>
                        <p>
                            <label className="text-3xl fold-bold text-slate-950">
                                N
                            </label>
                            <input type='number' onChange={(e) => setinputn(parseInt(e.target.value))} className='w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500' >
                            </input>
                        </p>
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
                        Multiple Linear Regression
                    </h1>
                    <div class="grid grid-cols-1 gap-x-8 gap-y-6 ">
                        <table className=" table center">
                            <thead>
                                <tr>
                                    {tablex.map((item, index) => (
                                        <th>X{index + 1}</th>
                                    ))}
                                    <th>Y</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tabley.map((item, index) => (
                                    <tr key={index}>
                                        {tablex.map((item2, indexX) => (
                                            <td>
                                                <input
                                                    //   value={inputx[indexX][index]}
                                                    type="number"
                                                    className='w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500'
                                                    onChange={(e) => {
                                                        tablex[indexX][index] = parseFloat(
                                                            e.target.value
                                                        );
                                                    }}
                                                ></input>
                                            </td>
                                        ))}
                                        <td>
                                            <input
                                                type="number"
                                                className='w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500'
                                                onChange={(e) => {
                                                    tabley[index] = parseFloat(e.target.value);
                                                }}
                                            ></input>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div class="grid grid-cols-1 gap-x-8 gap-y-6 ">
                            <div>
                                <label>Input X want to find</label>
                                <div>
                                    {inputxfind.map((item, index) => (
                                        <p>
                                            <label>X{index + 1}</label>
                                            <input
                                                type="number"
                                                className='w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500'
                                                onChange={(e) => {
                                                    inputxfind[index] = parseFloat(e.target.value);
                                                }}
                                            ></input>
                                        </p>
                                    ))}
                                </div>
                            </div>
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
            ) : (
                <>
                    <h1 className="text-7xl font-bold text-rose-500">
                        Multiple Linear Regression
                    </h1>
                    <h2 className="text-5xl font-bold text-rose-400">
                        Result
                    </h2>
                    <>
                        <label>f({inputxfind.map((item, index) => (
                            <label>{item}, </label>
                        ))}) = {data}</label>
                    </>
                </>
            )}
            <div>
                <a href='/multiple' className='text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>Black</a>
            </div>
        </>
    )
}
export default App