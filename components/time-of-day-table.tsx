interface TimeOfDayData {
  weekday: string
  mode_time: string
  coverage: number
  n: number
}

interface TimeOfDayTableProps {
  data: {
    high: TimeOfDayData[]
    low: TimeOfDayData[]
  }
}

export function TimeOfDayTable({ data }: TimeOfDayTableProps) {
  const formatPercentage = (num: number) => `${(num * 100).toFixed(1)}%`

  // 英語の曜日を日本語に変換
  const translateWeekday = (weekday: string) => {
    const translation: { [key: string]: string } = {
      Monday: "月曜日",
      Tuesday: "火曜日",
      Wednesday: "水曜日",
      Thursday: "木曜日",
      Friday: "金曜日",
      Saturday: "土曜日",
      Sunday: "日曜日",
    }
    return translation[weekday] || weekday
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* 高値データ */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-green-500 rounded-full glow-effect shadow-lg shadow-green-500/50"></div>
          <h3 className="text-xl font-bold text-white">高値時刻データ</h3>
          <div className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium border border-green-500/30">
            HIGH
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-4 px-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  曜日
                </th>
                <th className="text-left py-4 px-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  最頻時刻
                </th>
                <th className="text-right py-4 px-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  カバレッジ
                </th>
                <th className="text-right py-4 px-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  サンプル数
                </th>
              </tr>
            </thead>
            <tbody>
              {data.high.map((row) => {
                const isHighCoverage = row.coverage > 0.3
                return (
                  <tr
                    key={`high-${row.weekday}`}
                    className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-all duration-300"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${isHighCoverage ? "bg-green-500" : "bg-yellow-500"}`}
                        ></div>
                        <span className="text-white font-medium">{translateWeekday(row.weekday)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg font-mono font-bold border border-blue-500/30">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                        {row.mode_time}
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 text-green-400 font-mono font-bold text-lg">
                      {formatPercentage(row.coverage)}
                    </td>
                    <td className="text-right py-4 px-4 text-cyan-400 font-mono font-semibold">{row.n}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 安値データ */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-red-500 rounded-full glow-effect shadow-lg shadow-red-500/50"></div>
          <h3 className="text-xl font-bold text-white">安値時刻データ</h3>
          <div className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm font-medium border border-red-500/30">
            LOW
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-4 px-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  曜日
                </th>
                <th className="text-left py-4 px-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  最頻時刻
                </th>
                <th className="text-right py-4 px-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  カバレッジ
                </th>
                <th className="text-right py-4 px-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  サンプル数
                </th>
              </tr>
            </thead>
            <tbody>
              {data.low.map((row) => {
                const isHighCoverage = row.coverage > 0.3
                return (
                  <tr
                    key={`low-${row.weekday}`}
                    className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-all duration-300"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${isHighCoverage ? "bg-red-500" : "bg-yellow-500"}`}
                        ></div>
                        <span className="text-white font-medium">{translateWeekday(row.weekday)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg font-mono font-bold border border-purple-500/30">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                        {row.mode_time}
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 text-red-400 font-mono font-bold text-lg">
                      {formatPercentage(row.coverage)}
                    </td>
                    <td className="text-right py-4 px-4 text-cyan-400 font-mono font-semibold">{row.n}</td>
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
