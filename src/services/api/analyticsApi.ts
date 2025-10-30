import type { AnalyticsOverview, TimeSeriesData, DistributionData, HeatmapPoint } from '../../types/analytics'
import {
  mockAnalyticsOverview,
  mockTimeSeriesData,
  mockDistributionData,
  mockHeatmapData,
} from '../mock/mockAnalytics'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const analyticsApi = {
  getOverview: async (): Promise<AnalyticsOverview> => {
    await delay(400)
    return mockAnalyticsOverview
  },

  getTimeSeries: async (_days: number = 1): Promise<Array<TimeSeriesData>> => {
    await delay(400)
    return mockTimeSeriesData
  },

  getDistribution: async (): Promise<DistributionData> => {
    await delay(300)
    return mockDistributionData
  },

  getHeatmap: async (): Promise<Array<HeatmapPoint>> => {
    await delay(400)
    return mockHeatmapData
  },
}

