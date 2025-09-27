import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface IchimokuData {
  meta: {
    ticker: string
    generated_at_utc: string
    period: string
    interval: string
    note: string
  }
  series: {
    ohlc: {
      x: string[]
      open: number[]
      high: number[]
      low: number[]
      close: number[]
    }
    ichimoku: {
      tenkan: {
        x: string[]
        y: number[]
      }
      kijun: {
        x: string[]
        y: number[]
      }
      senkou_a: {
        x: string[]
        y: number[]
      }
      senkou_b: {
        x: string[]
        y: number[]
      }
      chikou: {
        x: string[]
        y: number[]
      }
    }
  }
  table: {
    columns: string[]
    rows: Array<{
      date: string
      Close: number
      tenkan: number
      kijun: number
      ssa: number
      ssb: number
      cloud_top: number
      cloud_bottom: number
    }>
  }
  snapshot: {
    last_date: string
    close: number
    cloud_position: string
  }
}

interface IchimokuTableProps {
  data: IchimokuData
}

export function IchimokuTable({ data }: IchimokuTableProps) {
  if (!data?.table?.rows || data.table.rows.length === 0) {
    return (
      <div className="premium-card rounded-2xl p-6">
        <div className="text-center text-slate-400">
          <p>一目均衡表データが利用できません</p>
        </div>
      </div>
    )
  }

  const tableData = data.table.rows

  const getCloudAnalysis = (close: number, tenkan: number, kijun: number, cloud_top: number, cloud_bottom: number) => {
    if (!close || !tenkan || !kijun || !cloud_top || !cloud_bottom) {
      return {
        status: "データなし",
        color: "gray",
        position: "不明",
        strength: 0,
        description: "データが不足しています",
      }
    }

    const cloudThickness = Math.abs(cloud_top - cloud_bottom)
    const priceToCloudDistance = close > cloud_top ? close - cloud_top : close < cloud_bottom ? cloud_bottom - close : 0
    const strengthRatio = cloudThickness > 0 ? priceToCloudDistance / cloudThickness : 0

    // 雲の位置と強度を詳細に分析
    if (close > cloud_top) {
      if (tenkan > kijun && tenkan > close) {
        return {
          status: "超強気",
          color: "emerald",
          position: "雲上抜け",
          strength: Math.min(100, strengthRatio * 50 + 50),
          description: "価格・転換線共に雲上で上昇トレンド",
        }
      } else if (tenkan > kijun) {
        return {
          status: "強気",
          color: "green",
          position: "雲上",
          strength: Math.min(100, strengthRatio * 40 + 40),
          description: "価格が雲上で転換線>基準線",
        }
      } else {
        return {
          status: "弱含み",
          color: "yellow",
          position: "雲上警戒",
          strength: Math.min(100, strengthRatio * 30 + 20),
          description: "雲上だが転換線<基準線で注意",
        }
      }
    } else if (close < cloud_bottom) {
      if (tenkan < kijun && tenkan < close) {
        return {
          status: "超弱気",
          color: "rose",
          position: "雲下抜け",
          strength: Math.min(100, strengthRatio * 50 + 50),
          description: "価格・転換線共に雲下で下降トレンド",
        }
      } else if (tenkan < kijun) {
        return {
          status: "弱気",
          color: "red",
          position: "雲下",
          strength: Math.min(100, strengthRatio * 40 + 40),
          description: "価格が雲下で転換線<基準線",
        }
      } else {
        return {
          status: "反発期待",
          color: "orange",
          position: "雲下反発",
          strength: Math.min(100, strengthRatio * 30 + 20),
          description: "雲下だが転換線>基準線で反発の可能性",
        }
      }
    } else {
      // 雲の中
      const cloudPosition = ((close - cloud_bottom) / cloudThickness) * 100
      if (cloudPosition > 70) {
        return {
          status: "雲上抜け待ち",
          color: "blue",
          position: "雲上部",
          strength: cloudPosition,
          description: "雲の上部で上抜けを狙う局面",
        }
      } else if (cloudPosition < 30) {
        return {
          status: "雲下抜け警戒",
          color: "purple",
          position: "雲下部",
          strength: 100 - cloudPosition,
          description: "雲の下部で下抜けに注意",
        }
      } else {
        return {
          status: "雲中もみ合い",
          color: "gray",
          position: "雲中央",
          strength: 50,
          description: "雲の中央でもみ合い継続",
        }
      }
    }
  }

  const getSignalColors = (color: string) => {
    switch (color) {
      case "emerald":
        return "bg-emerald-500/30 text-emerald-200 border-emerald-400/50 shadow-lg shadow-emerald-500/20"
      case "green":
        return "bg-green-500/30 text-green-200 border-green-400/50 shadow-lg shadow-green-500/20"
      case "yellow":
        return "bg-yellow-500/30 text-yellow-200 border-yellow-400/50 shadow-lg shadow-yellow-500/20"
      case "orange":
        return "bg-orange-500/30 text-orange-200 border-orange-400/50 shadow-lg shadow-orange-500/20"
      case "red":
        return "bg-red-500/30 text-red-200 border-red-400/50 shadow-lg shadow-red-500/20"
      case "rose":
        return "bg-rose-500/30 text-rose-200 border-rose-400/50 shadow-lg shadow-rose-500/20"
      case "blue":
        return "bg-blue-500/30 text-blue-200 border-blue-400/50 shadow-lg shadow-blue-500/20"
      case "purple":
        return "bg-purple-500/30 text-purple-200 border-purple-400/50 shadow-lg shadow-purple-500/20"
      default:
        return "bg-gray-500/30 text-gray-200 border-gray-400/50 shadow-lg shadow-gray-500/20"
    }
  }

  // 最新の市場状況
  const latestData = tableData[tableData.length - 1]
  const currentAnalysis = latestData
    ? getCloudAnalysis(
        latestData.Close,
        latestData.tenkan,
        latestData.kijun,
        latestData.cloud_top,
        latestData.cloud_bottom,
      )
    : { status: "データなし", color: "gray", position: "不明", strength: 0, description: "データが不足しています" }

  return (
    <div className="space-y-6">
      <div className="premium-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">一目均衡表 雲分析 ({data.meta.ticker})</h3>
          <div
            className={`px-4 py-2 rounded-xl font-bold text-sm border backdrop-blur-sm ${getSignalColors(currentAnalysis.color)}`}
          >
            {currentAnalysis.status}
          </div>
        </div>

        {latestData && (
          <div className="space-y-6">
            {/* Cloud Position Visualization */}
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-300 font-medium">雲との位置関係</span>
                <span className="text-sm text-slate-400">{currentAnalysis.position}</span>
              </div>

              <div className="relative h-8 bg-slate-700 rounded-lg overflow-hidden">
                {/* Cloud visualization */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20"></div>
                <div className="absolute top-0 left-0 right-0 h-1 bg-purple-400/50"></div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400/50"></div>

                {/* Price position indicator */}
                <div
                  className="absolute w-3 h-3 bg-white rounded-full border-2 border-yellow-400 shadow-lg transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left:
                      latestData.Close > latestData.cloud_top
                        ? "85%"
                        : latestData.Close < latestData.cloud_bottom
                          ? "15%"
                          : `${30 + ((latestData.Close - latestData.cloud_bottom) / (latestData.cloud_top - latestData.cloud_bottom)) * 40}%`,
                    top: "50%",
                  }}
                ></div>
              </div>

              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>雲下 (弱気)</span>
                <span>雲中 (もみ合い)</span>
                <span>雲上 (強気)</span>
              </div>
            </div>

            {/* Signal Strength */}
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-300 font-medium">シグナル強度</span>
                <span className="text-sm font-mono text-white">{currentAnalysis.strength.toFixed(0)}%</span>
              </div>

              <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                    currentAnalysis.strength > 70
                      ? "bg-gradient-to-r from-green-500 to-emerald-400"
                      : currentAnalysis.strength > 40
                        ? "bg-gradient-to-r from-yellow-500 to-orange-400"
                        : "bg-gradient-to-r from-red-500 to-rose-400"
                  }`}
                  style={{ width: `${currentAnalysis.strength}%` }}
                ></div>
              </div>

              <p className="text-sm text-slate-400 mt-2">{currentAnalysis.description}</p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-sm text-slate-400 mb-1">現在価格</div>
                <div className="text-lg font-mono font-bold text-white">¥{latestData.Close.toFixed(0)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-blue-400 mb-1">転換線</div>
                <div className="text-lg font-mono font-bold text-blue-300">¥{latestData.tenkan.toFixed(0)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-red-400 mb-1">基準線</div>
                <div className="text-lg font-mono font-bold text-red-300">¥{latestData.kijun.toFixed(0)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-green-400 mb-1">先行スパンA</div>
                <div className="text-lg font-mono font-bold text-green-300">¥{latestData.ssa.toFixed(0)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-orange-400 mb-1">先行スパンB</div>
                <div className="text-lg font-mono font-bold text-orange-300">¥{latestData.ssb.toFixed(0)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-purple-400 mb-1">雲の厚さ</div>
                <div className="text-lg font-mono font-bold text-purple-300">
                  ¥{Math.abs(latestData.cloud_top - latestData.cloud_bottom).toFixed(0)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="premium-card rounded-2xl p-6 overflow-hidden">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2">一目均衡表 完全データ（全{tableData.length}日分）</h3>
          <p className="text-slate-400">各指標の日次推移と雲分析 - 全期間のデータを表示</p>
        </div>

        <div className="overflow-x-auto max-h-96">
          <Table>
            <TableHeader className="sticky top-0 bg-slate-900/95 backdrop-blur-sm">
              <TableRow className="border-slate-700/50 hover:bg-slate-800/20">
                <TableHead className="text-slate-300 font-bold border-r border-slate-700/50">日付</TableHead>
                <TableHead className="text-slate-300 font-bold text-center border-r border-slate-700/50">
                  終値
                </TableHead>
                <TableHead className="text-blue-300 font-bold text-center border-r border-slate-700/50">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    転換線
                  </div>
                </TableHead>
                <TableHead className="text-red-300 font-bold text-center border-r border-slate-700/50">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    基準線
                  </div>
                </TableHead>
                <TableHead className="text-green-300 font-bold text-center border-r border-slate-700/50">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    先行スパンA
                  </div>
                </TableHead>
                <TableHead className="text-orange-300 font-bold text-center border-r border-slate-700/50">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    先行スパンB
                  </div>
                </TableHead>
                <TableHead className="text-purple-300 font-bold text-center border-r border-slate-700/50">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    雲上限
                  </div>
                </TableHead>
                <TableHead className="text-cyan-300 font-bold text-center border-r border-slate-700/50">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                    雲下限
                  </div>
                </TableHead>
                <TableHead className="text-slate-300 font-bold text-center border-r border-slate-700/50">
                  雲厚
                </TableHead>
                <TableHead className="text-slate-300 font-bold text-center">雲分析</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => {
                const analysis = getCloudAnalysis(row.Close, row.tenkan, row.kijun, row.cloud_top, row.cloud_bottom)
                const isLatest = index === tableData.length - 1
                const cloudThickness = Math.abs(row.cloud_top - row.cloud_bottom)

                return (
                  <TableRow
                    key={row.date}
                    className={`border-slate-800/30 hover:bg-slate-800/20 transition-all duration-300 ${
                      isLatest ? "bg-slate-700/30 ring-1 ring-blue-500/30" : ""
                    }`}
                  >
                    <TableCell className="font-mono text-slate-300 border-r border-slate-800/30">
                      {new Date(row.date).toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="font-mono text-white text-center font-bold border-r border-slate-800/30">
                      ¥{row.Close.toFixed(0)}
                    </TableCell>
                    <TableCell className="font-mono text-blue-300 text-center border-r border-slate-800/30">
                      ¥{row.tenkan.toFixed(0)}
                    </TableCell>
                    <TableCell className="font-mono text-red-300 text-center border-r border-slate-800/30">
                      ¥{row.kijun.toFixed(0)}
                    </TableCell>
                    <TableCell className="font-mono text-green-300 text-center border-r border-slate-800/30">
                      ¥{row.ssa.toFixed(0)}
                    </TableCell>
                    <TableCell className="font-mono text-orange-300 text-center border-r border-slate-800/30">
                      ¥{row.ssb.toFixed(0)}
                    </TableCell>
                    <TableCell className="font-mono text-purple-300 text-center border-r border-slate-800/30">
                      ¥{row.cloud_top.toFixed(0)}
                    </TableCell>
                    <TableCell className="font-mono text-cyan-300 text-center border-r border-slate-800/30">
                      ¥{row.cloud_bottom.toFixed(0)}
                    </TableCell>
                    <TableCell className="font-mono text-slate-300 text-center border-r border-slate-800/30">
                      <div className="flex items-center justify-center gap-1">
                        <div
                          className={`w-2 h-4 rounded-sm ${
                            cloudThickness > 100 ? "bg-red-400" : cloudThickness > 50 ? "bg-yellow-400" : "bg-green-400"
                          }`}
                        ></div>
                        <span className="text-xs">¥{cloudThickness.toFixed(0)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold border backdrop-blur-sm ${getSignalColors(analysis.color)}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            analysis.color === "emerald"
                              ? "bg-emerald-400"
                              : analysis.color === "green"
                                ? "bg-green-400"
                                : analysis.color === "yellow"
                                  ? "bg-yellow-400"
                                  : analysis.color === "orange"
                                    ? "bg-orange-400"
                                    : analysis.color === "red"
                                      ? "bg-red-400"
                                      : analysis.color === "rose"
                                        ? "bg-rose-400"
                                        : analysis.color === "blue"
                                          ? "bg-blue-400"
                                          : analysis.color === "purple"
                                            ? "bg-purple-400"
                                            : "bg-gray-400"
                          }`}
                        ></div>
                        <div className="text-center">
                          <div>{analysis.status}</div>
                          <div className="text-xs opacity-75">{analysis.position}</div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 一目均衡表の解説 */}
      <div className="premium-card rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">一目均衡表の見方</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-blue-300 font-bold">転換線</span>
              <span className="text-slate-400">: 過去9日間の高値と安値の平均</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-red-300 font-bold">基準線</span>
              <span className="text-slate-400">: 過去26日間の高値と安値の平均</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-purple-300 font-bold">雲上限</span>
              <span className="text-slate-400">: 先行スパンAとBの高い方</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
              <span className="text-cyan-300 font-bold">雲下限</span>
              <span className="text-slate-400">: 先行スパンAとBの低い方</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-green-300 font-bold">先行スパンA</span>
              <span className="text-slate-400">: (転換線+基準線)÷2を26日先行</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-orange-300 font-bold">先行スパンB</span>
              <span className="text-slate-400">: 過去52日間の高安平均を26日先行</span>
            </div>
            <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-300 text-sm">
                <strong>データ期間</strong>: {data.meta.period} ({data.meta.interval}) - 全{tableData.length}
                日分のデータを表示
              </span>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-300 text-sm">
                <strong>雲</strong>: 先行スパンAとBに囲まれた領域。価格が雲の上なら強気、下なら弱気
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
