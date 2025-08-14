import { useState } from 'react'
import { clone, det, evaluate } from "mathjs";
import Axios from "axios";

function App() {
    let [inputn, setinputn] = useState("");
    let [inputx, setinputx] = useState("");
    let [data, setdata] = useState([]);
    let [x, setx] = useState([]);
    let [y, sety] = useState([]);
    let [showresult, setshowresult] = useState("inputn");
    let [box, setbox] = useState([]);
    const [dataList, setDataList] = useState([])
    function savedata() {
        let save = { inputn: inputn, inputx: inputx, x: x, y: y };
        var json = JSON.stringify(save);
        Axios.post("http://localhost:3001/leastsquaresAdd", {
            topic: "Polynomial",
            input: json,
        }).then(() => { });
    }
    function getdata() {
        Axios.get("http://localhost:3001/leastsquaresGet/Polynomial", {}).then(
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
        x = temp.x;
        y = temp.y;
        Calculate();
        setshowresult("show");
    }
    function Calculate() {
        let n = parseInt(inputn)
        let xi, yi, x2, x3, x4, xy, x2y, xxxy;
        let sigmax = 0, sigmay = 0, sigmax2 = 0, sigmax3 = 0, sigmax4 = 0, sigmaxy = 0, sigmax2y = 0;

        for (let i = 0; i < n; i++) {
            xi = parseFloat(x[i])
            sigmax = sigmax + xi
            x2 = parseFloat(x[i]) ** 2
            sigmax2 = sigmax2 + x2
            x3 = parseFloat(x[i]) ** 3
            sigmax3 = sigmax3 + x3
            x4 = parseFloat(x[i]) ** 4
            sigmax4 = sigmax4 + x4
            yi = parseFloat(y[i])
            sigmay = sigmay + yi
            xy = parseFloat(x[i]) * parseFloat(y[i])
            sigmaxy = sigmaxy + xy
            x2y = (parseFloat(x[i]) ** 2) * (parseFloat(y[i]))
            sigmax2y = sigmax2y + x2y
            xxxy = { xi: xi.toFixed(5), sigmax: sigmax.toFixed(5), x2: x2.toFixed(5), sigmax2: sigmax2.toFixed(5), x3: x3.toFixed(5), sigmax3: sigmax3.toFixed(5), x4: x4.toFixed(5), sigmax4: sigmax4.toFixed(5), yi: yi.toFixed(5), sigmay: sigmay.toFixed(5), xy: xy.toFixed(5), sigmaxy: sigmaxy.toFixed(5), x2y: x2y.toFixed(5), sigmax2y: sigmax2y.toFixed(5) }
            box.push(xxxy)
        }
        let matrixa = [[n, sigmax, sigmax2], [sigmax, sigmax2, sigmax3], [sigmax2, sigmax3, sigmax4]]
        let matrixb = [sigmay, sigmaxy, sigmax2y]
        let DetA = det(matrixa), a = [];
        for (let i = 0; i < 3; i++) {
            let copymatrixa = clone(matrixa);
            for (let j = 0; j < 3; j++) {
                copymatrixa[j][i] = matrixb[j]
            }
            a.push(det(copymatrixa) / DetA)
        }
        let func = a[0].toFixed(5) + "+" + a[1].toFixed(5) + "+" + a[2].toFixed(5) + "*x"
        let fx = evaluate(func, { x: parseFloat(inputx) })
        let err = 0;
        for (let i = 0; i < n; i++) {
            err += (parseFloat(y[i]) - (a[0] + (a[1] * parseFloat(inputx)) + (a[2] * parseFloat(inputx)))) ** 2
            //(yi-(a0+a1x)+a2x)**2
        }
        console.log(err)
        let result = { Fx: fx.toFixed(5), func: func, err: err.toFixed(5) }
        data.push(result)
        setshowresult("Yes")
    }

    function check() {
        Calculate()
        savedata()
    }
    function table() {
        for (let i = 0; i < parseInt(inputn); i++) {
            x.push([])
            y.push([])
        }
        console.log(x)
        setshowresult("input")
    }

    return (
        <>
            {showresult == "inputn" ? (
                <>
                    <h1 className="text-7xl font-bold text-rose-500">
                        Polynomial Regression
                    </h1>
                    <div class="grid grid-cols-1 gap-x-8 gap-y-6 ">
                        <p>
                            <label className="text-3xl fold-bold text-slate-950">
                                X
                            </label>
                            <input type='number' onChange={(n) => setinputx(n.target.value)} class="w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500" >
                            </input>
                        </p>
                        <p>
                            <label className="text-3xl fold-bold text-slate-950">
                                N
                            </label>
                            <input type='number' onChange={(n) => setinputn(n.target.value)} class="w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500" >
                            </input>
                        </p>
                        <div>
                            <div>
                                <button onClick={table} className='text-max fold-bold text-slate-950 border text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>
                                    Next
                                </button>
                            </div>
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
                        Polynomial Regression
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
                                {x.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input type='number' onChange={(e) => { x[index] = e.currentTarget.value }}>
                                            </input>
                                        </td>
                                        <td>
                                            <input type='number' onChange={(e) => { y[index] = e.currentTarget.value }}>
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
                        Polynomial Regression
                    </h1>
                    <h2 className="text-5xl font-bold text-rose-400">
                        Result
                    </h2>
                    <p>
                        <label className="text-3xl font-bold text-slate-950">
                            F(x) = {data[data.length - 1].func}
                        </label>
                    </p>
                    <p>
                        <label className="text-3xl font-bold text-slate-950">
                            F(x) = {data[data.length - 1].Fx}
                        </label>
                    </p>
                    <table className='table center'>
                        <thead>
                            <tr>
                                <th>X</th>
                                <th>Y</th>
                            </tr>
                        </thead>
                        <tbody>
                            {box.map((item) => (
                                <tr>
                                    <td>{item.xi}</td>
                                    <td>{item.yi}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
            <div>
                <a href='/polynomial' className='text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>Black</a>
            </div>
        </>
    )
}
export default App