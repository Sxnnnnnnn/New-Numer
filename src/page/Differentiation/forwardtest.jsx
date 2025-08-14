import { useState } from "react";
import { abs, derivative, evaluate, index } from "mathjs";
import ReactApexChart from "react-apexcharts";
import axios from "axios"

function App() {
    let [inputfx, setinputfx] = useState("")
    let [inputx, setinputx] = useState("")
    let [inputh, setinputh] = useState("")
    const [show, setshow] = useState("something")
    let [y, sety] = useState("")
    let [tablex, settablex] = useState([])
    let [tabley, settabley] = useState([])
    let [ans, setans] = useState([])
    let [datalist, setdatalist] = useState([])

    const graf = (tablex.map((item, index) => (
        {
            x: tablex[index],
            y: tabley[index]
        }
    )))
    let series = [
        {
            data: graf
        }
    ]
    let options = {
        chart: {
            type: "line"
        },
        annotations: {
            points: [{
                x: inputx,
                y: y,
                marker: {
                    size: 7,
                    fillColor: '#fff',
                },
                label: {
                    text: y
                }
            }]
        },
        series: [
            {
                data: graf
            }
        ],
        xaixs: {
            type: "numeric",
            tickAmount: 3,
        }
    }

    function save() {
        let saveobject = {
            inputfx: inputfx,
            inputh: inputh,
            inputx: inputx
        }
        let savejson = JSON.stringify(saveobject)
        axios.post("http://localhost:3001/databaseinsert", {
            topic: "forwardtest",
            input: savejson
        }).then()
    }
    function see() {
        axios.get("http://localhost:3001/databaseGet/forwardtest", {}
        ).then((result) => {
            setdatalist(result.data)
            console.log(result.data);
        })
    }

    function calculate() {
        let fxi = []
        let xi = 1
        while (true) {
            if (fxi.length == 3) {
                break
            }
            tablex.push(xi)
            let y = evaluate(inputfx, { x: xi })
            tabley.push(y)
            if (xi >= inputx) {
                fxi.push(y)
            }
            xi = xi + inputh
        }
        let fpxi = ((fxi[2] - (2 * fxi[1]) + fxi[0]) / (inputh ** 2))
        sety(fpxi)
        let firstdiff = derivative(inputfx, "x").toString()
        let seconddiff = derivative(firstdiff, "x").toString()
        let truevule = evaluate(seconddiff, { x: inputx })
        let err = abs((truevule - fpxi) / truevule)
        let result = { truevule: truevule, err: err, fpxi: fpxi }
        ans.push(result)
        console.log(ans);
        setinputx(inputx)
        setshow("go")
    }
    function check() {
        calculate()
        save()
    }
    function selectdata(jsondata) {
        let transformdata = JSON.parse(jsondata)
        inputfx = transformdata.inputfx
        inputh = transformdata.inputh
        inputx = transformdata.inputx
        calculate()
    }

    return (
        <>
            {show == "something" ? (
                <>
                    <h1 className="text-7xl text-rose-600">Forward</h1>
                    <div>
                        <label className="text-2xl">Fx</label>
                        <input onChange={(e) => { setinputfx(e.target.value) }} type="text" className="border border-text-zinc-900"></input>
                    </div>
                    <div>
                        <label className="text-2xl">X</label>
                        <input onChange={(e) => { setinputx(parseFloat(e.target.value)) }} type="number" className="border border-text-zinc-900"></input>
                    </div>
                    <div>
                        <label className="text-2xl">H</label>
                        <input onChange={(e) => { setinputh(parseFloat(e.target.value)) }} type="number" className="border border-text-zinc-900"></input>
                    </div>
                    <button onClick={check} className="text-2xl">Calculate</button>
                    <div>
                        <button onClick={see} className="text-2xl"> SEE ME</button>
                    </div>
                    {datalist.length !== 0 ? (
                        <>
                            {datalist.map((item, index) => (
                                <div>
                                    <div>
                                        <label>{datalist[index].input}</label>
                                    </div>
                                    <div>
                                        <button onClick={() => selectdata(datalist[index].input)} className="text-2xl"> อร้ากกกกกกกก</button>
                                    </div>
                                </div>
                            ))}
                            <div>
                                <a href="/forwardtest" className="text-2xl ">Back</a>
                            </div>
                        </>
                    ) : (
                        <>
                        </>
                    )}
                </>
            ) : (
                <>
                    <h1 className="text-7xl text-rose-600">Forward</h1>
                    <div>
                        <p>True value {ans[0].truevule}</p>
                        <p>Error {ans[0].err}</p>
                        <p>F''xi{ans[0].fpxi}</p>
                    </div>
                    <table className="table center">
                        <thead>
                            <tr>
                                <th>X</th>
                                <th>Y</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tablex.map((item, index) => (
                                <tr>
                                    <td>{tablex[index]}</td>
                                    <td>{tabley[index]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <ReactApexChart
                        options={options}
                        series={series}>
                    </ReactApexChart>

                    <div>
                        <a href="/forwardtest" className="text-2xl ">Back</a>
                    </div>
                </>
            )}
        </>
    )
} export default App