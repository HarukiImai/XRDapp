import { Line } from "react-chartjs-2";
import { Button } from "@/components/ui/button";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.jsの登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface GraphProps {
  data: { x: number; y: number }[];
  fileName: string;
  onClear: () => void;
}

export function Graph({ data, fileName, onClear }: GraphProps) {
  const chartData = {
    datasets: [
      {
        label: `XRDデータ - ${fileName}`,
        data: data,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        pointRadius: 1,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: "linear" as const,
        title: {
          display: true,
          text: "2θ (度)",
        },
      },
      y: {
        type: "logarithmic" as const,
        title: {
          display: true,
          text: "強度 (対数スケール)",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "X線回折 (XRD) データ",
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={onClear} className="text-sm bg-blue-300">
          データを消去
        </Button>
      </div>
      <div className="w-full h-[60vh]">
        <Line options={chartOptions} data={chartData} />
      </div>
    </div>
  );
}
