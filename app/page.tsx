"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, ArrowRight, Zap, FileText, Calculator } from "lucide-react"
import { TypeformFlow } from "@/components/typeform-flow"
import { CurrencyToggle } from "@/components/currency-toggle"

export default function HomePage() {
  const [showForm, setShowForm] = useState(false)
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    phone: "",
    logo: null as string | null,
    logoName: "",
  })
  const [currency, setCurrency] = useState<"INR" | "USD">("INR")
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const handleStartAnalysis = () => {
    if (companyInfo.name && companyInfo.phone) {
      setShowForm(true)
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const dataUrl = reader.result as string
        setCompanyInfo((prev) => ({ ...prev, logo: dataUrl, logoName: file.name }))
        setLogoPreview(dataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  if (showForm) {
    // We need to pass the correct shape of companyInfo
    const { logoName, ...companyInfoForFlow } = companyInfo
    return <TypeformFlow companyInfo={companyInfoForFlow} currency={currency} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-yellow-400 to-orange-500">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">Solar Report Generator</span>
          </div>
          <CurrencyToggle currency={currency} onCurrencyChange={setCurrency} />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6 text-balance">Hi Solar Installer</h1>
          <p className="text-2xl text-white/90 mb-8 text-balance">
            Your client's professional breakeven analysis report is just 2 mins away
          </p>
          <div className="inline-flex items-center gap-2 text-lg text-white/80 mb-8">
            <span>Ya weren't kidding</span>
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>

        {/* Company Information Card */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">Company Information</CardTitle>
            <p className="text-gray-600">Enter your company details to get started</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Company Name *</label>
              <Input
                type="text"
                placeholder="Enter your company name"
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo((prev) => ({ ...prev, name: e.target.value }))}
                className="h-12 text-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Company Phone Number *</label>
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={companyInfo.phone}
                onChange={(e) => setCompanyInfo((prev) => ({ ...prev, phone: e.target.value }))}
                className="h-12 text-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attach Your Company Logo</label>
              {!logoPreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">JPG, PNG files only</p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="inline-block mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600 transition-colors"
                  >
                    Choose File
                  </label>
                </div>
              ) : (
                <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
                  <div className="flex items-center gap-4">
                    <img
                      src={logoPreview || "/placeholder.svg"}
                      alt="Company Logo Preview"
                      className="h-16 w-16 object-contain rounded-lg border bg-white"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800">✓ {companyInfo.logoName}</p>
                      <p className="text-xs text-green-600">Logo uploaded successfully</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCompanyInfo((prev) => ({ ...prev, logo: null, logoName: "" }))
                        setLogoPreview(null)
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleStartAnalysis}
              disabled={!companyInfo.name || !companyInfo.phone}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white border-0 shadow-lg"
            >
              <Calculator className="h-5 w-5 mr-2" />
              START ANALYSIS
            </Button>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Professional Reports</h3>
              <p className="text-gray-600">Generate comprehensive 25-year breakeven analysis reports</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Calculator className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Accurate Calculations</h3>
              <p className="text-gray-600">Precise ROI, payback period, and cash flow projections</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quick Generation</h3>
              <p className="text-gray-600">Complete analysis in just 2 minutes with our smart form</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
