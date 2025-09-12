<template>
    <div class="sportmap">
        <!-- Filter panel -->
        <div class="filter-panel-wrapper">
            <div class="filter-panel-wrapper-btns">
                <button :class="['tab-btn', { active: activeTab === 'facilities' }]" @click="switchTab('facilities')">
                    <span>Sport inshoatlari</span>
                    <span class="tab-count" v-if="activeTab === 'facilities'">{{ resultCount }}</span>
                </button>
                <button :class="['tab-btn', { active: activeTab === 'orglocations' }]"
                    @click="switchTab('orglocations')">
                    <span>Sport muassasalari joylashuvi</span>
                    <span class="tab-count" v-if="activeTab === 'orglocations'">{{ resultCount }}</span>
                </button>
            </div>

            <div class="filter-panel glass">
                <h2 class="title">
                    {{ activeTab === 'facilities' ? 'SPORT INSHOTLARI' : 'MUASSASALAR JOYLASHUVI' }}
                </h2>

                <!-- Result counter -->
                <!-- <div class="result-row">
                    <span class="pill">Topildi: {{ resultCount }} ta joy</span>
                    <span v-if="resultCount === 0" class="dim-hint">Hech narsa topilmadi. Filtrlarni o‘zgartiring.</span>
                </div> -->

                <!-- Pullik xizmat (only orglocations) -->
                <div v-if="activeTab === 'orglocations'" class="toggle-row">
                    <label class="toggle neon">
                        <input type="checkbox" v-model="paidOnly" />
                        <span class="slider"></span>
                    </label>
                    <span class="toggle-label">Pullik xizmat</span>
                </div>

                <!-- Cascading filters -->
                <div class="grid">
                    <div class="filter-group" v-for="filter in activeFilterGroups" :key="filter.key">
                        <label class="label">{{ filter.label }}</label>
                        <div class="select-wrap">
                            <select v-model="activeFilters[filter.key]" class="select">
                                <option value="__ALL__">Barchasi</option>
                                <option v-for="option in filter.options" :key="option" :value="option">
                                    {{ option }}
                                </option>
                            </select>
                            <span class="select-caret" aria-hidden="true">▾</span>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="actions">
                    <button @click="applyFilters" class="button primary">Kartada ko'rsatish</button>
                    <button @click="resetFilters" class="button ghost">Filtrlarni tozalash</button>
                </div>
            </div>
            <div class="logos">
                <img src="@/assets/mysportuz.svg" alt="uca-logo">
                <svg data-v-a5914270="" version="1.1" viewBox="-188.247 470.163 78.939 90.801"
                    xmlns="http://www.w3.org/2000/svg" class="w-6 fill-current">
                    <defs></defs>
                    <path
                        d="M -187.498 471.261 C -162.089 471.261 -136.682 471.261 -110.503 471.261 C -110.503 476.405 -110.503 481.548 -110.503 486.847 C -111.353 486.886 -112.204 486.925 -113.08 486.965 C -113.527 487.003 -113.964 487.043 -114.406 487.104 C -114.515 487.119 -114.625 487.133 -114.738 487.149 C -117.799 487.593 -120.735 488.544 -123.511 489.895 C -123.597 489.937 -123.683 489.978 -123.772 490.022 C -126.053 491.145 -128.177 492.616 -130.044 494.34 C -130.276 494.553 -130.513 494.755 -130.755 494.956 C -135.318 498.959 -138.265 505.1 -139.331 510.989 C -139.35 511.092 -139.37 511.195 -139.39 511.302 C -140.705 518.801 -138.726 526.632 -134.437 532.852 C -133.817 533.735 -133.13 534.557 -132.417 535.366 C -132.34 535.454 -132.34 535.454 -132.262 535.544 C -127.377 541.108 -120.129 544.626 -112.747 545.135 C -112.416 545.155 -112.084 545.171 -111.752 545.185 C -111.334 545.209 -110.918 545.267 -110.503 545.327 C -110.503 550.432 -110.503 555.537 -110.503 560.796 C -122.746 560.796 -134.065 555.875 -142.73 547.32 C -143.011 547.025 -143.282 546.727 -143.548 546.42 C -143.806 546.123 -144.074 545.84 -144.342 545.554 C -145.114 544.703 -145.795 543.787 -146.48 542.865 C -146.544 542.78 -146.609 542.696 -146.674 542.608 C -147.684 541.262 -148.575 539.872 -149.41 538.412 C -149.468 538.312 -149.526 538.212 -149.585 538.108 C -152.361 533.273 -154 528.065 -154.919 522.591 C -154.941 522.458 -154.964 522.325 -154.988 522.188 C -155.643 518.157 -155.589 513.611 -154.919 509.583 C -154.898 509.453 -154.878 509.324 -154.856 509.19 C -153.511 500.948 -150.047 493.312 -144.605 486.965 C -158.759 486.926 -172.914 486.887 -187.498 486.847 C -187.498 481.704 -187.498 476.561 -187.498 471.261 Z">
                    </path>
                </svg>
                <img src="@/assets/cybersport.png" alt="uca-logo">

                <img src="@/assets/link.ico" alt="link-digtal-logo">

            </div>
        </div>

        <!-- Map -->
        <div class="map-container">
            <div ref="mapContainer" class="map"></div>
            <div id="legend" class="legend" v-show="groupByCategory"></div>
        </div>
        <div class="mobile">
            <h2>Kompyuterdan <br> kirishingizni soraymiz!</h2>
        </div>

    </div>
</template>

<script setup lang="ts">
// import Logo1 from '../assets/'
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import mapboxgl from 'mapbox-gl'

type TabKey = 'facilities' | 'orglocations'
type Key = 'sportType' | 'region' | 'organization' | 'facility'
type Filters = Record<Key, string>

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<mapboxgl.Map | null>(null)
const markers = ref<mapboxgl.Marker[]>([])
const resultCount = ref(0)
const lastFiltered = ref<any[]>([])

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FydWJvbGEiLCJhIjoiY21mNWJnd3Q2MDNsazJqcGZqdjZuaHg5cCJ9.yaO3u4qlhzDV9TDytXgb9A'

/** DATA (with `paid`) — 45 sample places across Uzbekistan */
const locations = [
    // Tashkent city
    { name: 'Humo Arena', type: 'Basketball', region: 'Tashkent', organization: 'SportClub1', facility: 'Arena2', address: 'Buyuk Ipak Yo‘li 111', lat: 41.3385, lng: 69.3349, paid: true },
    { name: 'Milliy Stadion', type: 'Football', region: 'Tashkent', organization: 'SportClub2', facility: 'Stadium1', address: 'Bunyodkor shoh ko‘chasi', lat: 41.3123, lng: 69.2401, paid: true },
    { name: 'Chilonzor Tennis Club', type: 'Tennis', region: 'Tashkent', organization: 'SportOrg3', facility: 'Court3', address: 'Chilonzor-9', lat: 41.2859, lng: 69.2042, paid: false },
    { name: 'Yunusobod Volley Hall', type: 'Volleyball', region: 'Tashkent', organization: 'SportClub1', facility: 'Gym4', address: 'Yunusobod-12', lat: 41.3661, lng: 69.2877, paid: false },
    { name: 'Angren Stadium', type: 'Football', region: 'Tashkent', organization: 'SportClub3', facility: 'Stadium2', address: 'Angren markazi', lat: 41.0167, lng: 70.1433, paid: false },
    { name: 'Chirchiq Sports Hall', type: 'Volleyball', region: 'Tashkent', organization: 'SportClub4', facility: 'Gym3', address: 'Chirchiq', lat: 41.4684, lng: 69.5820, paid: true },

    // Samarkand region
    { name: 'Samarkand Arena', type: 'Basketball', region: 'Samarkand', organization: 'SportClub2', facility: 'Arena2', address: 'Registon ko‘chasi', lat: 39.6542, lng: 66.9594, paid: false },
    { name: 'Afrosiyob Stadium', type: 'Football', region: 'Samarkand', organization: 'SportClub1', facility: 'Stadium1', address: 'Afrosiyob tumani', lat: 39.6456, lng: 66.9801, paid: true },
    { name: 'Kattaqo‘rg‘on Court', type: 'Tennis', region: 'Samarkand', organization: 'SportOrg4', facility: 'Court3', address: 'Kattaqo‘rg‘on', lat: 39.8984, lng: 66.2582, paid: false },
    { name: 'Payariq Volley Gym', type: 'Volleyball', region: 'Samarkand', organization: 'SportClub3', facility: 'Gym4', address: 'Payariq', lat: 39.9801, lng: 67.2302, paid: false },

    // Bukhara region
    { name: 'Bukhara Court', type: 'Tennis', region: 'Bukhara', organization: 'SportOrg3', facility: 'Court3', address: 'Sitorai Mohi Hosa', lat: 39.7684, lng: 64.4186, paid: true },
    { name: 'Bunyodkor Stadium (BK)', type: 'Football', region: 'Bukhara', organization: 'SportClub2', facility: 'Stadium2', address: 'Bukhoro markazi', lat: 39.7770, lng: 64.4233, paid: false },
    { name: 'G‘ijduvon Gym', type: 'Volleyball', region: 'Bukhara', organization: 'SportClub1', facility: 'Gym4', address: 'G‘ijduvon', lat: 40.0951, lng: 64.6837, paid: false },

    // Andijan region
    { name: 'Andijan Gym', type: 'Volleyball', region: 'Andijan', organization: 'SportClub1', facility: 'Gym4', address: 'Istiqbol ko‘chasi', lat: 40.7822, lng: 72.3419, paid: false },
    { name: 'Andijon Stadium', type: 'Football', region: 'Andijan', organization: 'SportClub2', facility: 'Stadium1', address: 'Bobur shoh ko‘chasi', lat: 40.7850, lng: 72.3520, paid: true },
    { name: 'Asaka Tennis Park', type: 'Tennis', region: 'Andijan', organization: 'SportOrg4', facility: 'Court2', address: 'Asaka', lat: 40.6413, lng: 72.2387, paid: false },

    // Namangan region
    { name: 'Namangan Field', type: 'Football', region: 'Namangan', organization: 'SportClub2', facility: 'Stadium1', address: 'Do‘stlik ko‘chasi', lat: 40.9983, lng: 71.6726, paid: true },
    { name: 'Chortoq Arena', type: 'Basketball', region: 'Namangan', organization: 'SportClub1', facility: 'Arena1', address: 'Chortoq', lat: 41.0700, lng: 71.8360, paid: false },
    { name: 'Uchqo‘rg‘on Court', type: 'Tennis', region: 'Namangan', organization: 'SportOrg3', facility: 'Court3', address: 'Uchqo‘rg‘on', lat: 41.1142, lng: 72.0793, paid: true },

    // Fergana region
    { name: 'Fergana Central Stadium', type: 'Football', region: 'Fergana', organization: 'SportClub1', facility: 'Stadium2', address: 'Al-Farg‘oniy', lat: 40.3864, lng: 71.7843, paid: true },
    { name: 'Kokand Arena', type: 'Basketball', region: 'Fergana', organization: 'SportClub4', facility: 'Arena2', address: 'Qo‘qon', lat: 40.5320, lng: 70.9428, paid: false },
    { name: 'Marg‘ilon Court', type: 'Tennis', region: 'Fergana', organization: 'SportOrg4', facility: 'Court1', address: 'Marg‘ilon', lat: 40.4721, lng: 71.7247, paid: false },
    { name: 'Quva Volley Hall', type: 'Volleyball', region: 'Fergana', organization: 'SportClub3', facility: 'Gym2', address: 'Quva', lat: 40.5223, lng: 72.0658, paid: true },

    // Khorezm region
    { name: 'Urgench Stadium', type: 'Football', region: 'Khorezm', organization: 'SportClub2', facility: 'Stadium1', address: 'Urganch', lat: 41.5534, lng: 60.6318, paid: false },
    { name: 'Khiva Court', type: 'Tennis', region: 'Khorezm', organization: 'SportOrg3', facility: 'Court2', address: 'Xiva', lat: 41.3890, lng: 60.3633, paid: true },
    { name: 'Shovot Gym', type: 'Volleyball', region: 'Khorezm', organization: 'SportClub1', facility: 'Gym4', address: 'Shovot', lat: 41.6506, lng: 60.2920, paid: false },

    // Karakalpakstan
    { name: 'Nukus Arena', type: 'Basketball', region: 'Karakalpakstan', organization: 'SportClub4', facility: 'Arena1', address: 'Nukus markazi', lat: 42.4600, lng: 59.6167, paid: true },
    { name: 'Beruniy Stadium', type: 'Football', region: 'Karakalpakstan', organization: 'SportClub2', facility: 'Stadium2', address: 'Beruniy', lat: 41.6917, lng: 60.7522, paid: false },
    { name: 'Taxiatosh Court', type: 'Tennis', region: 'Karakalpakstan', organization: 'SportOrg3', facility: 'Court3', address: 'Taxiatosh', lat: 42.3147, lng: 59.6162, paid: false },

    // Kashkadarya
    { name: 'Qarshi Stadium', type: 'Football', region: 'Kashkadarya', organization: 'SportClub1', facility: 'Stadium1', address: 'Qarshi', lat: 38.8606, lng: 65.7891, paid: true },
    { name: 'Shahrisabz Arena', type: 'Basketball', region: 'Kashkadarya', organization: 'SportClub3', facility: 'Arena2', address: 'Shahrisabz', lat: 39.0549, lng: 66.8208, paid: false },
    { name: 'Kasbi Volley Gym', type: 'Volleyball', region: 'Kashkadarya', organization: 'SportClub2', facility: 'Gym3', address: 'Kasbi', lat: 38.9333, lng: 65.9000, paid: false },

    // Surxondaryo
    { name: 'Termez Stadium', type: 'Football', region: 'Surxondaryo', organization: 'SportClub2', facility: 'Stadium2', address: 'Termez', lat: 37.2240, lng: 67.2783, paid: false },
    { name: 'Denov Court', type: 'Tennis', region: 'Surxondaryo', organization: 'SportOrg4', facility: 'Court1', address: 'Denov', lat: 38.2699, lng: 67.8952, paid: true },
    { name: 'Sherobod Volley', type: 'Volleyball', region: 'Surxondaryo', organization: 'SportClub1', facility: 'Gym2', address: 'Sherobod', lat: 37.6667, lng: 67.0000, paid: false },

    // Jizzakh
    { name: 'Jizzakh Stadium', type: 'Football', region: 'Jizzakh', organization: 'SportClub3', facility: 'Stadium1', address: 'Jizzax', lat: 40.1250, lng: 67.8800, paid: true },
    { name: 'Zomin Tennis Park', type: 'Tennis', region: 'Jizzakh', organization: 'SportOrg3', facility: 'Court3', address: 'Zomin', lat: 39.9600, lng: 68.4000, paid: false },

    // Sirdaryo
    { name: 'Guliston Arena', type: 'Basketball', region: 'Sirdaryo', organization: 'SportClub2', facility: 'Arena2', address: 'Guliston', lat: 40.4915, lng: 68.7849, paid: false },
    { name: 'Yangiyer Gym', type: 'Volleyball', region: 'Sirdaryo', organization: 'SportClub1', facility: 'Gym4', address: 'Yangiyer', lat: 40.2833, lng: 68.8167, paid: true },

    // Navoiy
    { name: 'Navoiy Stadium', type: 'Football', region: 'Navoiy', organization: 'SportClub4', facility: 'Stadium2', address: 'Navoiy', lat: 40.1039, lng: 65.3688, paid: true },
    { name: 'Zarafshan Court', type: 'Tennis', region: 'Navoiy', organization: 'SportOrg4', facility: 'Court2', address: 'Zarafshan', lat: 41.5833, lng: 64.2000, paid: false },

    // Extras
    { name: 'Bekobod Sports Hall', type: 'Volleyball', region: 'Tashkent', organization: 'SportClub2', facility: 'Gym3', address: 'Bekobod', lat: 40.2200, lng: 69.2700, paid: false },
    { name: 'Olmaliq Football Park', type: 'Football', region: 'Tashkent', organization: 'SportClub1', facility: 'Stadium3', address: 'Olmaliq', lat: 40.8447, lng: 69.5980, paid: true },
    { name: 'Bo‘ka Tennis Club', type: 'Tennis', region: 'Tashkent', organization: 'SportOrg2', facility: 'Court1', address: 'Bo‘ka', lat: 40.8100, lng: 69.1900, paid: false },
    { name: 'Qibray Arena', type: 'Basketball', region: 'Tashkent', organization: 'SportClub3', facility: 'Arena1', address: 'Qibray', lat: 41.3890, lng: 69.4650, paid: true },
    { name: 'Nurota Volley', type: 'Volleyball', region: 'Navoiy', organization: 'SportClub3', facility: 'Gym1', address: 'Nurota', lat: 40.5600, lng: 65.6900, paid: false },
    { name: 'Ishtixon Stadium', type: 'Football', region: 'Samarkand', organization: 'SportClub2', facility: 'Stadium2', address: 'Ishtixon', lat: 39.9667, lng: 66.4833, paid: false },
    { name: 'Urgut Court', type: 'Tennis', region: 'Samarkand', organization: 'SportOrg2', facility: 'Court2', address: 'Urgut', lat: 39.4010, lng: 67.2670, paid: true },
    { name: 'Qo‘rg‘ontepa Arena', type: 'Basketball', region: 'Andijan', organization: 'SportClub4', facility: 'Arena1', address: 'Qo‘rg‘ontepa', lat: 40.7330, lng: 72.7610, paid: true },
    { name: 'Pop Stadium', type: 'Football', region: 'Namangan', organization: 'SportClub1', facility: 'Stadium1', address: 'Pop', lat: 41.0740, lng: 71.1100, paid: false }
];

const activeTab = ref<TabKey>('facilities')
const paidOnly = ref(false) // orglocations only

// Independent filter states
const filtersFacilities = ref<Filters>({
    sportType: '__ALL__', region: '__ALL__', organization: '__ALL__', facility: '__ALL__'
})
const filtersOrgLocations = ref<Filters>({
    sportType: '__ALL__', region: '__ALL__', organization: '__ALL__', facility: '__ALL__'
})

/** UTIL */
function uniq<T>(arr: T[]) { return Array.from(new Set(arr)) }
function isAll(v: string) { return v === '__ALL__' }

// Labels
const labelsFacilities: Record<Key, string> = {
    sportType: 'Sport turi',
    region: 'Hudud',
    organization: 'Tashkilot',
    facility: 'Sport inshoati'
}
const labelsOrg: Record<Key, string> = {
    region: 'Hudud',
    organization: 'Tashkilot',
    sportType: 'Sport turi',
    facility: 'Sport inshoati'
}

/** Data for current tab */
function dataForTab(tab: TabKey) {
    const f = tab === 'facilities' ? filtersFacilities.value : filtersOrgLocations.value
    return locations.filter(l =>
        (isAll(f.sportType) || l.type === f.sportType) &&
        (isAll(f.region) || l.region === f.region) &&
        (isAll(f.organization) || l.organization === f.organization) &&
        (isAll(f.facility) || l.facility === f.facility) &&
        (tab === 'orglocations' ? (!paidOnly.value || l.paid) : true)
    )
}

/** Cascading options */
function computeCascadingOptions(tab: TabKey, keys: Key[], labels: Record<Key, string>) {
    const f = tab === 'facilities' ? filtersFacilities.value : filtersOrgLocations.value
    const res: { key: Key, label: string, options: string[] }[] = []

    keys.forEach(k => {
        const filteredByOthers = locations.filter(l =>
            (k === 'sportType' || isAll(f.sportType) || l.type === f.sportType) &&
            (k === 'region' || isAll(f.region) || l.region === f.region) &&
            (k === 'organization' || isAll(f.organization) || l.organization === f.organization) &&
            (k === 'facility' || isAll(f.facility) || l.facility === f.facility) &&
            (tab === 'orglocations' ? (!paidOnly.value || l.paid) : true)
        )
        const options =
            k === 'sportType' ? uniq(filteredByOthers.map(l => l.type)) :
                k === 'region' ? uniq(filteredByOthers.map(l => l.region)) :
                    k === 'organization' ? uniq(filteredByOthers.map(l => l.organization)) :
                        uniq(filteredByOthers.map(l => l.facility))
        res.push({ key: k, label: labels[k], options })
    })

    // Self-heal invalid selections
    res.forEach(({ key, options }) => {
        const model = (tab === 'facilities' ? filtersFacilities : filtersOrgLocations).value
        if (!isAll(model[key]) && !options.includes(model[key])) {
            model[key] = '__ALL__'
        }
    })

    return res
}

/** Active bindings */
const activeFilters = computed(() =>
    activeTab.value === 'facilities' ? filtersFacilities.value : filtersOrgLocations.value
)
const activeFilterGroups = computed(() => {
    return activeTab.value === 'facilities'
        ? computeCascadingOptions('facilities', ['sportType', 'region', 'organization', 'facility'], labelsFacilities)
        : computeCascadingOptions('orglocations', ['region', 'organization', 'sportType', 'facility'], labelsOrg)
})

/** Legend / grouping (optional) */
const groupByCategory = ref(false)
const groupKey = ref<Key>('sportType')

// 7Saber-ish palette for grouped markers
const palette = ['#1F51FF', '#00E5FF', '#7CFFCB', '#8B5CF6', '#60A5FA', '#22D3EE', '#34D399', '#FDE047', '#FB7185', '#F472B6']
function hashCode(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i) | 0; return h }
function colorFor(v: string) { return palette[Math.abs(hashCode(v)) % palette.length] }
function buildLegend(values: string[]) {
    const el = document.getElementById('legend'); if (!el) return
    el.innerHTML = ''; if (!values.length) return
    const title = document.createElement('div'); title.className = 'title'
    title.textContent =
        groupKey.value === 'sportType' ? 'Sport turi' :
            groupKey.value === 'region' ? 'Hudud' :
                groupKey.value === 'organization' ? 'Tashkilot' : 'Sport inshoati'
    el.appendChild(title)
    values.forEach(v => {
        const row = document.createElement('div'); row.className = 'row'
        const sw = document.createElement('span'); sw.className = 'swatch'; sw.style.background = colorFor(v)
        const label = document.createElement('span'); label.textContent = v
        row.appendChild(sw); row.appendChild(label); el.appendChild(row)
    })
}

/** Markers + viewport */
function updateMarkers(data: typeof locations) {
    markers.value.forEach(m => m.remove())
    markers.value = []

    lastFiltered.value = data
    resultCount.value = data.length

    buildLegend(groupByCategory.value ? uniq(data.map(d => (d as any)[groupKey.value])) : [])

    data.forEach(loc => {
        const popup = new mapboxgl.Popup({ offset: 24, className: 'sport-popup' })
            .setHTML(`
          <div class="popup-card">
            <div class="popup-title">${loc.name}</div>
            <div class="popup-meta">${loc.type} · ${loc.facility}${loc.paid ? ' · Pullik' : ''}</div>
            <div class="popup-addr">${loc.address}</div>
          </div>
        `)
        const markerColor = groupByCategory.value ? colorFor((loc as any)[groupKey.value]) : '#1F51FF'
        const marker = new mapboxgl.Marker({ color: markerColor })
            .setLngLat([loc.lng, loc.lat])
            .setPopup(popup)
            .addTo(map.value!)
        markers.value.push(marker)
    })

    fitViewportToData(data)
}

function fitViewportToData(data: typeof locations) {
    if (!map.value) return
    if (data.length === 0) {
        map.value.fitBounds([[55.97, 37.18], [73.12, 46.59]], { padding: 80, duration: 600 })
        return
    }
    if (data.length === 1) {
        map.value.flyTo({ center: [data[0].lng, data[0].lat], zoom: 11.5, duration: 600 })
        return
    }
    const bounds = new mapboxgl.LngLatBounds()
    data.forEach(p => bounds.extend([p.lng, p.lat]))
    map.value.fitBounds(bounds, { padding: { top: 100, right: 100, bottom: 140, left: 360 }, maxZoom: 12, duration: 600 })
}

/** Apply / reset */
function applyFilters() {
    const data = dataForTab(activeTab.value)
    updateMarkers(data)
}
function resetFilters() {
    const blank: Filters = { sportType: '__ALL__', region: '__ALL__', organization: '__ALL__', facility: '__ALL__' }
    if (activeTab.value === 'facilities') filtersFacilities.value = { ...blank }
    else { filtersOrgLocations.value = { ...blank }; paidOnly.value = false }
    updateMarkers(locations)
}

/** Tabs */
function switchTab(t: TabKey) {
    if (activeTab.value === t) return
    activeTab.value = t
    applyFilters()
}

/** Reactivity — safe watcher (fixes [] is not a function) */
watch(
    () => ({
        filters: activeFilters.value,
        paid: paidOnly.value,
        groupBy: groupByCategory.value,
        key: groupKey.value,
        tab: activeTab.value
    }),
    () => { applyFilters() },
    { deep: true }
)

/** Map init */
onMounted(() => {
    if (!mapContainer.value) return
    map.value = new mapboxgl.Map({
        container: mapContainer.value,
        style: 'mapbox://styles/mapbox/dark-v11', // dark mode map
        center: [65, 40], zoom: 5
    })
    map.value.setMaxBounds([[55, 35], [75, 48]])

    map.value.on('load', () => {
        // Uzbekistan highlight (Saber colors)
        map.value!.addSource('country-bounds', { type: 'vector', url: 'mapbox://mapbox.country-boundaries-v1' })
        map.value!.addLayer({
            id: 'uzb-fill',
            type: 'fill',
            source: 'country-bounds',
            'source-layer': 'country_boundaries',
            filter: ['==', ['get', 'iso_3166_1_alpha_3'], 'UZB'],
            paint: { 'fill-color': '#fff', 'fill-opacity': 0.18 }
        })
        map.value!.addLayer({
            id: 'uzb-outline',
            type: 'line',
            source: 'country-bounds',
            'source-layer': 'country_boundaries',
            filter: ['==', ['get', 'iso_3166_1_alpha_3'], 'UZB'],
            paint: { 'line-color': '#fff', 'line-width': 2 }
        })

        updateMarkers(locations)
    })
})

onBeforeUnmount(() => map.value?.remove())
</script>

<style scoped>
/* ===== 7Saber Brand / Dark Mode ===== */

/* Layout */
.sportmap {
    position: relative;
    display: flex;
    height: 100vh;
    color: var(--text);
    background: var(--bg);
    font-family: Inter, system-ui, Segoe UI, Roboto, Ubuntu, 'Helvetica Neue', Arial
}

.fill-current{
    fill: #fff;
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
.logos img{
    height: 100%;
    object-fit: contain;
    width: 100px;
}
.fill-current{
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

/* Panel & Tabs */
.filter-panel-wrapper {
    width: 560px;
    position: absolute;
    top: 50%;
    left: 4%;
    transform: translateY(-50%);
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 14px;
    color: var(--text);
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

.tab-btn:hover {
    transform: translateY(-1px);
}

.tab-btn.active {
    box-shadow: 0 0 0 2px var(--ring), var(--shadow);
    background: linear-gradient(180deg, rgba(36, 44, 92, .95), rgba(20, 26, 48, .9));
    border-color: rgba(255, 255, 255, .16);
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
    letter-spacing: .5px;
    text-align: center;
    margin: 4px 0 12px;
    text-transform: uppercase;
    background: linear-gradient(90deg, #fff, #bfe9ff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

/* Count row */
.result-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.pill {
    background: rgba(0, 229, 255, .10);
    border: 1px solid rgba(0, 229, 255, .35);
    color: #c7f4ff;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
}

.dim-hint {
    opacity: .75;
    font-size: 12px;
}

/* Toggle */
.toggle-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 4px 0 8px;
}

.toggle {
    position: relative;
    width: 52px;
    height: 28px;
    display: inline-block;
}

.toggle input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: #2a2e44;
    transition: .2s ease;
    border: 1px solid rgba(255, 255, 255, .12);
}

.slider:before {
    position: absolute;
    content: "";
    width: 22px;
    height: 22px;
    top: 2.5px;
    left: 3px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, .25);
    transition: .2s ease;
}

.toggle.neon input:checked+.slider {
    background: linear-gradient(90deg, var(--primary) 0%, var(--primary-2) 100%);
    box-shadow: 0 0 0 3px rgba(31, 81, 255, .18);
}

.toggle.neon input:checked+.slider:before {
    transform: translateX(24px);
}

.toggle-label {
    user-select: none;
    font-weight: 700;
    letter-spacing: .2px;
}

/* Grid filters */
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
    letter-spacing: .3px;
}

/* Selects */
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
    transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
}

.select:focus {
    border-color: rgba(31, 81, 255, .6);
    box-shadow: 0 0 0 3px var(--ring);
    background: rgba(255, 255, 255, .09);
}

.select-caret {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #bfe9ff;
    opacity: .95;
}

/* Actions */
.actions {
    display: flex;
    gap: 10px;
    margin-top: 12px;
}

.button {
    flex: 1;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid transparent;
    font-weight: 800;
    letter-spacing: .2px;
    cursor: pointer;
    transition: transform .12s ease, box-shadow .12s ease, background .2s ease;
}

.button.primary {
    background: linear-gradient(90deg, var(--primary) 0%, var(--primary-2) 100%);
    color: #001221;
    box-shadow: 0 10px 24px rgba(31, 81, 255, .18), 0 6px 18px rgba(0, 229, 255, .18);
}

.button.primary:hover {
    transform: translateY(-1px);
}

.button.ghost {
    background: transparent;
    color: var(--text);
    border-color: rgba(255, 255, 255, .16);
}

.button.ghost:hover {
    background: rgba(255, 255, 255, .08);
}

/* Legend */
.legend {
    position: absolute;
    right: 12px;
    top: 12px;
    background: rgba(18, 22, 36, .74);
    color: #e8ecf4;
    padding: 12px 14px;
    border-radius: 14px;
    font-size: 12px;
    max-width: 260px;
    z-index: 3;
    border: 1px solid rgba(255, 255, 255, .12);
    backdrop-filter: blur(8px);
}

.legend .title {
    font-weight: 800;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: .3px;
}

.legend .row {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
}

.legend .swatch {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    margin-right: 8px;
}

/* Popup (brand) */
:deep(.mapboxgl-popup.sport-popup .mapboxgl-popup-content) {
    background: #0E1426;
    border: 1px solid rgba(0, 229, 255, .18);
    color: #ECF6FF;
    border-radius: 14px;
    padding: 12px 14px;
}

:deep(.mapboxgl-popup.sport-popup .popup-card) {
    display: grid;
    gap: 6px;
}

:deep(.mapboxgl-popup.sport-popup .popup-title) {
    font-weight: 900;
    font-size: 16px;
    letter-spacing: .2px;
    color: #EAF2FF;
}

:deep(.mapboxgl-popup.sport-popup .popup-meta) {
    opacity: .95;
    color: #9DEBFF;
}

:deep(.mapboxgl-popup.sport-popup .popup-addr) {
    font-size: 12px;
    opacity: .85;
}

:deep(.mapboxgl-popup.sport-popup .mapboxgl-popup-tip) {
    display: none;
}
.mobile{
    display: none;
}
/* Responsive */
@media (max-width:769px) {
    .filter-panel-wrapper {
        position: fixed;
        inset: auto 12px 12px 12px;
 
        transform: none;
        width: auto;
    }
}

@media (max-width:720px) {
    .grid {
        grid-template-columns: 1fr;
    }

    .actions {
        flex-direction: column;
    }
    .mobile{
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
.mobile h2{
    font-size: 22px;
    color: #fff;
    text-align: center;
}
}
</style>