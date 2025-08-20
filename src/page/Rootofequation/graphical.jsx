import { useState } from 'react'
import Line from "react-apexcharts";
import { evaluate } from "mathjs"
import Axios from "axios";

function App() {
    let [inputfx, setinputfx] = useState("");
    let [inputstart, setinputstart] = useState("");
    let [inputend, setinputend] = useState("");
    let [data, setdata] = useState([]);
    const [dataList,setDataList] = useState([])
    let [showresult, setshowresult] = useState("No");
    let datagraf = data.map((graf, index) => ({
        x: parseFloat(graf.Count),
        y: parseFloat(graf.Fx)

    }))
    // console.log(data.xl)
    const series = [

        {
            name: "ค่า F(x)",
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
            text: "Graphical Method",
            align: "left",
            style: {
                fontSize: "12px",
                color: "#666",
            },
        },
    };

    function savedata() {
        let save = { equation: inputfx, inputstart: inputstart, inputend: inputend };
        var json = JSON.stringify(save);
        Axios.post("http://localhost:3001/RootAdd", {
            topic: "Graphical",
            input: json,
        }).then(() => { });
    }
    function getdata() {
        Axios.get("http://localhost:3001/RootGet/Graphical", {}).then(
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
        inputfx = temp.equation;
        inputstart = temp.inputstart;
        inputend = temp.inputend;
        Calculate();
        setshowresult("show");
    }

    function Calculate() {
        let xstart = parseFloat(inputstart);
        let xend = parseFloat(inputend);
        let count = 1;
        let x = xstart;
        let functfx, fx, functcheck

        // เพิ่มทีละตำแหน่ง ค่าไหนเข้าใกล้0 ถ้ามากกว่าสุน ย้อนมาดุตัวก่อนจะเกินสุน
        while (true) {
            fx = evaluate(inputfx, { x: x })
            x++ //เพิ่มทีละ1
            functcheck = evaluate(inputfx, { x: x })
            // -3       2
            if (fx >= 0 && functcheck < 0) {
                x = x - 1
                break
            } else if (fx <= 0 && functcheck > 0) {
                x = x - 1
                break
            }
            let result = { Count: count, X: x.toFixed(5), Fx: fx.toFixed(5) }
            data.push(result)
            count++
            // console.log(data)
            setshowresult("Yes");
        }
        while (true) {
            fx = evaluate(inputfx, { x: x })
            x = x + 0.1
            functcheck = evaluate(inputfx, { x: x })
            if (fx >= 0 && functcheck < 0) {
                x = x - 0.1
                break
            } else if (fx <= 0 && functcheck > 0) {
                x = x - 0.1
                break
            }
            let result = { Count: count, X: x.toFixed(5), Fx: fx.toFixed(5) }
            data.push(result)
            count++
            //console.log(data)
            setshowresult("Yes");
        }

        while (true) {
            fx = evaluate(inputfx, { x: x })
            x = x + 0.01
            functcheck = evaluate(inputfx, { x: x })
            if (fx >= 0 && functcheck < 0) {
                x = x - 0.01
                break
            } else if (fx <= 0 && functcheck > 0) {
                x = x - 0.01
                break
            }
            let result = { Count: count, X: x.toFixed(5), Fx: fx.toFixed(5) }
            data.push(result)
            count++
            // console.log(data)
            setshowresult("Yes");
        }

        while (true) {
            fx = evaluate(inputfx, { x: x })
            x = x + 0.001
            functcheck = evaluate(inputfx, { x: x })
            if (fx >= 0 && functcheck < 0) {
                x = x - 0.001
                break
            } else if (fx <= 0 && functcheck > 0) {
                x = x - 0.001
                break
            }
            let result = { Count: count, X: x.toFixed(5), Fx: fx.toFixed(5) }
            data.push(result)
            count++
            // console.log(data)
            setshowresult("Yes");
        }

        while (true) {
            fx = evaluate(inputfx, { x: x })
            x = x + 0.0001
            functcheck = evaluate(inputfx, { x: x })
            if (fx >= 0 && functcheck < 0) {
                x = x - 0.0001
                break
            } else if (fx <= 0 && functcheck > 0) {
                x = x - 0.0001
                break
            }
            let result = { Count: count, X: x.toFixed(5), Fx: fx.toFixed(5) }
            data.push(result)
            count++
            // console.log(data)
            setshowresult("Yes");
        }

        while (true) {
            fx = evaluate(inputfx, { x: x })
            x = x + 0.00001
            functcheck = evaluate(inputfx, { x: x })
            if (fx >= 0 && functcheck < 0) {
                x = x - 0.00001
                break
            } else if (fx <= 0 && functcheck > 0) {
                x = x - 0.00001
                break
            }
            let result = { Count: count, X: x.toFixed(5), Fx: fx.toFixed(5) }
            data.push(result)
            count++
            // console.log(data)
            setshowresult("Yes");
        }
    }
    function chack() {
        Calculate()
        savedata()
    }

    return (
        <>
            {showresult == "No" ? (
                <>
                    <h1 className="text-7xl font-bold text-rose-500">
                        Graphical Method
                    </h1>

                    <div class="grid grid-cols-1 gap-x-8 gap-y-6 ">
                        <div>
                            <label className="text-3xl fold-bold text-slate-950 ">
                                Equation
                            </label>
                            <input value={inputfx} onChange={(e) => setinputfx(e.target.value)} className='w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500' type='text'>
                            </input>
                        </div>

                        <div>
                            <label className="text-3xl fold-bold text-slate-950">
                                Start
                            </label>
                            <input value={inputstart} onChange={(e) => setinputstart(e.target.value)} className='w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500' type='number'>
                            </input>
                        </div>

                        <div>
                            <label className="text-3xl fold-bold text-slate-950">
                                End
                            </label>
                            <input value={inputend} onChange={(e) => setinputend(e.target.value)} className='w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500' type='number'>
                            </input>
                        </div>

                        <div>
                            <button onClick={chack} className='text-max fold-bold text-slate-950 border text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>
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
                        Graphical Method
                    </h1>
                    <h2 className="text-5xl font-bold text-rose-400">
                        Result
                    </h2>
                    <p>
                        <label className="text-3xl font-bold text-slate-950">
                            F(x) {data[data.length - 1].Fx}
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
                                <th>F(x)</th>
                            </tr>
                        </thead>
                        {/* body  เนื้อหา*/}
                        <tbody>
                            {data.map((item) => (
                                <tr>
                                    <td>{item.Count}</td>
                                    <td>{item.X}</td>
                                    <td>{item.Fx}</td>
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
                            <a href='/graphical' className='text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>Back</a>
                        </div>
        </>
    )
}
export default App