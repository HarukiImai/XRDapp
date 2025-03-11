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

interface XRDDataset {
  id: string;
  fileName: string;
  data: { x: number; y: number }[];
}

interface GraphProps {
  datasets: XRDDataset[];
  onClear: () => void;
}

// データセットごとに異なる色を生成する関数
const getDatasetColor = (index: number) => {
  const colors = [
    "rgb(75, 192, 192)",   // ターコイズ
    "rgb(255, 99, 132)",   // ピンク
    "rgb(54, 162, 235)",   // ブルー
    "rgb(255, 206, 86)",   // イエロー
    "rgb(153, 102, 255)",  // パープル
    "rgb(255, 159, 64)",   // オレンジ
  ];
  return colors[index % colors.length];
};

// Y軸方向のオフセット値を計算する関数
const calculateOffset = (index: number) => {
  // 各データセットを10倍ずつずらす
  return Math.pow(10, index);
};

export function Graph({ datasets, onClear }: GraphProps) {
  const chartData = {
    datasets: datasets.map((dataset, index) => {
      const color = getDatasetColor(index);
      const offset = calculateOffset(index);
      return {
        label: `XRDデータ - ${dataset.fileName}`,
        data: dataset.data.map(point => ({
          x: point.x,
          y: point.y * offset // Y値にオフセットを掛ける
        })),
        borderColor: color,
        backgroundColor: color.replace("rgb", "rgba").replace(")", ", 0.2)"),
        pointRadius: 1,
        borderWidth: 1,
      };
    }),
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
          text: "強度 (任意単位)",
        },
        ticks: {
          display: false, // Y軸の数値を非表示
        },
        grid: {
          display: true, // グリッド線は表示したままにする
          color: "rgba(0, 0, 0, 0.1)", // グリッド線の色を薄く設定
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
      tooltip: {
        callbacks: {
          label: function(tooltipItem: any) {
            const dataset = datasets[tooltipItem.datasetIndex];
            const offset = calculateOffset(tooltipItem.datasetIndex);
            const originalY = tooltipItem.raw.y / offset;
            return `${dataset.fileName}: 2θ = ${tooltipItem.raw.x.toFixed(2)}°, 強度 = ${originalY.toFixed(2)}`;
          }
        }
      }
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
