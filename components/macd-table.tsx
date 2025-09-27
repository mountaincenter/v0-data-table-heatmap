"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface MACDData {
  meta: {
    ticker: string
    generated_at_utc: string
    period: string
    interval: string
    note: string
  }
  series: {
    macd: { x: string[]; y: number[] }
    signal: { x: string[]; y: number[] }
    hist: { x: string[]; y: number[] }
  }
}

interface MACDTableProps {
  data: MACDData
}

export function MACDTable({ data }: MACDTableProps) {
  if (!data?.series) {
    return (
      <Card className="premium-card">
        <CardContent className="p-6">
          <p className="text-slate-400">MACDデータが利用できません</p>
        </CardContent>
      </Card>
    )
  }

  // Combine all data points by date
  const combinedData = data.series.macd.x
    .map((date, index) => ({
      date,
      macd: data.series.macd.y[index],
      signal: data.series.signal.y[index],
      hist: data.series.hist.y[index],
    }))
    .reverse() // Show most recent first

  // Calculate MACD signals
  const getSignalInfo = (macd: number, signal: number, hist: number) => {
    const crossover = macd > signal
    const histPositive = hist > 0

    let signalText = "中立"
    let signalColor = "text-slate-400"
    let strength = "弱"

    if (crossover && histPositive) {
      signalText = "強気"
      signalColor = "text-green-400"
      strength = Math.abs(hist) > 5 ? "強" : "中"
    } else if (!crossover && !histPositive) {
      signalText = "弱気"
      signalColor = "text-red-400"
      strength = Math.abs(hist) > 5 ? "強" : "中"
    } else if (crossover && !histPositive) {
      signalText = "転換期"
      signalColor = "text-yellow-400"
    } else {
      signalText = "調整期"
      signalColor = "text-blue-400"
    }

    return { signalText, signalColor, strength, crossover }
  }

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3">
          <div className="w-3 h-3 bg-cyan-400 rounded-full glow-effect"></div>
          MACD分析
        </CardTitle>
        <p className="text-slate-400">MACD(12,26,9) モメンタム分析</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-800/50">
                <TableHead className="text-slate-300 font-semibold">日付</TableHead>
                <TableHead className="text-slate-300 font-semibold text-right">MACD</TableHead>
                <TableHead className="text-slate-300 font-semibold text-right">シグナル</TableHead>
                <TableHead className="text-slate-300 font-semibold text-right">ヒストグラム</TableHead>
                <TableHead className="text-slate-300 font-semibold text-center">シグナル</TableHead>
                <TableHead className="text-slate-300 font-semibold text-center">強度</TableHead>
                <TableHead className="text-slate-300 font-semibold text-center">視覚表示</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {combinedData.slice(0, 15).map((row, index) => {
                const { signalText, signalColor, strength, crossover } = getSignalInfo(row.macd, row.signal, row.hist)

                return (
                  <TableRow key={row.date} className="border-slate-700 hover:bg-slate-800/30">
                    <TableCell className="text-slate-300 font-mono">
                      {new Date(row.date).toLocaleDateString("ja-JP", {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono font-semibold ${row.macd > 0 ? "text-green-300" : "text-red-300"}`}
                    >
                      {row.macd.toFixed(2)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono font-semibold ${row.signal > 0 ? "text-green-300" : "text-red-300"}`}
                    >
                      {row.signal.toFixed(2)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono font-semibold ${row.hist > 0 ? "text-green-300" : "text-red-300"}`}
                    >
                      {row.hist > 0 ? "+" : ""}
                      {row.hist.toFixed(2)}
                    </TableCell>
                    <TableCell className={`text-center font-semibold ${signalColor}`}>{signalText}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          strength === "強"
                            ? "bg-orange-500/20 text-orange-300"
                            : strength === "中"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-slate-500/20 text-slate-300"
                        }`}
                      >
                        {strength}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* MACD vs Signal crossover indicator */}
                        <div
                          className={`w-3 h-3 rounded-full ${crossover ? "bg-green-400" : "bg-red-400"} glow-effect`}
                        ></div>
                        {/* Histogram bar */}
                        <div className="w-12 h-2 bg-slate-700 rounded-full relative overflow-hidden">
                          <div
                            className={`absolute top-0 h-full rounded-full ${row.hist > 0 ? "bg-green-400" : "bg-red-400"}`}
                            style={{
                              width: `${Math.min(100, Math.abs(row.hist) * 5)}%`,
                              left: row.hist > 0 ? "50%" : `${50 - Math.min(50, Math.abs(row.hist) * 2.5)}%`,
                            }}
                          ></div>
                          <div className="absolute top-0 left-1/2 w-px h-full bg-slate-500"></div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">現在のMACD</div>
            <div className={`text-xl font-bold ${combinedData[0].macd > 0 ? "text-green-300" : "text-red-300"}`}>
              {combinedData[0].macd.toFixed(2)}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">シグナル線</div>
            <div className={`text-xl font-bold ${combinedData[0].signal > 0 ? "text-green-300" : "text-red-300"}`}>
              {combinedData[0].signal.toFixed(2)}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">ヒストグラム</div>
            <div className={`text-xl font-bold ${combinedData[0].hist > 0 ? "text-green-300" : "text-red-300"}`}>
              {combinedData[0].hist > 0 ? "+" : ""}
              {combinedData[0].hist.toFixed(2)}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">トレンド</div>
            <div
              className={`text-xl font-bold ${getSignalInfo(combinedData[0].macd, combinedData[0].signal, combinedData[0].hist).signalColor}`}
            >
              {getSignalInfo(combinedData[0].macd, combinedData[0].signal, combinedData[0].hist).signalText}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
