// @ts-ignore
import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import GetRandomColor from "../../utils/GetRandomColor";

export default function LineChartComponent({data, keyList, width, height}) {
    return (
        <ResponsiveContainer width={width} height={height}>
            <LineChart
                width={width}
                height={height}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="white"/>
                <YAxis stroke="white"/>
                <Tooltip />
                <Legend />
                {keyList.map(key =>
                    <Line type="monotone" dataKey={key} stroke={GetRandomColor()} dot={{r:0}}/>
                )}
            </LineChart>
        </ResponsiveContainer>
    );
}
