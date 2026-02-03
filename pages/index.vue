<template>
  <div class="sportmap">
    <div class="filter-panel-wrapper">
      <div class="filter-panel-wrapper-btns">
        <button :class="['tab-btn', { active: activeTab === 'facilities' }]" @click="switchTab('facilities')">
          <span>Sport inshoatlari</span>
          <span class="tab-count" v-if="activeTab === 'facilities'">{{ resultCount }}</span>
        </button>
        <button :class="['tab-btn', { active: activeTab === 'orglocations' }]" @click="switchTab('orglocations')">
          <span>Sport muassasalari joylashuvi</span>
          <span class="tab-count" v-if="activeTab === 'orglocations'">{{ resultCount }}</span>
        </button>
      </div>

      <div class="filter-panel glass">
        <h2 class="title">
          {{ activeTab === 'facilities' ? 'SPORT INSHOTLARI' : 'MUASSASALAR JOYLASHUVI' }}
        </h2>

        <div v-if="activeTab === 'orglocations' && hasPaid" class="toggle-row">
          <label class="toggle neon">
            <input type="checkbox" v-model="paidOnly" />
            <span class="slider"></span>
          </label>
          <span class="toggle-label">Pullik xizmat</span>
        </div>

        <div class="grid">
          <div class="filter-group" v-for="filter in activeFilterGroups" :key="filter.key">
            <label class="label">{{ filter.label }}</label>
            <div class="select-wrap">
              <select v-model="activeFilters[filter.key]" class="select" :disabled="loading">
                <option value="__ALL__">Barchasi</option>
                <option v-for="option in filter.options" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
              <span class="select-caret" aria-hidden="true">▾</span>
            </div>
          </div>
        </div>

        <div class="actions">
          <button @click="applyFilters" class="button primary" :disabled="loading">Kartada ko'rsatish</button>
          <button @click="resetFilters" class="button ghost" :disabled="loading">Filtrlarni tozalash</button>
        </div>

        <div class="dim-hint" v-if="loading" style="margin-top:8px">Yuklanmoqda…</div>
        <div class="dim-hint" v-else-if="!loading && currentSource.length === 0" style="margin-top:8px">
          Ma’lumot topilmadi
        </div>
      </div>

      <div class="logos">
        <img src="@/assets/uzb.png" alt="uzb" loading="lazy">
        <img src="@/assets/mysportuz.svg" alt="uca-logo" loading="lazy" />
        <svg version="1.1" viewBox="-188.247 470.163 78.939 90.801" xmlns="http://www.w3.org/2000/svg"
          class="w-6 fill-current">
          <path
            d="M -187.498 471.261 C -162.089 471.261 -136.682 471.261 -110.503 471.261 C -110.503 476.405 -110.503 481.548 -110.503 486.847 C -111.353 486.886 -112.204 486.925 -113.08 486.965 C -113.527 487.003 -113.964 487.043 -114.406 487.104 C -114.515 487.119 -114.625 487.133 -114.738 487.149 C -117.799 487.593 -120.735 488.544 -123.511 489.895 C -123.597 489.937 -123.683 489.978 -123.772 490.022 C -126.053 491.145 -128.177 492.616 -130.044 494.34 C -130.276 494.553 -130.513 494.755 -130.755 494.956 C -135.318 498.959 -138.265 505.1 -139.331 510.989 C -139.35 511.092 -139.37 511.195 -139.39 511.302 C -140.705 518.801 -138.726 526.632 -134.437 532.852 C -133.817 533.735 -133.13 534.557 -132.417 535.366 C -132.34 535.454 -132.34 535.454 -132.262 535.544 C -127.377 541.108 -120.129 544.626 -112.747 545.135 C -112.416 545.155 -112.084 545.171 -111.752 545.185 C -111.334 545.209 -110.918 545.267 -110.503 545.327 C -110.503 550.432 -110.503 555.537 -110.503 560.796 C -122.746 560.796 -134.065 555.875 -142.73 547.32 C -143.011 547.025 -143.282 546.727 -143.548 546.42 C -143.806 546.123 -144.074 545.84 -144.342 545.554 C -145.114 544.703 -145.795 543.787 -146.48 542.865 C -146.544 542.78 -146.609 542.696 -146.674 542.608 C -147.684 541.262 -148.575 539.872 -149.41 538.412 C -149.468 538.312 -149.526 538.212 -149.585 538.108 C -152.361 533.273 -154 528.065 -154.919 522.591 C -154.941 522.458 -154.964 522.325 -154.988 522.188 C -155.643 518.157 -155.589 513.611 -154.919 509.583 C -154.898 509.453 -154.878 509.324 -154.856 509.19 C -153.511 500.948 -150.047 493.312 -144.605 486.965 C -158.759 486.926 -172.914 486.887 -187.498 486.847 C -187.498 481.704 -187.498 476.561 -187.498 471.261 Z" />
        </svg>
        <img src="@/assets/cybersport.png" alt="uca-logo" loading="lazy" />
        <img src="@/assets/paralimpia.png" alt="link-digtal-logo" loading="lazy" />
      </div>
    </div>

    <div class="map-container">
      <div ref="mapContainer" class="map"></div>
      <div id="legend" class="legend" v-show="groupByCategory"></div>
    </div>

    <div class="info-btn" @click="togglePopup">
      <span>sportchilar</span>
    </div>

    <div class="mobile">
      <h2>Kompyuterdan <br /> kirishingizni soraymiz!</h2>
    </div>

    <div v-if="isPopupOpen" class="popup-overlay" @click.self="closePopup">
      <div class="popup-info" @click.stop>
        <button class="popup-close" @click="closePopup" aria-label="Закрыть">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>

        <!-- Categories View -->
        <div v-if="popupView === 'categories'">
          <h2>Sportchilar</h2>
          <div class="popup-categories">
            <button class="category-btn" @click="selectCategory('olimpia')">
              <span>Olimpia sportchilar</span>
            </button>
            <button class="category-btn" @click="selectCategory('paralimpiakada')">
              <span>Paralimpiakada sportchilar</span>
            </button>
            <button class="category-btn" @click="selectCategory('trenerlar')">
              <span>Trenerlar</span>
            </button>
          </div>
        </div>

        <!-- List View -->
        <div v-else class="popup-list-container">
          <div class="popup-header">
            <button class="popup-back" @click="goBackToCategories" aria-label="Назад">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </button>
            <h2>
              <span v-if="selectedCategory === 'olimpia'">Olimpia sportchilar</span>
              <span v-else-if="selectedCategory === 'paralimpiakada'">Paralimpiakada ishtirokchilari!</span>
              <span v-else-if="selectedCategory === 'trenerlar'">Trenerlar</span>
            </h2>
          </div>
          <template v-if="selectedCategory === 'paralimpiakada'">
            <div class="popup-list-wrapper">
              <AthleteCard v-for="(athlete, index) in paralimpiakadaAthletes" :key="index" :image="athlete.image"
                :medal-label="athlete.medalLabel" :sport-type="athlete.sportType" :title="athlete.title"
                :name="athlete.name" :description="athlete.description" :achievements="athlete.achievements" />
            </div>
          </template>
          <div v-else-if="selectedCategory === 'olimpia'" class="popup-empty">
            <p>Ma'lumotlar hozircha mavjud emas</p>
          </div>
          <div v-else-if="selectedCategory === 'trenerlar'" class="popup-empty">
            <p>Ma'lumotlar hozircha mavjud emas</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import mapboxgl from 'mapbox-gl'
import AthleteCard from '@/components/AthleteCard.vue'

// Types
type TabKey = 'facilities' | 'orglocations'
type Key = 'sportType' | 'oblast' | 'district' | 'organization' | 'facility'
type Filters = Partial<Record<Key, string>>

type LocationItem = {
  uid: string
  name: string
  type: string | null
  oblast: string
  district: string | null
  organization: string | null
  facility: string | null
  address: string | null
  lat: number
  lng: number
  paid: boolean
  orgId?: number
  sportTypes?: string[]
}

type AchievementType = 'gold-star' | 'gold-medal' | 'silver-medal' | 'bronze-medal' | 'license' | 'star'

interface AthleteAchievement {
  type: AchievementType
  text: string
}

interface Athlete {
  image: string
  medalLabel: string
  sportType: string
  title: string
  name: string
  description: string
  achievements: AthleteAchievement[]
}

// Data sources
const DATA_FAC = '/data/sport_inshootlari_joylashuvi.json'
const DATA_ORG = '/data/sport_muassasalari_joylashuvi.json'
const DATA_ORG_SPORTS_PAID = '/data/sport_muassasalari_payed_for_filter.json'
const DATA_ORG_SPORTS_UNPAID = '/data/sport_muassasalari_unpayed_for_filter.json'
const DATA_SPORT_TYPES = '/data/sport_turi.json'
const DATA_ATHLETES = '/data/athletes.json'

// Map constants
const SRC_ID = 'points-src'
const L_CLUSTER = 'points-clusters'
const L_CLUSTER_COUNT = 'points-cluster-count'
const L_UNCLUSTERED = 'points-unclustered'

// State
const mapContainer = ref<HTMLElement | null>(null)
const map = ref<mapboxgl.Map | null>(null)
const resultCount = ref(0)
const loading = ref(true)
const activeTab = ref<TabKey>('facilities')
const paidOnly = ref(false)
const isPopupOpen = ref(false)
const popupView = ref<'categories' | 'list'>('categories')
const selectedCategory = ref<'olimpia' | 'paralimpiakada' | 'trenerlar' | null>(null)

const facSource = ref<LocationItem[]>([])
const orgSource = ref<LocationItem[]>([])
const paralimpiakadaAthletes = ref<Athlete[]>([])
const sportTypeIdToName = ref<Map<string, string>>(new Map())
const orgIdToSportNames = ref<Map<number, Set<string>>>(new Map())

const filtersFacilities = ref<Filters>({
  oblast: '__ALL__', district: '__ALL__', organization: '__ALL__', facility: '__ALL__'
})
const filtersOrgs = ref<Filters>({
  sportType: '__ALL__', oblast: '__ALL__', district: '__ALL__', organization: '__ALL__'
})

const config = useRuntimeConfig()
mapboxgl.accessToken = config.public.mapboxAccessToken as string

// Helpers
function uniq<T>(arr: T[]) { return Array.from(new Set(arr)) }
function isAll(v?: string) { return v === '__ALL__' || v == null }

const UZ_BBOX = { minLng: 55.0, minLat: 35.0, maxLng: 75.0, maxLat: 48.0 }
function inUZ(lat: number, lng: number) {
  return isFinite(lat) && isFinite(lng) &&
    lng >= UZ_BBOX.minLng && lng <= UZ_BBOX.maxLng &&
    lat >= UZ_BBOX.minLat && lat <= UZ_BBOX.maxLat
}

const labelsFacilities: Record<Key, string> = {
  sportType: 'Sport turi',
  oblast: 'Hudud',
  district: 'Tuman(shahar)',
  organization: 'Tashkilot',
  facility: 'Sport inshoati'
}
const labelsOrgs: Partial<Record<Key, string>> = {
  sportType: 'Sport turi',
  oblast: 'Hudud',
  district: 'Tuman(shahar)',
  organization: 'Tashkilot'
}

// Data Handling
function rowToFacility(r: any): LocationItem | null {
  const lat = Number(r.latitude ?? r.lat)
  const lng = Number(r.longitude ?? r.lng)
  if (!isFinite(lat) || !isFinite(lng) || !inUZ(lat, lng)) return null
  const oblast = r?.oblast?.name || r.oblastname || r?.region?.oblast?.name || ''
  const district = r?.region?.name || r.regionname || r?.district?.name || null
  const name = r.name ?? 'Noma’lum inshoot'
  return {
    uid: `fac-${r.id ?? name}-${lat},${lng}`,
    name,
    type: r.type ?? 'Sport inshoot',
    oblast, district,
    organization: r?.organization?.name ?? r?.organizationname ?? null,
    facility: r.name ?? null,
    address: r.address ?? null,
    lat, lng, paid: false
  }
}

function rowToOrg(r: any): LocationItem | null {
  const lat = Number(r.latitude ?? r.lat)
  const lng = Number(r.longitude ?? r.lng)
  if (!isFinite(lat) || !isFinite(lng) || !inUZ(lat, lng)) return null
  const oblast = r?.region?.name || r?.oblast?.name || r.regionname || r.oblastname || ''
  const district = r?.oblast?.name || r.oblastname || r?.district?.name || null
  const id = Number(r.id)
  const sportSet = orgIdToSportNames.value.get(id)
  const sportTypes = sportSet ? Array.from(sportSet).filter(s => s !== '__PAID__').sort() : []
  return {
    uid: `org-${id || r.organizationname}-${lat},${lng}`,
    name: r.organizationname ?? r.name ?? 'Tashkilot',
    type: null,
    oblast, district,
    organization: r.organizationname ?? null,
    facility: null,
    address: r.address ?? null,
    lat, lng,
    paid: Boolean(sportSet && sportSet.has('__PAID__')),
    orgId: id,
    sportTypes
  }
}

function buildOrgSportsMaps(sportsPaid: any, sportsUnpaid: any, sportTypesList: any[]) {
  sportTypeIdToName.value = new Map(
    (Array.isArray(sportTypesList) ? sportTypesList : []).map((t: any) => [String(t.id), String(t.name)])
  )

  const addFrom = (src: any, paidFlag: boolean) => {
    if (!src || typeof src !== 'object') return
    Object.keys(src).forEach((k) => {
      const bucket = src[k]
      const typeName = String(bucket?.name ?? sportTypeIdToName.value.get(k) ?? k)
      const orgs = Array.isArray(bucket?.organizations) ? bucket.organizations : []
      orgs.forEach((o: any) => {
        const id = Number(o?.id)
        if (!id) return
        if (!orgIdToSportNames.value.has(id)) orgIdToSportNames.value.set(id, new Set<string>())
        orgIdToSportNames.value.get(id)!.add(typeName)
        if (paidFlag) orgIdToSportNames.value.get(id)!.add('__PAID__')
      })
    })
  }

  orgIdToSportNames.value.clear()
  addFrom(sportsPaid, true)
  addFrom(sportsUnpaid, false)
}

async function loadData() {
  try {
    const responses = await Promise.all([
      fetch(DATA_FAC), fetch(DATA_ORG), fetch(DATA_ORG_SPORTS_PAID),
      fetch(DATA_ORG_SPORTS_UNPAID), fetch(DATA_SPORT_TYPES), fetch(DATA_ATHLETES)
    ])

    const [facJson, orgJson, sportsPaidJson, sportsUnpaidJson, sportTypesJson, athletesJson] =
      await Promise.all(responses.map(r => r.json()))

    buildOrgSportsMaps(sportsPaidJson, sportsUnpaidJson, sportTypesJson)
    facSource.value = (Array.isArray(facJson) ? facJson : []).map(rowToFacility).filter(Boolean) as LocationItem[]
    const orgRaw = Array.isArray(orgJson) ? orgJson : (orgJson.osatsiatsiya || [])
    orgSource.value = orgRaw.map(rowToOrg).filter(Boolean) as LocationItem[]
    paralimpiakadaAthletes.value = athletesJson

  } catch (e) {
    console.error('Failed to load data', e)
  } finally {
    loading.value = false
  }
}

// Map Logic
function toGeoJSON(points: LocationItem[]): GeoJSON.FeatureCollection<GeoJSON.Point, any> {
  return {
    type: 'FeatureCollection',
    features: points.map(p => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
      properties: {
        name: p.name, type: p.type || '', oblast: p.oblast, district: p.district || '',
        organization: p.organization || '', facility: p.facility || '',
        address: p.address || '', paid: p.paid ? 1 : 0,
        sportTypes: (p.sportTypes || []).join('|')
      }
    }))
  }
}

function updateMarkers(data: LocationItem[]) {
  resultCount.value = data.length
  if (!map.value) return
  const src = map.value.getSource(SRC_ID) as mapboxgl.GeoJSONSource
  if (src) src.setData(toGeoJSON(data))
  fitViewportToData(data)
}

function fitViewportToData(data: LocationItem[]) {
  const mapInstance = map.value
  if (!mapInstance) return
  if (data.length === 0) {
    mapInstance.fitBounds([[55.97, 37.18], [73.12, 46.59]], { padding: 80, duration: 600 })
    return
  }
  const first = data[0]
  if (data.length === 1 && first) {
    mapInstance.flyTo({ center: [first.lng, first.lat], zoom: 12.5, duration: 600 })
    return
  }
  const bounds = new mapboxgl.LngLatBounds()
  data.forEach(p => bounds.extend([p.lng, p.lat]))
  mapInstance.fitBounds(bounds, { padding: { top: 100, right: 100, bottom: 180, left: 360 }, maxZoom: 12, duration: 600 })
}

// Computed
const currentSource = computed(() => activeTab.value === 'facilities' ? facSource.value : orgSource.value)
const hasPaid = computed(() => orgSource.value.some(x => x.paid))
const activeFilters = computed(() => activeTab.value === 'facilities' ? filtersFacilities.value : filtersOrgs.value)
const groupByCategory = ref(false)

function dataForTab(tab: TabKey) {
  const base = tab === 'facilities' ? facSource.value : orgSource.value
  const f = tab === 'facilities' ? filtersFacilities.value : filtersOrgs.value
  return base.filter(l =>
    (tab === 'orglocations' ? (isAll(f.sportType) || (l.sportTypes || []).includes(String(f.sportType))) : true) &&
    (isAll(f.oblast) || l.oblast === f.oblast) &&
    (isAll(f.district) || l.district === f.district) &&
    (isAll(f.organization) || l.organization === f.organization) &&
    (tab === 'facilities' ? (isAll(f.facility) || l.facility === f.facility) : true) &&
    (tab === 'orglocations' ? (!paidOnly.value || l.paid) : true)
  )
}

const activeFilterGroups = computed(() => {
  const tab = activeTab.value
  const src = currentSource.value
  const f = activeFilters.value
  const groups: Array<{ key: Key, label: string, options: string[] }> = []

  if (tab === 'facilities') {
    const filtered = (key?: Key) => src.filter(l =>
      (key === 'oblast' || isAll(f.oblast) || l.oblast === f.oblast) &&
      (key === 'district' || isAll(f.district) || l.district === f.district) &&
      (key === 'organization' || isAll(f.organization) || l.organization === f.organization) &&
      (key === 'facility' || isAll(f.facility) || l.facility === f.facility)
    )
    groups.push(
      { key: 'oblast', label: labelsFacilities.oblast, options: uniq(filtered('oblast').map(l => l.oblast).filter(Boolean)) },
      { key: 'district', label: labelsFacilities.district, options: uniq(filtered('district').map(l => l.district || '').filter(Boolean)) },
      { key: 'organization', label: labelsFacilities.organization, options: uniq(filtered('organization').map(l => l.organization || '').filter(Boolean)) },
      { key: 'facility', label: labelsFacilities.facility, options: uniq(filtered('facility').map(l => l.facility || '').filter(Boolean)) },
    )
  } else {
    const filtered = (key?: Key) => src.filter(l =>
      (key === 'sportType' || isAll(f.sportType) || (l.sportTypes || []).includes(String(f.sportType))) &&
      (key === 'oblast' || isAll(f.oblast) || l.oblast === f.oblast) &&
      (key === 'district' || isAll(f.district) || l.district === f.district) &&
      (key === 'organization' || isAll(f.organization) || l.organization === f.organization)
    )
    groups.push(
      { key: 'sportType', label: labelsOrgs.sportType!, options: uniq(filtered('sportType').flatMap(l => l.sportTypes || []).filter(Boolean)).sort() },
      { key: 'oblast', label: labelsOrgs.oblast!, options: uniq(filtered('oblast').map(l => l.oblast).filter(Boolean)) },
      { key: 'district', label: labelsOrgs.district!, options: uniq(filtered('district').map(l => l.district || '').filter(Boolean)) },
      { key: 'organization', label: labelsOrgs.organization!, options: uniq(filtered('organization').map(l => l.organization || '').filter(Boolean)) },
    )
  }
  return groups
})

// Actions
let applyTimer: any = null
function applyFilters() {
  if (applyTimer) clearTimeout(applyTimer)
  applyTimer = setTimeout(() => {
    updateMarkers(dataForTab(activeTab.value))
  }, 100)
}

function resetFilters() {
  if (activeTab.value === 'facilities') {
    filtersFacilities.value = { oblast: '__ALL__', district: '__ALL__', organization: '__ALL__', facility: '__ALL__' }
  } else {
    filtersOrgs.value = { sportType: '__ALL__', oblast: '__ALL__', district: '__ALL__', organization: '__ALL__' }
    paidOnly.value = false
  }
  applyFilters()
}

function switchTab(t: TabKey) {
  if (activeTab.value === t) return
  activeTab.value = t
  applyFilters()
}

function togglePopup() { isPopupOpen.value = !isPopupOpen.value }
function closePopup() {
  isPopupOpen.value = false
  popupView.value = 'categories'
  selectedCategory.value = null
}
function selectCategory(category: 'olimpia' | 'paralimpiakada' | 'trenerlar') {
  selectedCategory.value = category
  popupView.value = 'list'
}
function goBackToCategories() {
  popupView.value = 'categories'
  selectedCategory.value = null
}
function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && isPopupOpen.value) closePopup()
}

watch(() => ({ filters: activeFilters.value, paid: paidOnly.value, tab: activeTab.value }), applyFilters, { deep: true })

onMounted(async () => {
  window.addEventListener('keydown', handleEscape)
  if (!mapContainer.value) return

  const m = new mapboxgl.Map({
    container: mapContainer.value!,
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [65, 40],
    zoom: 5,
    attributionControl: false
  })
  map.value = m
  const mapInstance = m
    ; (mapInstance as any).setMaxBounds([[55, 35], [75, 48]])

  mapInstance.on('load', async () => {
    map.value!.addSource('country-bounds', { type: 'vector', url: 'mapbox://mapbox.country-boundaries-v1' })
    map.value!.addLayer({
      id: 'uzb-fill', type: 'fill', source: 'country-bounds', 'source-layer': 'country_boundaries',
      filter: ['==', ['get', 'iso_3166_1_alpha_3'], 'UZB'],
      paint: { 'fill-color': '#fff', 'fill-opacity': 0.18 }
    })
    map.value!.addLayer({
      id: 'uzb-outline', type: 'line', source: 'country-bounds', 'source-layer': 'country_boundaries',
      filter: ['==', ['get', 'iso_3166_1_alpha_3'], 'UZB'],
      paint: { 'line-color': '#fff', 'line-width': 2 }
    })
    map.value!.addControl(new mapboxgl.AttributionControl({
      compact: false,
      customAttribution: ['Powered by <a href="https://linkdigital.uz/" target="_blank">linkdigital.uz</a>']
    }), 'bottom-right')

    map.value!.addSource(SRC_ID, {
      type: 'geojson', data: toGeoJSON([]),
      cluster: true, clusterRadius: 50, clusterMaxZoom: 12
    })

    map.value!.addLayer({
      id: L_CLUSTER, type: 'circle', source: SRC_ID, filter: ['has', 'point_count'],
      paint: {
        'circle-color': ['step', ['get', 'point_count'], '#7CFFCB', 10, '#FDE047', 50, '#FB923C'],
        'circle-radius': ['step', ['get', 'point_count'], 18, 10, 24, 50, 32],
        'circle-stroke-color': '#ffffff', 'circle-stroke-width': 2
      }
    })
    map.value!.addLayer({
      id: L_CLUSTER_COUNT, type: 'symbol', source: SRC_ID, filter: ['has', 'point_count'],
      layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 12 },
      paint: { 'text-color': '#001221' }
    })
    map.value!.addLayer({
      id: L_UNCLUSTERED, type: 'circle', source: SRC_ID, filter: ['!', ['has', 'point_count']],
      paint: { 'circle-color': '#1F51FF', 'circle-radius': 6, 'circle-stroke-color': '#fff', 'circle-stroke-width': 1.5 }
    })

    mapInstance.on('click', L_CLUSTER, (e) => {
      const features = mapInstance.queryRenderedFeatures(e.point, { layers: [L_CLUSTER] })
      const feature = features?.[0]
      if (!feature) return
      const clusterId = feature.properties?.cluster_id
      const src = mapInstance.getSource(SRC_ID) as mapboxgl.GeoJSONSource
      if (src && clusterId !== undefined) {
        src.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (!err && zoom != null) {
            mapInstance.easeTo({
              center: (feature.geometry as any).coordinates,
              zoom
            })
          }
        })
      }
    })

    map.value!.on('click', L_UNCLUSTERED, (e) => {
      const f = e.features?.[0]
      if (!f) return
      const p = f.properties as any
      const html = `
          <div class="popup-card">
            <div class="popup-title">${p.name}</div>
            <div class="popup-meta">${p.type || ''}${p.facility ? ' · ' + p.facility : ''}${Number(p.paid) ? ' · Pullik' : ''}</div>
            <div class="popup-addr">${p.address || ''}</div>
          </div>
        `
      if (mapInstance && f.geometry && (f.geometry as any).coordinates) {
        console.log('Popup properties:', p)
        new mapboxgl.Popup({ offset: 16, className: 'sport-popup' })
          .setLngLat((f.geometry as any).coordinates)
          .setHTML(html)
          .addTo(mapInstance as any)
      }
    })

      ;[L_CLUSTER, L_UNCLUSTERED].forEach(id => {
        map.value!.on('mouseenter', id, () => map.value!.getCanvas().style.cursor = 'pointer')
        map.value!.on('mouseleave', id, () => map.value!.getCanvas().style.cursor = '')
      })

    await loadData()
    applyFilters()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
  map.value?.remove()
})
</script>

<style>
@import './index.css';

.info-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  cursor: pointer;
  padding: 12px 20px;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(15, 20, 34, 0.9), rgba(10, 15, 28, 0.85));
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.info-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  border-color: rgba(31, 81, 255, 0.4);
  background: linear-gradient(180deg, rgba(20, 25, 40, 0.95), rgba(15, 20, 35, 0.9));
}

.info-btn span {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.sportmap {
  position: relative;
  display: flex;
  height: 100vh;
  color: var(--text);
  background: var(--bg);
  font-family: Inter, system-ui, sans-serif;
}

.logos {
  width: 100%;
  padding: 20px;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(15, 20, 34, .62), rgba(15, 20, 34, .48));
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100px;
}

.logos img {
  height: 100%;
  object-fit: contain;
  width: 100px;
}

.fill-current {
  fill: #fff;
  height: 82%;
  width: 100px;
  object-fit: contain;
}

.map-container {
  flex: 1;
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}

.filter-panel-wrapper {
  width: 560px;
  position: absolute;
  top: 50%;
  left: 4%;
  transform: translateY(-50%);
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.filter-panel-wrapper-btns {
  display: flex;
  gap: 10px;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: linear-gradient(180deg, rgba(24, 28, 48, .9), rgba(16, 20, 36, .82));
  border: 1px solid var(--stroke);
  color: var(--text);
  padding: 14px 16px;
  border-radius: 14px;
  box-shadow: var(--shadow);
  transition: all .18s ease;
  backdrop-filter: blur(8px);
}

.tab-btn.active {
  box-shadow: 0 0 0 2px var(--ring), var(--shadow);
  background: linear-gradient(180deg, rgba(36, 44, 92, .95), rgba(20, 26, 48, .9));
}

.tab-btn .tab-count {
  background: linear-gradient(90deg, var(--primary) 0%, var(--primary-2) 100%);
  color: #001221;
  font-weight: 800;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.filter-panel {
  padding: 18px 18px 16px;
}

.glass {
  background: linear-gradient(180deg, rgba(15, 20, 34, .62), rgba(15, 20, 34, .48));
  border: 1px solid var(--stroke);
  border-radius: 16px;
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
}

.title {
  font-weight: 900;
  text-align: center;
  margin: 4px 0 12px;
  text-transform: uppercase;
  background: linear-gradient(90deg, #fff, #bfe9ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 12px;
  margin-top: 8px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: 12px;
  color: var(--muted);
}

.select-wrap {
  position: relative;
}

.select {
  appearance: none;
  width: 100%;
  background: rgba(255, 255, 255, .06);
  border: 1px solid rgba(255, 255, 255, .14);
  border-radius: 12px;
  color: var(--text);
  padding: 10px 34px 10px 12px;
  outline: none;
}

.select-caret {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #bfe9ff;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.button {
  flex: 1;
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: all .12s ease;
}

.button.primary {
  background: linear-gradient(90deg, var(--primary) 0%, var(--primary-2) 100%);
  color: #001221;
}

.button.ghost {
  background: transparent;
  color: var(--text);
  border: 1px solid rgba(255, 255, 255, .16);
}

.mobile {
  display: none;
}

@media (max-width:769px) {
  .filter-panel-wrapper {
    position: fixed;
    inset: auto 12px 12px 12px;
    transform: none;
    width: auto;
    z-index: 5;
  }
}

@media (max-width:720px) {
  .mobile {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
  }

  .mobile h2 {
    font-size: 22px;
    color: #fff;
    text-align: center;
  }
}
</style>