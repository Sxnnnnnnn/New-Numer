import { useState } from 'react'
import Line from "react-apexcharts";
import { evaluate } from "mathjs"
import Axios from "axios";

function App() {
    let [gx, setgx] = useState("");
    let [inputX, setinputX] = useState("");
    let [data, setdata] = useState([]);
    let [showresult, setshowresult] = useState("No");
    const [dataList, setDataList] = useState([])
    let datagraf = data.map((graf, index) => ({
        x: parseFloat(graf.Count),
        y: parseFloat(graf.Xn)

    }))
    const series = [
        {
            name: "ค่า g(x)",
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
                    return val.toFixed(4);
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
            text: "One Point Iteration Method",
            align: "left",
            style: {
                fontSize: "12px",
                color: "#666",
            },
        },
    };
    function savedata() {
        let save = { equation: gx, x: inputX };
        var json = JSON.stringify(save);
        Axios.post("http://localhost:3001/RootAdd", {
            topic: "Onepoint",
            input: json,
        }).then(() => { });
    }
    function getdata() {
        Axios.get("http://localhost:3001/RootGet/Onepoint", {}).then(
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
        gx = temp.equation;
        inputX = temp.x;

        Calculate();
        setshowresult("show");
    }


    function Calculate() {
        let x = parseFloat(inputX);
        let xn, xold;
        let count = 1;
        let error = 0.000001;
        // console.log(gx)
        do {
            xn = evaluate(gx, { x: x })
            xold = x
            let result = { Count: count, Xn: xn.toFixed(6), Xold: xold.toFixed(6) }
            data.push(result)
            x = xn
            count++
        } while (Math.abs((xold - xn) / xold) > error);
        // console.log(data)
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
                        One Point Iteration Method
                    </h1>
                    <div class="grid grid-cols-1 gap-x-8 gap-y-6 ">
                        <div>
                            <label className="text-3xl fold-bold text-slate-950">
                                g(x)
                            </label>
                            <input value={gx} onChange={(e) => setgx(e.target.value)} className='w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500' type='text'>
                            </input>
                        </div>

                        <div>
                            <label className="text-3xl fold-bold text-slate-950">
                                X
                            </label>
                            <input value={inputX} onChange={(e) => setinputX(e.target.value)} className='w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500' type='number'>
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
            ) : (
                <>
                    <h1 className="text-7xl font-bold text-rose-500">
                        One Point Iteration Method
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
                                <th>X</th>
                                <th>gx</th>
                            </tr>
                        </thead>
                        {/* body  เนื้อหา*/}
                        <tbody>
                            {data.map((item) => (
                                <tr>
                                    <td>{item.Count}</td>
                                    <td>{item.Xold}</td>
                                    <td>{item.Xn}</td>
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
                <a href='/onepoint' className='text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>Back</a>
            </div>
        </>
    )
}
export default App