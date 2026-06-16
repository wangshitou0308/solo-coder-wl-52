import { useState, useMemo } from "react";
import {
  Map as MapIcon,
  Grid3X3,
  MapPin,
  User,
  CalendarDays,
  Image as ImageIcon,
  Layers,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useStore } from "@/store/useStore";
import { formatDate } from "@/utils/format";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

type TabType = "category" | "map";

const envelopeIcon = L.divIcon({
  className: "custom-marker",
  html: `
    <div style="
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #EC7070, #C0392B);
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(192, 57, 43, 0.4);
      border: 3px solid white;
    ">
      <svg style="transform: rotate(45deg); width: 16px; height: 16px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.54l-3.66-1.972m0 0a2.25 2.25 0 01-2.27 0l-3.661 1.972m7.93-5.018a2.251 2.251 0 002.27 0M3.665 7.578l3.66 1.972m0 0a2.25 2.25 0 002.27 0l3.661-1.972m-9.591 0l3.66 1.972" />
      </svg>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const stampIcon = L.divIcon({
  className: "custom-marker",
  html: `
    <div style="
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #EFC44B, #B07E0F);
      border-radius: 6px;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(176, 126, 15, 0.4);
      border: 3px solid white;
      position: relative;
    ">
      <div style="
        position: absolute;
        inset: -3px;
        background: 
          radial-gradient(circle at 3px 3px, transparent 3px, white 3px) 0 0 / 8px 8px,
          radial-gradient(circle at 3px 3px, transparent 3px, #B07E0F 3px) 0 0 / 8px 8px;
        opacity: 0.3;
        border-radius: 6px;
      "></div>
      <svg style="transform: rotate(45deg); width: 16px; height: 16px; color: white; position: relative; z-index: 1;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

export default function Postcards() {
  const [activeTab, setActiveTab] = useState<TabType>("category");
  const letters = useStore((s) => s.letters);
  const getPostcardLocations = useStore((s) => s.getPostcardLocations);

  const locations = useMemo(() => getPostcardLocations(), [getPostcardLocations, letters]);

  const totalPostcards = useMemo(
    () => locations.reduce((sum, loc) => sum + loc.count, 0),
    [locations]
  );

  const validMarkers = useMemo(
    () =>
      locations.filter(
        (loc) =>
          loc.latitude !== null &&
          loc.latitude !== undefined &&
          loc.longitude !== null &&
          loc.longitude !== undefined
      ),
    [locations]
  );

  const mapCenter: [number, number] = useMemo(() => {
    if (validMarkers.length === 0) return [30, 105];
    const avgLat =
      validMarkers.reduce((sum, loc) => sum + (loc.latitude || 0), 0) /
      validMarkers.length;
    const avgLng =
      validMarkers.reduce((sum, loc) => sum + (loc.longitude || 0), 0) /
      validMarkers.length;
    return [avgLat, avgLng];
  }, [validMarkers]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="section-title">
            <MapIcon className="w-7 h-7 text-parchment-700" />
            明信片专区
          </h1>
          <p className="mt-2 text-ink-500 text-sm ml-4">
            共 {totalPostcards} 张明信片 · {locations.length} 个城市
          </p>
        </div>
      </div>

      <div className="card-parchment p-1.5 inline-flex bg-parchment-100/70 rounded-2xl">
        <button
          onClick={() => setActiveTab("category")}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
            activeTab === "category"
              ? "bg-white text-ink-800 shadow-md"
              : "text-ink-500 hover:text-ink-700 hover:bg-white/50"
          )}
        >
          <Layers className="w-4 h-4" />
          分类浏览
        </button>
        <button
          onClick={() => setActiveTab("map")}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
            activeTab === "map"
              ? "bg-white text-ink-800 shadow-md"
              : "text-ink-500 hover:text-ink-700 hover:bg-white/50"
          )}
        >
          <MapIcon className="w-4 h-4" />
          地图视图
        </button>
      </div>

      {activeTab === "category" && (
        <div className="space-y-8">
          {locations.length === 0 ? (
            <div className="card-parchment p-16 text-center">
              <Grid3X3 className="w-14 h-14 text-ink-300 mx-auto mb-4" />
              <p className="text-ink-500 text-lg mb-2">还没有明信片记录</p>
              <p className="text-sm text-ink-400">去记录你的第一张旅行明信片吧</p>
            </div>
          ) : (
            locations.map((loc, idx) => (
              <section
                key={`${loc.country}-${loc.city}-${idx}`}
                className="space-y-4 animate-slide-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-end justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-parchment-500 to-parchment-700 text-white shadow-lg ring-4 ring-parchment-200/50">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-bold text-ink-800">
                        {loc.city}
                        <span className="text-ink-400 font-normal text-base ml-2">
                          {loc.country}
                        </span>
                      </h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-parchment-100 text-parchment-700 border border-parchment-300">
                          {loc.count} 张明信片
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {loc.postcards.map((postcard, pIdx) => (
                    <div
                      key={postcard.id}
                      className="card-parchment group overflow-hidden animate-stamp-in"
                      style={{
                        animationDuration: "400ms",
                        animationDelay: `${pIdx * 30}ms`,
                      }}
                    >
                      <div className="relative h-40 bg-gradient-to-br from-parchment-100 to-parchment-200 overflow-hidden">
                        {postcard.photos && postcard.photos.length > 0 ? (
                          <img
                            src={postcard.photos[0]}
                            alt={postcard.contact_city}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/60 backdrop-blur-sm mb-2">
                              <ImageIcon className="w-8 h-8 text-parchment-500" />
                            </div>
                            <span className="text-sm font-display text-parchment-700 font-medium">
                              {postcard.contact_city}
                            </span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <div
                            className={cn(
                              "w-12 h-14 rounded-md flex flex-col items-center justify-center text-white/90 shadow-md relative",
                              postcard.direction === "received"
                                ? "bg-gradient-to-br from-ink-500 to-ink-700"
                                : "bg-gradient-to-br from-stamp-400 to-stamp-600"
                            )}
                            style={{
                              clipPath:
                                "polygon(8% 0, 92% 0, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0 92%, 0 8%)",
                            }}
                          >
                            <span className="text-[10px] font-bold opacity-90">
                              {postcard.direction === "received" ? "收到" : "寄出"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-parchment-100 text-parchment-700 flex-shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-display font-semibold text-ink-800 truncate">
                              {postcard.contact_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-ink-500">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {formatDate(
                            postcard.direction === "received"
                              ? postcard.received_date
                              : postcard.sent_date
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      )}

      {activeTab === "map" && (
        <div className="card-parchment p-3 overflow-hidden">
          {validMarkers.length === 0 ? (
            <div className="h-[600px] flex flex-col items-center justify-center text-ink-400">
              <MapIcon className="w-16 h-16 mb-4 opacity-40" />
              <p className="text-lg">暂无可用坐标的明信片</p>
              <p className="text-sm mt-1">在记录明信片时填写地点坐标即可在地图上显示</p>
            </div>
          ) : (
            <MapContainer
              center={mapCenter}
              zoom={2}
              style={{ height: "600px", width: "100%" }}
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {validMarkers.map((loc) =>
                loc.postcards.map((postcard) => (
                  <Marker
                    key={`${postcard.id}-marker`}
                    position={[
                      postcard.contact_latitude || loc.latitude || 0,
                      postcard.contact_longitude || loc.longitude || 0,
                    ]}
                    icon={postcard.direction === "received" ? envelopeIcon : stampIcon}
                  >
                    <Popup>
                      <div className="min-w-[200px] p-1">
                        {postcard.photos && postcard.photos.length > 0 && (
                          <div className="mb-3 -mx-2 -mt-2 rounded-t-lg overflow-hidden">
                            <img
                              src={postcard.photos[0]}
                              alt={postcard.contact_city}
                              className="w-full h-32 object-cover"
                            />
                          </div>
                        )}
                        <div className="font-display font-bold text-ink-800 text-base mb-2">
                          {postcard.contact_city}
                          <span className="text-ink-400 font-normal text-sm ml-1">
                            · {postcard.contact_country}
                          </span>
                        </div>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex items-center gap-2 text-ink-600">
                            <User className="w-4 h-4 text-parchment-600" />
                            <span>{postcard.contact_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-ink-600">
                            <CalendarDays className="w-4 h-4 text-stamp-500" />
                            <span>
                              {postcard.direction === "received" ? "收到" : "寄出"}：
                              {formatDate(
                                postcard.direction === "received"
                                  ? postcard.received_date
                                  : postcard.sent_date
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-parchment-200">
                          <span
                            className={cn(
                              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold",
                              postcard.direction === "received"
                                ? "bg-ink-50 text-ink-700"
                                : "bg-stamp-50 text-stamp-700"
                            )}
                          >
                            {postcard.direction === "received" ? "来信" : "去信"}
                          </span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))
              )}
            </MapContainer>
          )}

          {validMarkers.length > 0 && (
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-parchment-200/60">
              <div className="flex items-center gap-2 text-sm text-ink-600">
                <div
                  style={{
                    width: 20,
                    height: 20,
                    background: "linear-gradient(135deg, #EC7070, #C0392B)",
                    borderRadius: "50% 50% 50% 0",
                    transform: "rotate(-45deg)",
                  }}
                />
                <span>收到的明信片</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-ink-600">
                <div
                  style={{
                    width: 20,
                    height: 20,
                    background: "linear-gradient(135deg, #EFC44B, #B07E0F)",
                    borderRadius: "4px",
                    transform: "rotate(-45deg)",
                  }}
                />
                <span>寄出的明信片</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
