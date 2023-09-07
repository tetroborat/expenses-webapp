// @ts-ignore
import React, {useCallback, useEffect, useState} from "react";
import { PieChart, Pie, Cell } from "recharts";
import Amount from "../typicalElements/Amount";
import Badge from "../typicalElements/Badge";
import PieChartPlaceHolder from "../placeHolder/PieChartPlaceHolder";

let key = 0

export default function PieChartComponent({width, height, data, isLoading,
                                              symbol='',
                                              defaultColor='var(--white50)'}) {
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
        isLoading ? <PieChartPlaceHolder height={height}/> :
        <>
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
                        <Badge color={item.color}
                               style={{fontWeight: 'unset'}}
                               className='mt-2 me-2'
                               content={item.name}
                               addContent={<Amount notCentered={true}
                                                   amount={item.value}
                                                   symbol={symbol}/>
                               }/>
                    )) : <div style={{height: 33.5}}> </div>}
                </h5>
            </div>
        </>
    )
}
