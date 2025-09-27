"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface BollingerBandsData {
  meta: {
    ticker: string
    generated_at_utc: string
    period: string
    interval: string
    note: string
  }
  series: {
    close: { x: string[]; y: number[] }
    ma: { x: string[]; y: number[] }
    upper: { x: string[]; y: number[] }
    lower: { x: string[]; y: number[] }
  }
}

interface BollingerBandsTableProps {
  data: BollingerBandsData
}

export function BollingerBandsTable({ data }: BollingerBandsTableProps) {
  if (!data?.series) {
    return (
      <Card className="premium-card">
        <CardContent className="p-6">
          <p className="text-slate-400">ボリンジャーバンドデータが利用できません</p>
        </CardContent>
      </Card>
    )
  }

  // Combine all data points by date
  const combinedData = data.series.close.x
    .map((date, index) => ({
      date,
      close: data.series.close.y[index],
      ma: data.series.ma.y[index],
      upper: data.series.upper.y[index],
      lower: data.series.lower.y[index],
    }))
    .reverse() // Show most recent first

  // Calculate BB position and squeeze
  const getPositionInfo = (close: number, upper: number, lower: number, ma: number) => {
    const bandWidth = upper - lower
    const position = (close - lower) / bandWidth

    let positionText = "中央"
    let positionColor = "text-yellow-400"

    if (close > upper) {
      positionText = "上限突破"
      positionColor = "text-red-400"
    } else if (close < lower) {
      positionText = "下限突破"
      positionColor = "text-green-400"
    } else if (position > 0.8) {
      positionText = "上限接近"
      positionColor = "text-orange-400"
    } else if (position < 0.2) {
      positionText = "下限接近"
      positionColor = "text-blue-400"
    }

    return { positionText, positionColor, bandWidth, position }
  }

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3">
          <div className="w-3 h-3 bg-purple-400 rounded-full glow-effect"></div>
          ボリンジャーバンド分析
        </CardTitle>
        <p className="text-slate-400">20期間移動平均 ±2σ バンド分析</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-800/50">
                <TableHead className="text-slate-300 font-semibold">日付</TableHead>
                <TableHead className="text-slate-300 font-semibold text-right">終値</TableHead>
                <TableHead className="text-slate-300 font-semibold text-right">移動平均</TableHead>
                <TableHead className="text-slate-300 font-semibold text-right">上限バンド</TableHead>
                <TableHead className="text-slate-300 font-semibold text-right">下限バンド</TableHead>
                <TableHead className="text-slate-300 font-semibold text-center">バンド幅</TableHead>
                <TableHead className="text-slate-300 font-semibold text-center">ポジション</TableHead>
                <TableHead className="text-slate-300 font-semibold text-center">視覚表示</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {combinedData.slice(0, 15).map((row, index) => {
                const { positionText, positionColor, bandWidth, position } = getPositionInfo(
                  row.close,
                  row.upper,
                  row.lower,
                  row.ma,
                )

                return (
                  <TableRow key={row.date} className="border-slate-700 hover:bg-slate-800/30">
                    <TableCell className="text-slate-300 font-mono">
                      {new Date(row.date).toLocaleDateString("ja-JP", {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right font-mono text-white font-semibold">
                      ¥{row.close.toFixed(0)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-blue-300">¥{row.ma.toFixed(0)}</TableCell>
                    <TableCell className="text-right font-mono text-red-300">¥{row.upper.toFixed(0)}</TableCell>
                    <TableCell className="text-right font-mono text-green-300">¥{row.lower.toFixed(0)}</TableCell>
                    <TableCell className="text-center font-mono text-slate-300">{bandWidth.toFixed(0)}</TableCell>
                    <TableCell className={`text-center font-semibold ${positionColor}`}>{positionText}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-20 h-3 bg-slate-700 rounded-full relative overflow-hidden">
                          {/* Band visualization */}
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 via-yellow-500/30 to-red-500/30"></div>
                          {/* Price position indicator */}
                          <div
                            className="absolute top-0 w-1 h-full bg-white rounded-full shadow-lg"
                            style={{ left: `${Math.max(0, Math.min(100, position * 100))}%` }}
                          ></div>
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
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">平均バンド幅</div>
            <div className="text-white text-xl font-bold">
              {(combinedData.slice(0, 10).reduce((sum, row) => sum + (row.upper - row.lower), 0) / 10).toFixed(0)}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">現在のポジション</div>
            <div
              className={`text-xl font-bold ${getPositionInfo(combinedData[0].close, combinedData[0].upper, combinedData[0].lower, combinedData[0].ma).positionColor}`}
            >
              {
                getPositionInfo(combinedData[0].close, combinedData[0].upper, combinedData[0].lower, combinedData[0].ma)
                  .positionText
              }
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">バンド収束度</div>
            <div className="text-white text-xl font-bold">
              {(((combinedData[0].upper - combinedData[0].lower) / combinedData[0].ma) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
