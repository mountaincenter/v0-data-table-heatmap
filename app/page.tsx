import { VolatilityTable } from "@/components/volatility-table"
import { VolatilityHeatmap } from "@/components/volatility-heatmap"
import { TimeOfDayTable } from "@/components/time-of-day-table"
import { IchimokuTable } from "@/components/ichimoku-table"
import { BollingerBandsTable } from "@/components/bollinger-bands-table"
import { MACDTable } from "@/components/macd-table"
import ichimokuData from "@/data/ichimoku-data.json"
import bbData from "@/data/bb-data.json"
import macdData from "@/data/macd-data.json"

const financialData = {
  meta: {
    ticker: "3350.T",
    generated_at_utc: "2025-09-26T02:42:37.187990+00:00",
    notes: "demo export (DOW=日足ボラ、TOD=5m 時刻要約)",
  },
  dow_volatility: {
    short: [
      {
        曜日: "月",
        n: 6,
        median_vol: 60.0,
        iqr_low: 49.25,
        iqr_high: 69.25,
        mean_vol: 60.666666666666664,
      },
      {
        曜日: "金",
        n: 9,
        median_vol: 60.0,
        iqr_low: 40.0,
        iqr_high: 84.0,
        mean_vol: 65.44444444444444,
      },
      {
        曜日: "木",
        n: 8,
        median_vol: 59.0,
        iqr_low: 49.25,
        iqr_high: 80.25,
        mean_vol: 67.125,
      },
      {
        曜日: "水",
        n: 8,
        median_vol: 51.5,
        iqr_low: 47.5,
        iqr_high: 63.25,
        mean_vol: 64.0,
      },
      {
        曜日: "火",
        n: 7,
        median_vol: 46.0,
        iqr_low: 35.0,
        iqr_high: 94.0,
        mean_vol: 67.71428571428571,
      },
    ],
    mid: [
      {
        曜日: "木",
        n: 12,
        median_vol: 71.0,
        iqr_low: 58.0,
        iqr_high: 84.0,
        mean_vol: 72.5,
      },
      {
        曜日: "金",
        n: 13,
        median_vol: 66.0,
        iqr_low: 57.0,
        iqr_high: 77.0,
        mean_vol: 66.6923076923077,
      },
      {
        曜日: "月",
        n: 9,
        median_vol: 63.0,
        iqr_low: 59.0,
        iqr_high: 82.0,
        mean_vol: 70.44444444444444,
      },
      {
        曜日: "水",
        n: 12,
        median_vol: 54.0,
        iqr_low: 47.5,
        iqr_high: 86.5,
        mean_vol: 67.5,
      },
      {
        曜日: "火",
        n: 11,
        median_vol: 54.0,
        iqr_low: 40.5,
        iqr_high: 119.5,
        mean_vol: 83.45454545454545,
      },
    ],
    effect_size: {
      short: 0.23728813559322035,
      mid: 0.2698412698412698,
    },
  },
  tod_5m: {
    high: [
      {
        weekday: "Friday",
        mode_time: "09:05",
        coverage: 0.38461538461538464,
        n: 13,
      },
      {
        weekday: "Monday",
        mode_time: "09:05",
        coverage: 0.2222222222222222,
        n: 9,
      },
      {
        weekday: "Thursday",
        mode_time: "09:10",
        coverage: 0.23076923076923078,
        n: 13,
      },
      {
        weekday: "Tuesday",
        mode_time: "09:00",
        coverage: 0.25,
        n: 12,
      },
      {
        weekday: "Wednesday",
        mode_time: "09:05",
        coverage: 0.23076923076923078,
        n: 13,
      },
    ],
    low: [
      {
        weekday: "Friday",
        mode_time: "15:20",
        coverage: 0.15384615384615385,
        n: 13,
      },
      {
        weekday: "Monday",
        mode_time: "09:00",
        coverage: 0.2222222222222222,
        n: 9,
      },
      {
        weekday: "Thursday",
        mode_time: "09:05",
        coverage: 0.15384615384615385,
        n: 13,
      },
      {
        weekday: "Tuesday",
        mode_time: "09:05",
        coverage: 0.16666666666666666,
        n: 12,
      },
      {
        weekday: "Wednesday",
        mode_time: "09:05",
        coverage: 0.15384615384615385,
        n: 13,
      },
    ],
  },
}

export default function Home() {
  const currentVolatility = financialData.dow_volatility.short[0]?.mean_vol || 0
  const previousVolatility = financialData.dow_volatility.short[1]?.mean_vol || 0
  const volatilityChange = currentVolatility - previousVolatility
  const volatilityChangePercent = previousVolatility
    ? ((volatilityChange / previousVolatility) * 100).toFixed(2)
    : "0.00"
  const isPositive = volatilityChange >= 0

  return (
    <div className="space-y-8 p-8 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="premium-card rounded-3xl p-10 floating-element">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Stock Info Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center glow-effect shadow-2xl">
                <span className="text-white font-bold text-2xl">{financialData.meta.ticker.charAt(0)}</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  {financialData.meta.ticker}
                </h1>
                <p className="text-slate-400 font-medium text-lg">株式データ分析ダッシュボード</p>
              </div>
            </div>
          </div>

          {/* Premium Volatility Display Section */}
          <div className="text-right lg:text-right">
            <div className="price-display rounded-2xl p-6 space-y-3">
              <div className="text-6xl font-bold text-white tracking-tight font-mono">
                {currentVolatility.toFixed(1)}%
              </div>
              <div className="flex items-center justify-end gap-3">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-bold backdrop-blur-sm ${
                    isPositive
                      ? "bg-green-500/30 text-green-300 border border-green-400/50 shadow-lg shadow-green-500/20"
                      : "bg-red-500/30 text-red-300 border border-red-400/50 shadow-lg shadow-red-500/20"
                  }`}
                >
                  <span className={`text-lg ${isPositive ? "text-green-300" : "text-red-300"}`}>
                    {isPositive ? "↗" : "↘"}
                  </span>
                  {isPositive ? "+" : ""}
                  {volatilityChange.toFixed(2)}%
                </div>
                <div className={`text-2xl font-bold ${isPositive ? "text-green-300" : "text-red-300"}`}>
                  {isPositive ? "+" : ""}
                  {volatilityChangePercent}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Market Status */}
        <div className="mt-8 pt-8 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full market-pulse shadow-lg shadow-green-400/50"></div>
              <span className="text-slate-300 font-medium">データ分析中</span>
              <div className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium border border-green-500/30">
                LIVE
              </div>
            </div>
            <div className="text-slate-400 font-mono">
              最終更新: {new Date(financialData.meta.generated_at_utc).toLocaleString("ja-JP")}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        <section className="chart-container rounded-3xl border-0 shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">ボリンジャーバンド分析</h2>
            <p className="text-slate-400 text-lg">価格のボラティリティとトレンド分析</p>
          </div>
          <BollingerBandsTable data={bbData} />
        </section>

        <section className="chart-container rounded-3xl border-0 shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">MACD分析</h2>
            <p className="text-slate-400 text-lg">モメンタムとトレンド転換点の分析</p>
          </div>
          <MACDTable data={macdData} />
        </section>

        <section className="chart-container rounded-3xl border-0 shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">一目均衡表分析</h2>
            <p className="text-slate-400 text-lg">テクニカル指標による市場トレンド分析</p>
          </div>
          <IchimokuTable data={ichimokuData} />
        </section>

        {/* 曜日別ボラティリティテーブル */}
        <section className="chart-container rounded-3xl border-0 shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">曜日別ボラティリティ統計</h2>
            <p className="text-slate-400 text-lg">期間別（Short/Mid）の詳細分析データ</p>
          </div>
          <VolatilityTable data={financialData.dow_volatility} />
        </section>

        {/* ボラティリティヒートマップ */}
        <section className="chart-container rounded-3xl border-0 shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">ボラティリティヒートマップ</h2>
            <p className="text-slate-400 text-lg">曜日と期間の組み合わせによる視覚的分析</p>
          </div>
          <VolatilityHeatmap data={financialData.dow_volatility} />
        </section>

        {/* 時刻別データテーブル */}
        <section className="table-premium rounded-3xl border-0 shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">時刻別高値・安値データ</h2>
            <p className="text-slate-400 text-lg">5分足データによる時刻別パターン分析</p>
          </div>
          <TimeOfDayTable data={financialData.tod_5m} />
        </section>
      </div>
    </div>
  )
}
