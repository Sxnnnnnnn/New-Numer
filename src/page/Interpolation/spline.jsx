import { useState } from 'react'
import { clone, det, evaluate } from "mathjs";
import Axios from "axios";
import Cubic from "cubic-spline";
function App() {
    let [inputn, setinputn] = useState("");
    let [inputx, setinputx] = useState("");
    let [data, setdata] = useState([]);
    let [choose, setchoose] = useState("");
    let [tablex, settablex] = useState([]);
    const [dataList, setDataList] = useState([])
    let [tabley, settabley] = useState([]);
    let [showresult, setshowresult] = useState("inputn");
    function savedata() {
        let save = { inputn: inputn, inputx: inputx, tablex: tablex, tabley: tabley, choose: choose };
        var json = JSON.stringify(save);
        Axios.post("http://localhost:3001/InterpolationAdd", {
            topic: "Spline",
            input: json,
        }).then(() => { });
    }
    function getdata() {
        Axios.get("http://localhost:3001/InterpolationGet/Spline", {}).then(
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
        inputx = temp.inputx;
        tablex = temp.tablex;
        tabley = temp.tabley;
        choose = temp.choose
        Calculate();
        setshowresult("show");
    }

    function Calculate() {
        let x = clone(tablex);
        let y = clone(tabley);
        let n = parseInt(inputn);
        let xfind = parseFloat(inputx);
        console.log(x)
        console.log(y)
        if (choose == "Linear Interpolation") {
            let usex = [];
            let usey = [];
            for (let i = 0; i < n; i++) {
                if (xfind <= x[i]) {
                    usex[0] = x[i - 1];
                    usex[1] = x[i];
                    usey[0] = y[i - 1];
                    usey[1] = y[i];
                    break;
                }
            }
            let m = (usey[1] - usey[0]) / (usex[1] - usex[0]);
            let fx_find = m * (xfind - usex[0]) + usey[0];
            setdata(fx_find);
        } else if (choose == "Quadratic Interpolation") {
            for (let i = 0; i < n; i++) {
                if (xfind >= x[i] && xfind <= x[i + 1]) {
                    let xi = x[i];
                    let xi1 = x[i + 1];
                    let xi2 = x[i + 2];
                    let yi = y[i];
                    let yi1 = y[i + 1];
                    let yi2 = y[i + 2];
                    let a =
                        (xi1 * yi2 -
                            xi2 * yi1 +
                            xi2 * yi -
                            xi * yi2 +
                            xi * yi1 -
                            xi1 * yi) /
                        ((xi - xi1) * (xi - xi2) * (xi1 - xi2));
                    let b =
                        (xi1 * xi1 * yi2 -
                            xi2 * xi2 * yi1 +
                            xi2 * xi2 * yi -
                            xi * xi * yi2 +
                            xi * xi * yi1 -
                            xi1 * xi1 * yi) /
                        ((xi - xi1) * (xi - xi2) * (xi1 - xi2));
                    let c =
                        (xi1 * xi2 * (xi1 - xi2) * yi1 -
                            xi * xi2 * (xi - xi2) * yi1 -
                            xi1 * xi * (xi1 - xi) * yi2 +
                            xi * xi1 * (xi - xi1) * yi2) /
                        ((xi - xi1) * (xi - xi2) * (xi1 - xi2));

                    let fx_find = a * xfind * xfind + b * xfind + c;
                    setdata(fx_find)
                    break
                }
            }
        }
        else if (choose == "Cubic Interpolation") {
            const Spline1 = new Cubic(x, y)
            let fx_find = Spline1.at(xfind)
            setdata(fx_find)
        }
        console.log(data)
        setshowresult("Yes")
    }

    function check() {
        Calculate()
        savedata()
    }
    function table() {
        for (let i = 0; i < parseInt(inputn); i++) {
            tablex.push([])
            tabley.push([])
        }
        setshowresult("input")
    }

    return (
        <>
            {showresult == "inputn" ? (
                <>
                    <h1 className="text-7xl font-bold text-rose-500">
                        Spline Interpolation
                    </h1>
                    <div class="grid grid-cols-1 gap-x-8 gap-y-6 ">
                        <p>
                            <label className="text-3xl fold-bold text-slate-950">
                                N
                            </label>
                            <input type='number' onChange={(n) => setinputn(n.target.value)} class="w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500" >
                            </input>
                        </p>
                        <p>
                            <label className="text-3xl fold-bold text-slate-950">
                                X
                            </label>
                            <input type='number' onChange={(n) => setinputx(n.target.value)} class="w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500" >
                            </input>
                        </p>
                        <div>
                            <a>{choose} </a>
                            <p>
                                <a onClick={() => setchoose("Linear Interpolation")}>
                                    Linear Interpolation
                                </a>
                            </p>
                            <p>
                                <a onClick={() => setchoose("Quadratic Interpolation")}>
                                    Quadratic Interpolation
                                </a>
                            </p>
                            <p>
                                <a onClick={() => setchoose("Cubic Interpolation")}>
                                    Cubic Interpolation
                                </a>
                            </p>
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
                        Spline Interpolation
                    </h1>
                    <div class="grid grid-cols-1 gap-x-8 gap-y-6 ">
                        <table className="table center">
                            <thead>
                                <tr>
                                    <th>X</th>
                                    <th>Y</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tablex.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input type='number' onChange={(e) => { tablex[index] = e.target.value }} >
                                            </input>
                                        </td>
                                        <td>
                                            <input type='number' onChange={(e) => { tabley[index] = e.target.value }} >
                                            </input>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {choose == "Linear Interpolation" ? (
                            <>

                            </>
                        ) : choose == "Quadratic Interpolation" ? (
                            <>

                            </>
                        ) : choose == "Cubic Interpolation" ? (
                            <>
                                <h2 className="text-2xl font-bold text-zinc-900">
                                    Cubic Interpolation
                                </h2>
                            </>
                        ) : (
                            <></>
                        )}
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
                        Spline Interpolation
                    </h1>
                    <h2 className="text-5xl font-bold text-rose-400">
                        Result
                    </h2>
                    <p>
                        <label className="text-3xl font-bold text-slate-950">
                            Y = {data}
                        </label>
                    </p>
                </>
            )
            }
            <div>
                <a href='/spline' className='text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>Back</a>
            </div>
        </>
    )
}
export default App