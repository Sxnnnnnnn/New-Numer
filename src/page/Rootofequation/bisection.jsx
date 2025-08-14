import { useState } from 'react'
import Line from "react-apexcharts";
import { evaluate } from "mathjs"
import Axios from "axios";

function App() {
    let [Fx, setFx] = useState("");
    let [Xl, setXl] = useState("");
    let [Xr, setXr] = useState("");
    const [dataList, setDataList] = useState([])
    let [data, setdata] = useState([]); // สร้างที่เก็บค่าเป็นarr
    let [showresult, setshowresult] = useState("No");
    let datagraf = data.map((graf, index) => ({
        x: parseFloat(graf.Count),
        y: parseFloat(graf.Fxm)

    }))
    /// Xm=(Xl+Xr)/2
    const series = [
        {
            name: "ค่า xr",
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
            text: "Bisection Method",
            align: "left",
            style: {
                fontSize: "12px",
                color: "#666",
            },
        },
    };
    function savedata() {
        let save = { equation: Fx, xl: Xl, xr: Xr };
        var json = JSON.stringify(save);
        Axios.post("http://localhost:3001/RootAdd", {
            topic: "Bisection",
            input: json,
        }).then(() => { });
    }
    function getdata() {
        Axios.get("http://localhost:3001/RootGet/Bisection", {}).then(
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
        Xl = temp.xl;
        Xr = temp.xr;
        Calculate();
        setshowresult("show");
    }


    function Calculate() {
        console.log(Fx);
        console.log(Xl);
        console.log(Xr);
        let xl = parseFloat(Xl);
        let xr = parseFloat(Xr);
        let x, Xm, fxm, fxl;
        let count = 1;
        let error = 0.000001;

        do {
            Xm = (xl + xr) / 2
            x = Xm;
            fxm = evaluate(Fx, { x: x });
            // fxm=1/43-x;
            x = xl;
            fxl = evaluate(Fx, { x: x });
            //เก็บรอบxl xr xm fxm
            let result = { Count: count, Xl: xl.toFixed(5), Xr: xr.toFixed(5), Xm: Xm.toFixed(5), Fxm: fxm.toFixed(5) }
            data.push(result)
            if (fxl * fxm < 0) {
                xr = Xm
            } else if (fxl * fxm > 0) {
                xl = Xm
            }
            count++
        } while (Math.abs(fxm) > error);
        console.log(data)
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
                        Bisection
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
                                Xl
                            </label>
                            <input value={Xl} onChange={(e) => setXl(e.target.value)} className='w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500' type='number'>
                            </input>
                        </div>

                        <div>
                            <label className="text-3xl fold-bold text-slate-950">
                                Xr
                            </label>
                            <input value={Xr} onChange={(e) => setXr(e.target.value)} className='w-250  p-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500' type='number'>
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
                        Bisection
                    </h1>
                    <h2 className="text-5xl font-bold text-rose-400">
                        Result
                    </h2>
                    <p>
                        <label className="text-3xl font-bold text-slate-950">
                            Iteration {data[data.length - 1].Count}
                        </label>
                    </p>
                    <p>
                        <label className="text-3xl font-bold text-slate-950">
                            answer {data[data.length - 1].Xm}
                        </label>
                    </p>

                    <table className="table center">
                        {/* head  ส่วนหัวข้อ*/}
                        <thead>
                            <tr>
                                <th>Iter </th>
                                <th>XL </th>
                                <th>XR</th>
                                <th>XM</th>
                                <th>FXM</th>
                            </tr>
                        </thead>
                        {/* body  เนื้อหา*/}
                        <tbody>
                            {data.map((item) => (
                                <tr>
                                    <td>{item.Count}</td>
                                    <td>{item.Xl}</td>
                                    <td>{item.Xr}</td>
                                    <td>{item.Xm}</td>
                                    <td>{item.Fxm}</td>
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
                <a href='/bisection' className='text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>Back</a>
            </div>
        </>
    )
}
export default App