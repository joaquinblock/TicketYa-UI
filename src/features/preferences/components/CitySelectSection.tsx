import { Select } from '@/shared/components/atoms/Select'

type CitySelectSectionProps = {
  cities: string[]
  city: string | null
  onChange: (city: string | null) => void
}

export function CitySelectSection({ cities, city, onChange }: CitySelectSectionProps) {
  return (
    <section className="flex flex-col gap-3.5 border-t border-line px-4 py-5 md:px-6.5 md:py-6">
      <label
        id="pref-city-label"
        htmlFor="pref-city"
        className="font-display text-[19px] font-bold tracking-tight"
      >
        Tu ciudad
      </label>
      <Select
        id="pref-city"
        value={city ?? ''}
        onChange={(event) => onChange(event.target.value || null)}
        className="max-w-80 text-base"
      >
        <option value="">Sin preferencia</option>
        {cities.map((cityOption) => (
          <option key={cityOption} value={cityOption}>
            {cityOption}
          </option>
        ))}
      </Select>
    </section>
  )
}
