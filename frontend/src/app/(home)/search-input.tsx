// search-input.tsx
"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSearchParam } from "@/hooks/use-search-params"

import { SearchIcon, X } from "lucide-react"
import { useRef, useState } from "react"

export const SearchInput = () => {
  const [search, setSearch] = useSearchParam("search")

  const [value, setValue] = useState(search) // sync initial value
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleClear = () => {
    setValue("")
    setSearch("")
    inputRef.current?.focus()
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setSearch(value)
    inputRef.current?.blur()
  }

  return (
    <div className="flex items-center w-full">
      <form
        onSubmit={handleSubmit}
        className="relative max-w-[720px] w-full"
      >
        {/* SEARCH ICON */}
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />

        {/* INPUT */}
        <Input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          placeholder="Search..."
          className="pl-9 pr-10"
        />

        {/* CLEAR BUTTON */}
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          >
            <X className="size-4" />
          </Button>
        )}
      </form>
    </div>
  )
}