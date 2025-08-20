import { useState } from 'react'
import { clone, count, det, evaluate } from "mathjs";
import Axios from "axios";

function App() {
    let [inputn, setinputn] = useState("");
    let [inputx, setinputx] = useState("");
    let [data, setdata] = useState([]);
    let [poinx, setpoinx] = useState([]);
    let [choose, setchoose] = useState("");
    let [x, setx] = useState([]);
    let [y, sety] = useState([]);
    let [showresult, setshowresult] = useState("inputn");
    const [dataList, setDataList] = useState([])

    function savedata() {
        let save = { inputn: inputn, inputx: inputx, x: x, y: y, choose: choose, poinx: poinx };
        var json = JSON.stringify(save);
        Axios.post("http://localhost:3001/InterpolationAdd", {
            topic: "Newton",
            input: json,
        }).then(() => { });
    }
    function getdata() {
        Axios.get("http://localhost:3001/InterpolationGet/Newton", {}).then(
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
        poinx = temp.poinx;
        choose = temp.choose;
        Calculate();
        setshowresult("show");
        // console.log(inputn)
        // console.log(inputx)
        // console.log(x)
        // console.log(y)
    }

    function Calculate() {
        let yi = [], xi = [], ylinear, yquadratic;
        for (let i = 0; i < poinx.length; i++) {
            xi[i] = parseFloat(x[parseInt(poinx[i]) - 1])
        }
        for (let i = 0; i < poinx.length; i++) {
            yi[i] = parseFloat(y[parseInt(poinx[i]) - 1])
        }
        if (choose == "Linear Interpolation") {
            ylinear = (yi[0] * ((parseFloat(inputx) - xi[1]) / (xi[0] - xi[1]))) + (yi[1] * ((parseFloat(inputx) - xi[0]) / (xi[1] - xi[0])))
            data.push(ylinear.toFixed(5))
            console.log(ylinear)
        } else if (choose == "Quadratic Interpolation") {
            yquadratic = (yi[0] * (((parseFloat(inputx) - xi[1]) * (parseFloat(inputx) - xi[2])) / ((xi[0] - xi[1]) * (xi[0] - xi[2])))) + (yi[1] * (((parseFloat(inputx) - xi[0]) * (parseFloat(inputx) - xi[2])) / ((xi[1] - xi[0]) * (xi[1] - xi[2])))) + (yi[2] * (((parseFloat(inputx) - xi[0]) * (parseFloat(inputx) - xi[1])) / ((xi[2] - xi[0]) * (xi[2] - xi[1]))))
            data.push(yquadratic.toFixed(5))
            console.log(yquadratic)
        } else if (choose == "Polynomial Interpolation") {
            let n = xi.length - 1;
            let tempn = n;
            let b = [];
            b.push(yi[0]);
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < tempn; j++) {
                    let ans = ((yi[j + 1] - yi[j]) / (xi[j + 1 + i] - xi[j]))
                    yi[j] = ans;
                    if (j == 0) {
                        b.push(ans);
                    }
                }
                tempn--;
            }
            console.log(b);
            let fx_find = 0
            for (let i = 0; i < n; i++) {
                let somthing = 1;
                for (let j = 0; j < tempn; j++) {
                    somthing = parseFloat(inputx) - xi[j];
                }
                fx_find += b[i] * somthing;
                tempn++;
                console.log(fx_find);
            }
            data.push(fx_find.toFixed(5))
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
            x.push([])
            y.push([])
        }
        setshowresult("input")
    }

    return (
        <>
            {showresult == "inputn" ? (
                <>
                    <h1 className="text-7xl font-bold text-rose-500">
                        Newton's Divided-Differences
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
                                <a onClick={() => setchoose("Polynomial Interpolation")}>
                                    Polynomial Interpolation
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
                        Newton's Divided-Differences
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
                                            <input type='number' onChange={(e) => { x[index] = e.target.value }} >
                                            </input>
                                        </td>
                                        <td>
                                            <input type='number' onChange={(e) => { y[index] = e.target.value }} >
                                            </input>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {choose == "Linear Interpolation" ? (
                            <>
                                <h2 className="text-2xl font-bold text-zinc-900">
                                    Linear Interpolation
                                </h2>
                                <div>
                                    <label className="text-xl fold-bold text-slate-950">
                                        Point x1
                                    </label>
                                    <input type='number' onChange={(e) => { poinx[0] = parseInt(e.target.value) }} class="w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500">
                                    </input>
                                </div>
                                <div>
                                    <label className="text-xl fold-bold text-slate-950">
                                        Point x2
                                    </label>
                                    <input type='number' onChange={(e) => { poinx[1] = parseInt(e.target.value) }} class="w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500">
                                    </input>
                                </div>
                            </>
                        ) : choose == "Quadratic Interpolation" ? (
                            <>
                                <h2 className="text-2xl font-bold text-zinc-900">
                                    Quadratic Interpolation
                                </h2>
                                <div>
                                    <label>
                                        Point x1
                                    </label>
                                    <input type='number' onChange={(n) => { poinx[0] = parseInt(n.target.value) }} class="w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500">
                                    </input>
                                </div>
                                <div>
                                    <label>
                                        Point x2
                                    </label>
                                    <input type='number' onChange={(n) => { poinx[1] = parseInt(n.target.value) }} class="w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500">
                                    </input>
                                </div>
                                <div>
                                    <label>
                                        Point x3
                                    </label>
                                    <input type='number' onChange={(n) => { poinx[2] = parseInt(n.target.value) }} class="w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500">
                                    </input>
                                </div>
                            </>
                        ) : choose == "Polynomial Interpolation" ? (
                            <>
                                <h2 className="text-2xl font-bold text-zinc-900">
                                    Polynomial Interpolation
                                </h2>
                                {x.map((item, index) => (
                                    <div>
                                        <label>
                                            Point xn
                                        </label>
                                        <input type='number' onChange={(e) => { poinx[index] = parseInt(e.target.value) }} class="w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500">
                                        </input>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <></>
                        )}
                        <div>
                            <button onClick={check} className='text-max fold-bold text-slate-950 border text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>
                                Calculate
                            </button>
                        </div>

                    </div>
                </>
            ) : (
                <>
                    <h1 className="text-7xl font-bold text-rose-500">
                        Newton's Divided-Differences
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
            )}
            <div>
                <a href='/newtons' className='text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>Back</a>
            </div>

        </>
    )
}
export default App