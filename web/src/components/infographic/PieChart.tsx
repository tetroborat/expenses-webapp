// @ts-ignore
import React, {useCallback, useEffect, useState} from "react";
import { PieChart, Pie, Cell } from "recharts";
import Amount from "../typicalElements/Amount";

let key = 0

export default function PieChartComponent({width, height, data, symbol='', defaultColor='var(--white50)'}) {
    let [chartData, setChartData] = useState(data)

    useEffect(() => {
        if (JSON.stringify(chartData) !== JSON.stringify(data)) {
            key += 1
            setChartData(data)
        }
    }, [data])

    chartData = chartData.length ? chartData : [{
        value: 100,
        color: defaultColor
    }]

    return (
        <div>
            <PieChart className="mx-auto" width={width} height={height}>
                <Pie
                    data={chartData}
                    labelLine={false}
                    innerRadius={60}
                    outerRadius={80}
                    minAngle={10}
                    dataKey='value'
                    key={key}
                >
                    {chartData.map((item, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={item.color}
                            stroke='unset'
                        />
                    ))}
                </Pie>
            </PieChart>
            <div className="d-flex align-content-center mx-auto">
                <h5 className="mb-0">
                    {data.length ? chartData.map(item => (
                        <span className="badge me-2 mt-2" style={{
                            backgroundColor: item.color,
                            fontWeight: 'unset'
                        }}>
                            {item.name} <Amount notCentered={true} amount={item.value} symbol={symbol}/>
                        </span>
                    )) : <div style={{height: 33.5}}> </div>}
                </h5>
            </div>
        </div>
    )
}
