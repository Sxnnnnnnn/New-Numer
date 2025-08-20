import { useState } from 'react'
import Line from "react-apexcharts";
import { evaluate } from "mathjs"
import Axios from "axios";

function App() {
    let [Fx, setFx] = useState("");
    let [inputX0, setinputX0] = useState("");
    let [inputX1, setinputX1] = useState("");
    let [data, setdata] = useState([]);
    const [dataList, setDataList] = useState([])
    let [showresult, setshowresult] = useState("No");
    let datagraf = data.map((graf, index) => ({
        x: parseFloat(graf.Count),
        y: parseFloat(graf.Fxn)

    }))
    const series = [

        {
            name: "ค่า xn",
            data: datagraf
        },
    ];
    const options = {
        chart: {
            id: "apexchart-example",
            type: "line",
        },

        xaxis: {
            type: "linear",
            position: "bottom",
            labels: {
                formatter: function (val) {
                    return val;
                },
                title: {
                    name: "x",
                },
            },
        },
        yaxis: {

        },
        forecastDataPoints: {
            count: 7,
        },
        stroke: {
            width: 5,
            curve: "smooth",
        },
        fill: {
            type: "gradient",
            gradient: {
                shade: "dark",
                gradientToColors: ["#FDD835"],
                shadeIntensity: 1,
                type: "horizontal",
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100, 100, 100],
            },
        },
        title: {
            text: "Secant Method",
            align: "left",
            style: {
                fontSize: "12px",
                color: "#666",
            },
        },
    };
    function savedata() {
        let save = { equation: Fx, inputX0: inputX0, inputX1: inputX1 };
        var json = JSON.stringify(save);
        Axios.post("http://localhost:3001/RootAdd", {
            topic: "Secant",
            input: json,
        }).then(() => { });
    }
    function getdata() {
        Axios.get("http://localhost:3001/RootGet/Secant", {}).then(
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
        Fx = temp.equation;
        inputX0 = temp.inputX0;
        inputX1 = temp.inputX1;
        Calculate();
        setshowresult("show");
    }

    function Calculate() {
        let x0 = parseFloat(inputX0);
        let x1 = parseFloat(inputX1);
        let x, xn, fx1, fx0, x2, fxn;
        let count = 1;
        let error = 0.000001;

        do {
            x = x0
            fx0 = evaluate(Fx, { x: x })
            x = x1
            fx1 = evaluate(Fx, { x: x })
            xn = x1 - ((fx1) * (x0 - x1)) / ((fx0) - (fx1))
            x = xn
            fxn = evaluate(Fx, { x: x })
            let result = { Count: count, X0: x0.toFixed(5), X1: x1.toFixed(5), Xn: xn.toFixed(5), Fxn: fxn.toFixed(5) }
            data.push(result)
            x0 = x1
            x1 = xn
            count++
        } while (Math.abs(fxn) > error);
        //console.log(data)
        setshowresult("Yes");
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
                        Secant  Method
                    </h1>
                    <div class="grid grid-cols-1 gap-x-8 gap-y-6 ">
                        <div>
                            <label className="text-3xl fold-bold text-slate-950">
                                F(x)
                            </label>
                            <input value={Fx} onChange={(e) => setFx(e.target.value)} className='w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500' type='text'>
                            </input>
                        </div>

                        <div>
                            <label className="text-3xl fold-bold text-slate-950">
                                X0
                            </label>
                            <input value={inputX0} onChange={(e) => setinputX0(e.target.value)} className='w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500' type='number'>
                            </input>
                        </div>

                        <div>
                            <label className="text-3xl fold-bold text-slate-950">
                                X1
                            </label>
                            <input value={inputX1} onChange={(e) => setinputX1(e.target.value)} className='w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500' type='number'>
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
                            Secant Method
                        </h1>
                        <h2 className="text-5xl font-bold text-rose-400">
                            Result
                        </h2>
                        <p>
                            <label className="text-3xl font-bold text-slate-950">
                                X {data[data.length - 1].Xn}
                            </label>
                        </p>
                        <p>
                            <label className="text-3xl font-bold text-slate-950">
                                Iteration {data[data.length - 1].Count}
                            </label>
                        </p>

                        <table className="table center">
                            {/* head  ส่วนหัวข้อ*/}
                            <thead>
                                <tr>
                                    <th>Iter </th>
                                    <th>X0 </th>
                                    <th>X1</th>
                                    <th>Xn</th>
                                    <th>FXN</th>
                                </tr>
                            </thead>
                            {/* body  เนื้อหา*/}
                            <tbody>
                                {data.map((item) => (
                                    <tr>
                                        <td>{item.Count}</td>
                                        <td>{item.X0}</td>
                                        <td>{item.X1}</td>
                                        <td>{item.Xn}</td>
                                        <td>{item.Fxn}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Line
                            options={options}
                            series={series}
                            width="100%"
                            height="400px"
                        />
                    </>
                )}
            <div>
                <a href='/secant' className='text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>Back</a>
            </div>
        </>
    )
}
export default App