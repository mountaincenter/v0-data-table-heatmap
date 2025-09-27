interface VolatilityData {
  曜日: string
  n: number
  median_vol: number
  iqr_low: number
  iqr_high: number
  mean_vol: number
}

interface VolatilityTableProps {
  data: {
    short: VolatilityData[]
    mid: VolatilityData[]
    effect_size: {
      short: number
      mid: number
    }
  }
}

export function VolatilityTable({ data }: VolatilityTableProps) {
  const formatNumber = (num: number) => num.toFixed(2)

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Short期間データ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Short期間</h3>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            Effect Size: {formatNumber(data.effect_size.short)}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-4 px-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  曜日
                </th>
                <th className="text-right py-4 px-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  サンプル数
                </th>
                <th className="text-right py-4 px-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  中央値
                </th>
                <th className="text-right py-4 px-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  平均値
                </th>
                <th className="text-right py-4 px-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  IQR範囲
                </th>
              </tr>
            </thead>
            <tbody>
              {data.short.map((row, index) => {
                const isHighVolatility = row.mean_vol > 60
                return (
                  <tr
                    key={row.曜日}
                    className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-all duration-300"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${isHighVolatility ? "bg-red-500" : "bg-green-500"}`}
                        ></div>
                        <span className="text-white font-medium">{row.曜日}曜日</span>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 text-blue-400 font-mono font-semibold">{row.n}</td>
                    <td className="text-right py-4 px-4 text-cyan-400 font-mono font-semibold">
                      {formatNumber(row.median_vol)}%
                    </td>
                    <td className="text-right py-4 px-4 text-white font-mono font-bold text-lg">
                      {formatNumber(row.mean_vol)}%
                    </td>
                    <td className="text-right py-4 px-4 text-purple-400 font-mono font-semibold">
                      {formatNumber(row.iqr_low)} - {formatNumber(row.iqr_high)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mid期間データ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Mid期間</h3>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium border border-green-500/30">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Effect Size: {formatNumber(data.effect_size.mid)}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-4 px-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  曜日
                </th>
                <th className="text-right py-4 px-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  サンプル数
                </th>
                <th className="text-right py-4 px-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  中央値
                </th>
                <th className="text-right py-4 px-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  平均値
                </th>
                <th className="text-right py-4 px-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  IQR範囲
                </th>
              </tr>
            </thead>
            <tbody>
              {data.mid.map((row, index) => {
                const isHighVolatility = row.mean_vol > 60
                return (
                  <tr
                    key={row.曜日}
                    className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-all duration-300"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${isHighVolatility ? "bg-red-500" : "bg-green-500"}`}
                        ></div>
                        <span className="text-white font-medium">{row.曜日}曜日</span>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 text-blue-400 font-mono font-semibold">{row.n}</td>
                    <td className="text-right py-4 px-4 text-cyan-400 font-mono font-semibold">
                      {formatNumber(row.median_vol)}%
                    </td>
                    <td className="text-right py-4 px-4 text-white font-mono font-bold text-lg">
                      {formatNumber(row.mean_vol)}%
                    </td>
                    <td className="text-right py-4 px-4 text-purple-400 font-mono font-semibold">
                      {formatNumber(row.iqr_low)} - {formatNumber(row.iqr_high)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
