"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Graph } from "@/components/Graph";
import { X } from "lucide-react";
import { parseXRDFile } from "@/lib/utils";

export default function Home() {
  const [xrdData, setXrdData] = useState<{ x: number; y: number }[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // XRDファイルの解析

  // ファイルアップロードの処理
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setFileName(file.name);
      setIsLoading(true);
      setError(null);

      const content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () =>
          reject(new Error("ファイルの読み込み中にエラーが発生しました"));
        reader.readAsText(file);
      });

      const data = parseXRDFile(content);
      setXrdData(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
      // ファイル入力をリセット
      event.target.value = "";
    }
  };

  // データの消去
  const handleClear = () => {
    setXrdData([]);
    setFileName("");
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
              />
              XRDファイルを選択
            </label>
          </Button>
          {fileName && (
            <div className="flex items-center">
              <span className="text-sm">{fileName}</span>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => console.log("hello")}
              >
                <X size={16} />
              </Button>
            </div>
          )}
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
        ) : xrdData.length > 0 ? (
          <Graph data={xrdData} fileName={fileName} onClear={handleClear} />
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
