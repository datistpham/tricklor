import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import axios from 'axios';
import { SERVER_URL } from '../../../config/config';
import { useMemo } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Tổng tiền mà các thành viên đã nạp trong 7 ngày qua',
      color: "#fff",
      fontSize: 20
    },
  },
  
  scales: {
    y: {
      beginAtZero: true,
      borderColor: "#fff",
      color: "#fff",
      grid: {
        color: "#fff"
      },
      ticks: {
          color: "#fff",
      }
    },
    x: {
        borderColor: "#fff",
        color: "#fff",
        grid: {
        color: "#fff"
        },
        ticks: {
            color: "#fff",
        },
    }
  },
  
};

const labels = [  moment(new Date()).subtract(6, 'day').format("DD-MM-YYYY"), moment(new Date()).subtract(5, 'day').format("DD-MM-YYYY"),  moment(new Date()).subtract(4, 'day').format("DD-MM-YYYY"),  moment(new Date()).subtract(3, 'day').format("DD-MM-YYYY"),  moment(new Date()).subtract(2, 'day').format("DD-MM-YYYY"), moment(new Date()).subtract(1, 'day').format("DD-MM-YYYY"), moment(new Date()).format("DD-MM-YYYY")];

export const data = {
  labels,
  datasets: [
    {
      fill: true,
      label: 'Số tiền',
      data: [1, 2, 3, 4 ,5],
      borderColor: '#fff',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      color: "#fff"
    },
  ],
};

export default function SumofRecharge() {
  const [dt, setDt]= useState(()=> [])
  const [sum, setSum]= useState(()=> 0)
  const data = useMemo(()=> ({
    labels,
    datasets: [
      {
        fill: true,
        label: 'Số tiền',
        data: dt,
        borderColor: '#fff',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        color: "#fff"
      },
    ],
  }), [dt]) ;
  useEffect(()=> {
    (async()=> {
      const res= await axios({
        url: `${SERVER_URL}/stats/sum/profit`,
        method: "post",
        responseType: "json"
      })
      const result= await res.data
      setSum(()=> result.sum)
      return setDt(()=> result.data)
    })()
  }, [])
  return (
    <>
      <div className="brief-all-recharge"><A sum={sum} /></div>
      <Line options={options} data={data} />
    </>
  );
}

const A= (props)=> {
  return (
    <div className="stats-sum-of-recharge">
      Tổng số tiền mà các thành viên đã nạp: <strong>{props?.sum}đ</strong>
    </div>
  )
}
