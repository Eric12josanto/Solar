"use client"

import { Button } from "@/components/ui/button"
import { IndianRupee, DollarSign } from "lucide-react"

interface CurrencyToggleProps {
  currency: "INR" | "USD"
  onCurrencyChange: (currency: "INR" | "USD") => void
}

export function CurrencyToggle({ currency, onCurrencyChange }: CurrencyToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg p-1">
      <Button
        variant={currency === "INR" ? "default" : "ghost"}
        size="sm"
        onClick={() => onCurrencyChange("INR")}
        className={`currency-toggle ${
          currency === "INR" ? "bg-white text-orange-600 hover:bg-white/90" : "text-white hover:bg-white/20"
        }`}
      >
        <IndianRupee className="h-4 w-4 mr-1" />
        INR
      </Button>
      <Button
        variant={currency === "USD" ? "default" : "ghost"}
        size="sm"
        onClick={() => onCurrencyChange("USD")}
        className={`currency-toggle ${
          currency === "USD" ? "bg-white text-orange-600 hover:bg-white/90" : "text-white hover:bg-white/20"
        }`}
      >
        <DollarSign className="h-4 w-4 mr-1" />
        USD
      </Button>
    </div>
  )
}
