"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Graph } from "@/components/Graph";
import { X } from "lucide-react";
import { parseXRDFile } from "@/lib/utils";

interface XRDDataset {
  id: string;
  fileName: string;
  data: { x: number; y: number }[];
}

export default function Home() {
  const [datasets, setDatasets] = useState<XRDDataset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsLoading(true);
      setError(null);

      const newDatasets = await Promise.all(
        Array.from(files).map(async (file) => {
          const content = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = () =>
              reject(new Error("ファイルの読み込み中にエラーが発生しました"));
            reader.readAsText(file);
          });

          const data = parseXRDFile(content);
          return {
            id: crypto.randomUUID(),
            fileName: file.name,
            data: data,
          };
        })
      );

      setDatasets((prev) => [...prev, ...newDatasets]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
      event.target.value = "";
    }
  };

  const handleRemoveDataset = (id: string) => {
    setDatasets((prev) => prev.filter((dataset) => dataset.id !== id));
  };

  const handleClear = () => {
    setDatasets([]);
    setError(null);
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-12 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full max-w-4xl text-center">
        <h1 className="text-2xl font-bold mb-4">XRDデータビューア</h1>
        <p className="text-sm text-gray-600 mb-6">
          X線回折（XRD）ファイルをアップロードし、対数スケールでデータを表示します
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild className="bg-blue-300">
            <label htmlFor="xrd-file" className="cursor-pointer">
              <input
                type="file"
                id="xrd-file"
                className="hidden"
                accept=".xy,.txt,.csv"
                onChange={handleFileUpload}
                multiple
              />
              XRDファイルを選択
            </label>
          </Button>
          <div className="flex flex-wrap justify-center gap-2">
            {datasets.map((dataset) => (
              <div key={dataset.id} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                <span className="text-sm">{dataset.fileName}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-6 w-6"
                  onClick={() => handleRemoveDataset(dataset.id)}
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>読み込み中...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 text-red-500">
            <p>{error}</p>
          </div>
        ) : datasets.length > 0 ? (
          <Graph datasets={datasets} onClear={handleClear} />
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-400">
            <p>XRDファイルをアップロードしてください</p>
          </div>
        )}
      </main>

      <footer className="text-sm text-gray-500">
        <p>© 2025 XRDデータビューア</p>
      </footer>
    </div>
  );
}
