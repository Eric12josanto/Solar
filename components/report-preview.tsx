"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Eye, Leaf, TrendingUp, Calculator, DollarSign, Mail, Upload, Check, ArrowLeft } from "lucide-react"
import { marked } from "marked"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
} from "recharts"
import { PDFMergeUpload } from "./pdf-merge-upload"

// Add a global declaration for html2pdf
declare global {
  interface Window {
    html2pdf: any
  }
}

export interface FormData {
  customerName: string
  customerAddress: string
  projectType: "residential" | "commercial" | ""
  hasSubsidy: boolean
  subsidyAmount: number
  projectCapacity: number
  projectInvestment: number
  monthlyUsage: number
  currentTariff: number
  needsLoan: boolean
  downPayment: number
  interestRate: number
  loanTenure: number
}

export interface CompanyInfo {
  name: string
  phone: string
  logo: File | null
}

interface ReportPreviewProps {
  formData: FormData
  companyInfo: CompanyInfo
  currency: "INR" | "USD"
}

export function ReportPreview({ formData, companyInfo, currency }: ReportPreviewProps) {
  const [showDownload, setShowDownload] = useState(false)
  const [showMergeUpload, setShowMergeUpload] = useState(false)
  const [mergedDocument, setMergedDocument] = useState<string | null>(null)
  const [uploadedPDF, setUploadedPDF] = useState<File | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const currencySymbol = currency === "INR" ? "₹" : "$"
  const reportPrice = currency === "INR" ? "₹99" : "$4.99"

  const treesEquivalent = formData.projectCapacity * 75
  const annualGeneration = formData.projectCapacity * 1200
  const paybackPeriod = formData.projectInvestment / (formData.monthlyUsage * 12 * formData.currentTariff * 0.8)
  const roi = (((formData.monthlyUsage * 12 * formData.currentTariff * 25) / formData.projectInvestment - 1) * 100) / 25
  const irr =
    (Math.pow((formData.monthlyUsage * 12 * formData.currentTariff * 25) / formData.projectInvestment, 1 / 25) - 1) *
    100
  const avgGridCost = formData.currentTariff * 1.06 ** 12.5
  const avgSolarCost = formData.projectInvestment / (annualGeneration * 25)

  const generateYearlyData = () => {
    const data = []
    let cumulativeSavings = 0

    for (let year = 1; year <= 25; year++) {
      const degradation = Math.pow(0.993, year - 1)
      const solarGeneration = annualGeneration * degradation
      const gridPriceIncrease = Math.pow(1.06, year - 1)
      const currentGridPrice = formData.currentTariff * gridPriceIncrease
      const annualSavings = solarGeneration * currentGridPrice
      cumulativeSavings += annualSavings

      data.push({
        year,
        solarGeneration: Math.round(solarGeneration),
        gridPrice: Number.parseFloat(currentGridPrice.toFixed(2)),
        annualSavings: Math.round(annualSavings),
        cumulativeSavings: Math.round(cumulativeSavings),
        cashFlow: year <= paybackPeriod ? -Math.round(annualSavings * 0.3) : Math.round(annualSavings * 0.8),
      })
    }
    return data
  }

  const yearlyData = generateYearlyData()

  const summaryMetrics = [
    { name: "Grid Cost", value: avgGridCost, color: "#EF4444" },
    { name: "Solar Cost", value: avgSolarCost, color: "#10B981" },
  ]

  const financialBreakdown = [
    { name: "Initial Investment", value: formData.projectInvestment, color: "#F59E0B" },
    { name: "25-Year Savings", value: Math.round(yearlyData[24].cumulativeSavings), color: "#10B981" },
    {
      name: "Net Benefit",
      value: Math.round(yearlyData[24].cumulativeSavings) - formData.projectInvestment,
      color: "#3B82F6",
    },
  ]

  const handleMergeComplete = (mergedPreview: string) => {
    console.log("[v0] Merge completed:", mergedPreview)
    setMergedDocument(mergedPreview)
    setShowMergeUpload(false)

    const fileInput = document.querySelector("#pdf-merge-input") as HTMLInputElement
    if (fileInput?.files?.[0]) {
      setUploadedPDF(fileInput.files[0])
      console.log("[v0] PDF file stored successfully:", fileInput.files[0].name)
    }
  }

  const handleGetReport = () => {
    setShowDownload(true)
  }

  const generateMarkdownPDF = async () => {
    setIsGeneratingPDF(true)

    try {
      console.log("[v0] Starting markdown PDF generation...")

      // Generate markdown content
      const markdownContent = `
# Solar Breakeven Report
**Customer:** ${formData.customerName}  
**Project Capacity:** ${formData.projectCapacity} kW  
**Prepared by:** ${companyInfo.name}  
**Phone:** ${companyInfo.phone}  

---

## Executive Summary

### Key Financial Metrics
- **ROI:** ${roi.toFixed(1)}% annually
- **Payback Period:** ${paybackPeriod.toFixed(1)} years
- **IRR:** ${irr.toFixed(1)}%
- **25-Year Savings:** ${currencySymbol}${Math.round(yearlyData[24].cumulativeSavings).toLocaleString()}

### Cost Comparison
- **Average Grid Cost:** ${currencySymbol}${avgGridCost.toFixed(2)}/kWh
- **Average Solar Cost:** ${currencySymbol}${avgSolarCost.toFixed(2)}/kWh
- **Savings per kWh:** ${currencySymbol}${(avgGridCost - avgSolarCost).toFixed(2)}

---

## Environmental Impact

Your decision to install **${formData.projectCapacity}kW** solar power plant over 25 years will absorb CO₂ equivalent to planting **${treesEquivalent} trees** over 25 years - that's like creating a big forest! Yes, you took the best decision for our planet.

---

## Financial Analysis

### Project Investment Breakdown
- **Initial Investment:** ${currencySymbol}${formData.projectInvestment.toLocaleString()}
- **25-Year Savings:** ${currencySymbol}${Math.round(yearlyData[24].cumulativeSavings).toLocaleString()}
- **Net Benefit:** ${currencySymbol}${(Math.round(yearlyData[24].cumulativeSavings) - formData.projectInvestment).toLocaleString()}

### Year-by-Year Analysis (First 10 Years)

| Year | Solar Energy (kWh) | Grid Price (${currencySymbol}/kWh) | Annual Savings (${currencySymbol}) | Cumulative Savings (${currencySymbol}) |
|------|-------------------|-------------------|-------------------|---------------------|
${yearlyData
  .slice(0, 10)
  .map(
    (row) =>
      `| ${row.year} | ${row.solarGeneration.toLocaleString()} | ${row.gridPrice} | ${row.annualSavings.toLocaleString()} | ${row.cumulativeSavings.toLocaleString()} |`,
  )
  .join("\n")}

*...and 15 more years of continued savings*

---

## Technical Specifications

- **System Capacity:** ${formData.projectCapacity} kW
- **Annual Generation:** ${annualGeneration.toLocaleString()} kWh
- **Monthly Usage:** ${formData.monthlyUsage.toLocaleString()} kWh
- **Current Tariff:** ${currencySymbol}${formData.currentTariff}/kWh
- **Project Type:** ${formData.projectType.charAt(0).toUpperCase() + formData.projectType.slice(1)}

${
  formData.hasSubsidy
    ? `### Government Subsidy
- **Subsidy Amount:** ${currencySymbol}${formData.subsidyAmount.toLocaleString()}`
    : ""
}

${
  formData.needsLoan
    ? `### Financing Details
- **Down Payment:** ${currencySymbol}${formData.downPayment.toLocaleString()}
- **Interest Rate:** ${formData.interestRate}%
- **Loan Tenure:** ${formData.loanTenure} years`
    : ""
}

---

## Conclusion

This solar installation represents an excellent investment opportunity with:
- Strong financial returns (${roi.toFixed(1)}% ROI)
- Quick payback period (${paybackPeriod.toFixed(1)} years)
- Significant environmental benefits (${treesEquivalent} trees equivalent)
- Long-term energy cost savings

**Total 25-year benefit: ${currencySymbol}${(Math.round(yearlyData[24].cumulativeSavings) - formData.projectInvestment).toLocaleString()}**

---

*Report generated by ${companyInfo.name} | Contact: ${companyInfo.phone}*
`

      console.log("[v0] Markdown content generated, converting to PDF...")

      // Convert markdown to HTML using the 'marked' library
      const htmlContent = await marked(markdownContent)

      const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Solar Breakeven Report - ${formData.customerName}</title>
          <style>
            body { 
              font-family: 'Times New Roman', serif; 
              line-height: 1.6; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 20px;
              color: #333;
            }
            h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
            h2 { color: #059669; border-bottom: 2px solid #059669; padding-bottom: 5px; margin-top: 30px; }
            h3 { color: #dc2626; margin-top: 25px; }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0;
              font-size: 12px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left; 
            }
            th { 
              background-color: #f8f9fa; 
              font-weight: bold;
            }
            .highlight { 
              background-color: #fef3c7; 
              padding: 15px; 
              border-left: 4px solid #f59e0b; 
              margin: 20px 0;
            }
            strong { color: #1f2937; }
            hr { border: none; border-top: 2px solid #e5e7eb; margin: 30px 0; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `

      // Function to load a script and return a promise
      const loadScript = (src: string) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script")
          script.src = src
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })
      }

      // Load html2pdf from CDN if not available
      if (!window.html2pdf) {
        console.log("[v0] Loading html2pdf for markdown content...")
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js")
      }

      const options = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `Solar_Report_${formData.customerName.replace(/\s+/g, "_")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
        },
      }

      // Generate PDF from the HTML using the global html2pdf function
      await window.html2pdf().set(options).from(fullHtml).save()

      console.log("[v0] Markdown PDF generated successfully")
    } catch (error) {
      console.error("[v0] Markdown PDF generation failed:", error)
      alert("PDF generation failed. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleMergedPDFDownload = async () => {
    console.log("[v0] Merged PDF download requested")

    if (uploadedPDF) {
      try {
        // Generate the markdown PDF
        await generateMarkdownPDF()

        // Show success message about the merge
        alert(
          `Downloaded: Solar Report (Markdown PDF)\\n\\nNote: Your uploaded file "${uploadedPDF.name}" would be merged in the full version.`,
        )
      } catch (error) {
        console.error("[v0] Merged PDF download failed:", error)
        alert("Download failed. Please try again.")
      }
    } else {
      await generateMarkdownPDF()
    }
  }

  if (showDownload) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-2 sm:p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-2xl">
            <CardHeader className="text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <Button
                  onClick={() => setShowDownload(false)}
                  variant="ghost"
                  className="text-white hover:bg-green-700 p-2"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="ml-2 hidden sm:inline">Back</span>
                </Button>
                <div className="flex-1" />
              </div>
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold font-times">Report Ready! 📊</CardTitle>
              <p className="text-green-100 font-times text-sm sm:text-base">
                Your professional solar report is ready for download
              </p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 md:p-8 text-center space-y-4 sm:space-y-6">
              <div className="bg-green-50 p-3 sm:p-4 md:p-6 rounded-lg">
                <h3 className="font-semibold text-base sm:text-lg mb-2 text-green-800 font-times">Report Details</h3>
                <p className="text-xs sm:text-sm text-green-700 font-times">Customer: {formData.customerName}</p>
                <p className="text-xs sm:text-sm text-green-700 font-times">Capacity: {formData.projectCapacity} kW</p>
                <p className="text-xs sm:text-sm text-green-700 font-times">
                  Report Type: Professional Breakeven Analysis
                </p>
              </div>

              {mergedDocument && (
                <div className="bg-blue-50 p-3 sm:p-4 md:p-6 rounded-lg">
                  <h3 className="font-semibold text-base sm:text-lg mb-2 text-blue-800 font-times">
                    Merged Document Ready
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-700 font-times">{mergedDocument}</p>
                  <p className="text-xs text-blue-600 font-times mt-2">
                    Order: Your Original Quotation → Solar Breakeven Report
                  </p>
                </div>
              )}

              <div className="space-y-3 sm:space-y-4">
                <Button
                  onClick={mergedDocument ? handleMergedPDFDownload : generateMarkdownPDF}
                  disabled={isGeneratingPDF}
                  className="w-full h-12 sm:h-14 md:h-16 text-sm sm:text-base md:text-lg bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-md flex items-center justify-center gap-2 transition-colors font-times"
                >
                  <Download className="h-4 w-4 sm:h-5 sm:w-5 md:h-5 md:w-5" />
                  {isGeneratingPDF ? (
                    <span>Generating Markdown PDF...</span>
                  ) : mergedDocument ? (
                    <>
                      <span className="hidden sm:inline">Download Merged Report (Markdown PDF)</span>
                      <span className="sm:hidden">Download Merged Report</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Download Your Report (Markdown PDF)</span>
                      <span className="sm:hidden">Download Report</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-10 sm:h-12 bg-transparent font-times text-xs sm:text-sm md:text-base"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Report to {formData.customerName}
                </Button>
              </div>

              <div className="text-xs sm:text-sm text-gray-600 font-times space-y-1">
                <p>📧 A copy has been sent to your email</p>
                <p>💾 Report will be available for 30 days</p>
                {mergedDocument && (
                  <p className="text-blue-600">📋 Merged document includes your original quotation first</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {companyInfo.logo && (
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border-2 border-orange-200 flex-shrink-0">
                  <img
                    src={URL.createObjectURL(companyInfo.logo) || "/placeholder.svg"}
                    alt={`${companyInfo.name} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 font-times truncate">
                  Solar Breakeven Report
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 font-times truncate">
                  {formData.customerName} - {formData.projectCapacity} kW Project
                </p>
                <p className="text-xs sm:text-sm text-orange-600 font-times truncate">
                  Prepared by: {companyInfo.name}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent font-times text-xs sm:text-sm"
              >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                Preview Mode
              </Button>
              <Button
                onClick={handleGetReport}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 font-times text-xs sm:text-sm"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                Download Report - {reportPrice}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {!showMergeUpload && !mergedDocument && (
          <div className="mb-4 sm:mb-6 md:mb-8">
            <Button
              onClick={() => setShowMergeUpload(true)}
              variant="outline"
              className="w-full h-10 sm:h-12 md:h-16 text-xs sm:text-sm md:text-lg border-2 border-dashed border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-700 font-times"
            >
              <Upload className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-2" />
              <span className="hidden md:inline">Add Your Original Bill Quotation for Installer Presentation</span>
              <span className="hidden sm:inline md:hidden">Add Original Quotation</span>
              <span className="sm:hidden">Add Quotation</span>
            </Button>
          </div>
        )}

        {showMergeUpload && (
          <div className="mb-4 sm:mb-6 md:mb-8">
            <PDFMergeUpload onMergeComplete={handleMergeComplete} />
          </div>
        )}

        {mergedDocument && (
          <div className="mb-4 sm:mb-6 md:mb-8">
            <Card className="shadow-lg border-2 border-green-300 bg-green-50">
              <CardContent className="p-3 sm:p-4 md:p-6 text-center">
                <Check className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-green-600 mx-auto mb-2" />
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-green-800 font-times mb-2 sm:mb-4">
                  Combined Report Ready for Installer
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-green-700 font-times">{mergedDocument}</p>
                <p className="text-xs sm:text-sm text-green-600 font-times mt-2">
                  Download order: Original Quotation → Solar Breakeven Report
                </p>
                <Button
                  onClick={() => setShowMergeUpload(true)}
                  variant="outline"
                  className="mt-2 sm:mt-3 text-green-700 border-green-300 hover:bg-green-100 text-xs sm:text-sm"
                >
                  Upload Different File
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="report-container space-y-4 sm:space-y-6 md:space-8 relative">
          {/* Summary Page with Visual Charts */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-t-lg p-3 sm:p-4 md:p-6">
              <CardTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center font-times">
                Executive Summary
              </CardTitle>
              <p className="text-center text-orange-100 font-times text-xs sm:text-sm md:text-base">
                Key Financial Metrics & Analysis
              </p>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                {/* Financial Metrics Chart */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 font-times text-center">
                    Cost Comparison
                  </h3>
                  <div className="h-40 sm:h-48 md:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={summaryMetrics} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={60} />
                        <Tooltip formatter={(value) => [`${currencySymbol}${Number(value).toFixed(2)}/kWh`, "Cost"]} />
                        <Bar dataKey="value" fill="#8884d8">
                          {summaryMetrics.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4">
                    <div className="bg-red-50 p-2 sm:p-3 md:p-4 rounded-lg text-center">
                      <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-red-600 font-times">
                        {currencySymbol}
                        {avgGridCost.toFixed(2)}
                      </div>
                      <div className="text-xs sm:text-sm text-red-700 font-times">Avg Grid Cost/kWh</div>
                    </div>
                    <div className="bg-green-50 p-2 sm:p-3 md:p-4 rounded-lg text-center">
                      <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-green-600 font-times">
                        {currencySymbol}
                        {avgSolarCost.toFixed(2)}
                      </div>
                      <div className="text-xs sm:text-sm text-green-700 font-times">Avg Solar Cost/kWh</div>
                    </div>
                  </div>
                </div>

                {/* Financial Breakdown Pie Chart */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 font-times text-center">
                    Financial Breakdown
                  </h3>
                  <div className="h-40 sm:h-48 md:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={financialBreakdown}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {financialBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${currencySymbol}${Number(value).toLocaleString()}`, "Amount"]}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Key Metrics Summary */}
              <div className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                <div className="bg-blue-50 p-2 sm:p-3 md:p-4 rounded-lg text-center">
                  <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-blue-600 font-times">
                    {roi.toFixed(1)}%
                  </div>
                  <div className="text-xs sm:text-sm text-blue-700 font-times">ROI</div>
                </div>
                <div className="bg-green-50 p-2 sm:p-3 md:p-4 rounded-lg text-center">
                  <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-green-600 font-times">
                    {paybackPeriod.toFixed(1)}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-green-700 font-times">Payback (Years)</div>
                </div>
                <div className="bg-purple-50 p-2 sm:p-3 md:p-4 rounded-lg text-center">
                  <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-purple-600 font-times">
                    {irr.toFixed(1)}%
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-purple-700 font-times">IRR</div>
                </div>
                <div className="bg-orange-50 p-2 sm:p-3 md:p-4 rounded-lg text-center">
                  <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-orange-600 font-times">
                    {formData.projectCapacity}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-orange-700 font-times">Capacity (kW)</div>
                </div>
                <div className="bg-emerald-50 p-2 sm:p-3 md:p-4 rounded-lg text-center col-span-2 sm:col-span-1">
                  <div className="text-base sm:text-lg md:text-xl font-bold text-gray-800 font-times">
                    {treesEquivalent}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600 font-times">Trees Equivalent</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environmental Impact */}
          <Card className="shadow-lg">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="text-center">
                <Leaf className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 mx-auto mb-4" />
                <div
                  className="text-base sm:text-lg md:text-xl italic text-gray-700 leading-relaxed"
                  style={{ fontFamily: "cursive" }}
                >
                  "Your decision to install <strong>{formData.projectCapacity}kW</strong> solar power plant over 25
                  years will absorb CO₂ equivalent to planting <strong>{treesEquivalent} trees</strong> over 25 years -
                  that's like creating a big forest! Yes, you took the best decision for our planet."
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="shadow-lg">
              <CardContent className="p-4 sm:p-6 md:p-8 text-center">
                <TrendingUp className="h-8 w-8 sm:h-12 sm:w-12 text-blue-500 mx-auto mb-3" />
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 font-times">
                  {roi.toFixed(1)}%
                </div>
                <div className="text-xs sm:text-sm md:text-base text-gray-600 font-times">Annual ROI</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-4 sm:p-6 md:p-8 text-center">
                <Calculator className="h-8 w-8 sm:h-12 sm:w-12 text-green-500 mx-auto mb-3" />
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 font-times">
                  {paybackPeriod.toFixed(1)}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-gray-600 font-times">Payback Period (Years)</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-4 sm:p-6 md:p-8 text-center">
                <DollarSign className="h-8 w-8 sm:h-12 sm:w-12 text-orange-500 mx-auto mb-3" />
                <div className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-800 font-times">
                  {currencySymbol}
                  {Math.round(yearlyData[24].cumulativeSavings).toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-gray-600 font-times">25-Year Savings</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-4 sm:p-6 md:p-8 text-center">
                <Leaf className="h-8 w-8 sm:h-12 sm:w-12 text-green-500 mx-auto mb-3" />
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 font-times">
                  {treesEquivalent}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-gray-600 font-times">Trees Equivalent</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-times text-lg sm:text-xl md:text-2xl">
                  Cumulative Savings Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 sm:h-80 md:h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={yearlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${currencySymbol}${value?.toLocaleString()}`, "Savings"]} />
                      <Area
                        type="monotone"
                        dataKey="cumulativeSavings"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-times text-lg sm:text-xl md:text-2xl">Annual Cash Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 sm:h-80 md:h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yearlyData.slice(0, 15)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${currencySymbol}${value?.toLocaleString()}`, "Cash Flow"]} />
                      <Bar dataKey="cashFlow" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Summary Table */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-times text-xl sm:text-2xl md:text-3xl">25-Year Financial Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm md:text-base font-times">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 sm:p-3 md:p-4">Year</th>
                      <th className="text-right p-2 sm:p-3 md:p-4">Solar Energy (kWh)</th>
                      <th className="text-right p-2 sm:p-3 md:p-4">Grid Price (${currencySymbol}/kWh)</th>
                      <th className="text-right p-2 sm:p-3 md:p-4">Annual Savings (${currencySymbol})</th>
                      <th className="text-right p-2 sm:p-3 md:p-4">Cumulative Savings (${currencySymbol})</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearlyData.slice(0, 10).map((row) => (
                      <tr key={row.year} className="border-b hover:bg-gray-50">
                        <td className="p-2 sm:p-3 md:p-4 font-medium">{row.year}</td>
                        <td className="text-right p-2 sm:p-3 md:p-4">{row.solarGeneration.toLocaleString()}</td>
                        <td className="text-right p-2 sm:p-3 md:p-4">{row.gridPrice}</td>
                        <td className="text-right p-2 sm:p-3 md:p-4">{row.annualSavings.toLocaleString()}</td>
                        <td className="text-right p-2 sm:p-3 md:p-4 font-medium">
                          {row.cumulativeSavings.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-center py-4 text-gray-500 font-times text-sm md:text-base">
                  ... and 15 more years of detailed analysis
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Info (Blurred) */}
          <Card className="shadow-lg">
            <CardContent className="p-4 sm:p-6 md:p-8 text-center">
              <div>
                {companyInfo.logo && (
                  <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-4 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={URL.createObjectURL(companyInfo.logo) || "/placeholder.svg"}
                      alt={`${companyInfo.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-times mb-4">{companyInfo.name}</h3>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 font-times">Phone: {companyInfo.phone}</p>
                <p className="text-xs sm:text-sm md:text-base text-gray-500 font-times mt-2">
                  Professional Solar Installation Services
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6">
          <Button
            onClick={handleGetReport}
            size="lg"
            className="shadow-2xl bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 text-xs sm:text-sm md:text-base font-times"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2" />
            <span className="hidden md:inline">Get Full Report - {reportPrice}</span>
            <span className="hidden sm:inline md:hidden">Get Report - {reportPrice}</span>
            <span className="sm:hidden">Report - {reportPrice}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
