# Realtime Timestamp Update

## Overview
Timestamp di chart sekarang **update secara realtime** setiap 2 detik, membuat chart terlihat seperti data streaming yang terus berjalan.

## Implementasi

### Timestamp Generation Strategy

```typescript
// Setiap 2 detik, semua timestamp di-regenerate
mockTimeSeriesData.forEach((dataPoint, index) => {
  const now = new Date()
  // Spacing 1 jam antar data point
  const baseTime = now.getTime() - ((length - index - 1) * 3600000)
  dataPoint.timestamp = new Date(baseTime)
})
```

### Visual Effect

**Sebelum:**
```
10:00 AM  10:01 AM  10:02 AM  10:03 AM  (static)
   ↓         ↓         ↓         ↓
[Data]    [Data]    [Data]    [Data]
```

**Sekarang:**
```
Update 1: 10:00 AM  11:00 AM  12:00 PM  01:00 PM
          [Data]    [Data]    [Data]    [Data]
          
Update 2: 10:00 AM  11:00 AM  12:00 PM  01:00 PM  (2 detik kemudian)
          [Data]    [Data]    [Data]    [Data]
          
Update 3: 10:00 AM  11:00 AM  12:00 PM  01:00 PM  (4 detik kemudian)
          [Data]    [Data]    [Data]    [Data]
```

Timestamp terus maju mengikuti waktu real, membuat chart terlihat **live streaming**.

## Update Pattern

### Setiap 2 Detik:
1. ✅ **Regenerate Timestamps**: Semua timestamp di-update ke waktu current
2. ✅ **Update Values**: Data values berubah dengan variasi kecil
3. ✅ **Smooth Animation**: Chart bergerak smooth tanpa jump

### Setiap 10 Detik:
1. ✅ **Add New Point**: Data point baru ditambahkan di kanan
2. ✅ **Remove Old Point**: Data point paling lama dihapus di kiri
3. ✅ **Shift Effect**: Chart bergeser ke kiri (time-lapse effect)

## Chart Behavior

### Dashboard Page
- **Time Format**: `HH:mm` (contoh: 14:30)
- **Spacing**: 1 jam antar data point
- **Window**: 24 data points (24 jam)

### Analytics Page
- **Time Format**: `MMM dd HH:mm` (contoh: Oct 30 14:30)
- **Spacing**: 1 jam antar data point
- **Window**: 24 data points

## Technical Details

### Type Definition
```typescript
export type TimeSeriesData = {
  timestamp: Date          // Update setiap 2 detik
  traffic_incidents: number
  flood_alerts: number
  intrusions: number
  total: number
  _lastAddTime?: number   // Internal tracker untuk new point
}
```

### Files Modified
1. `src/services/realtime/realtimeDataService.ts` - Timestamp generation logic
2. `src/types/analytics.ts` - Added `_lastAddTime` field

## User Experience

### Before (Static Timestamps)
- ❌ Waktu tidak berubah
- ❌ Terlihat seperti data lama
- ❌ Tidak ada sense of "live"

### After (Realtime Timestamps)
- ✅ Waktu terus update setiap 2 detik
- ✅ Terlihat seperti live streaming
- ✅ Chart "bergerak" mengikuti waktu
- ✅ Data values juga berubah smooth

## Testing

1. Buka Dashboard atau Analytics page
2. Perhatikan timestamp di X-axis chart
3. Setiap 2 detik, waktu akan maju
4. Data values juga berubah smooth
5. Setiap 10 detik, chart bergeser ke kiri

## Performance

- **Efficient**: Hanya regenerate timestamp, bukan fetch data baru
- **Smooth**: React efficiently re-render chart
- **Memory Safe**: Old data points dihapus otomatis
- **CPU Light**: Simple date calculation

## Future Enhancements

- [ ] Configurable time spacing (5 min, 15 min, 1 hour)
- [ ] Pause/Resume timestamp updates
- [ ] Custom time format per chart
- [ ] Timezone support
- [ ] Historical playback mode

