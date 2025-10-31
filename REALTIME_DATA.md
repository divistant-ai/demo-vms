# Realtime Data System

## Overview
Sistem realtime data telah diimplementasikan untuk membuat seluruh data dummy menjadi dinamis dan terus update secara otomatis.

## Fitur Realtime

### 1. Camera Data Updates
- **Status Update**: Status kamera berubah secara random (online/offline) dengan probabilitas 1%
- **Last Seen**: Timestamp `lastSeen` diupdate setiap 3 detik untuk semua kamera yang online
- **Auto Refresh**: Data kamera di-refresh otomatis di semua halaman

### 2. Incident Data Updates
- **Status Progress**: Incident yang masih active (acknowledged/in_progress) akan berubah statusnya secara otomatis
  - acknowledged → in_progress (5% chance)
  - in_progress → resolved (30% chance dari 5%)
- **New Incidents**: Incident baru dibuat secara random (2% chance) setiap 3 detik
- **Auto Cleanup**: Maksimal 100 incidents disimpan, yang lama akan dihapus otomatis

### 3. Analytics Data Updates
- **Overview Metrics**: 
  - Total incidents 24h: Variasi ±5
  - Total incidents 7d: Variasi ±20
  - Active/Offline cameras: Real count dari camera data
  - Response time: Variasi ±2 menit
  - System uptime: Variasi ±0.5%
- **Time Series**: Data point baru ditambahkan setiap 1 jam
- **Auto Refresh**: Charts dan metrics diupdate setiap 3 detik

## Implementasi

### Service Layer
File: `src/services/realtime/realtimeDataService.ts`

```typescript
class RealtimeDataService {
  start()      // Mulai update loop
  stop()       // Stop update loop
  subscribe()  // Subscribe untuk notifikasi update
}
```

### Hook Layer
File: `src/hooks/useRealtimeData.ts`

```typescript
const { updateCounter } = useRealtimeData()
```

Hook ini:
- Otomatis start service saat component mount
- Mengembalikan `updateCounter` yang increment setiap ada update
- Auto cleanup saat component unmount

### Integration
Semua halaman utama telah diintegrasikan dengan realtime data:

1. **DashboardPage**: Analytics dan alerts realtime
2. **CamerasPage**: Status kamera dan metrics realtime
3. **IncidentsPage**: Incident list realtime dengan new incidents
4. **MapPage**: Camera markers dan heatmap realtime
5. **AnalyticsPage**: Charts dan statistics realtime
6. **CameraManagementPage**: Camera CRUD dengan realtime updates

### Query Integration
React Query digunakan dengan `updateCounter` sebagai dependency:

```typescript
const { data } = useQuery({
  queryKey: ['cameras', updateCounter],
  queryFn: () => cameraApi.getAll(),
})
```

Setiap kali `updateCounter` berubah, query akan refetch data secara otomatis.

## Update Interval
- **Default**: 3 detik (3000ms)
- Dapat diubah di `realtimeDataService.ts` line 17

## Performance
- **Lightweight**: Hanya update data yang berubah
- **Efficient**: React Query caching mencegah unnecessary re-renders
- **Scalable**: Service pattern memungkinkan easy scaling

## Testing
1. Buka aplikasi di browser
2. Perhatikan:
   - Dashboard metrics berubah setiap 3 detik
   - Camera status kadang berubah online/offline
   - Incident baru muncul secara random
   - Charts diupdate dengan data baru
   - Map markers reflect camera status changes

## Future Enhancements
- [ ] WebSocket integration untuk real server data
- [ ] Configurable update intervals per data type
- [ ] Pause/Resume functionality
- [ ] Real-time notifications dengan toast
- [ ] Performance monitoring dashboard


