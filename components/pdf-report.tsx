"use client"

import type React from "react"

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from "@react-pdf/renderer"
import type { FormData, CompanyInfo } from "./report-preview"

Font.register({
  family: "Times-Roman",
  src: "https://fonts.gstatic.com/s/crimsontext/v19/wlp2gwHKFkZgtmSR3NB0oRJvaAJSA_JN3Q.woff2",
})

Font.register({
  family: "Cursive",
  src: "https://fonts.gstatic.com/s/dancingscript/v25/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7BMSo3Sup8.woff2",
})

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontFamily: "Times-Roman",
  },
  coverPage: {
    flexDirection: "column",
    backgroundColor: "#FF8C00",
    padding: 0,
    minHeight: "100vh",
    position: "relative",
    fontFamily: "Times-Roman",
  },
  installerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    borderLeft: "4 solid #FF8C00",
  },
  installerLogo: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 4,
  },
  installerInfo: {
    flex: 1,
  },
  installerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    fontFamily: "Times-Roman",
    marginBottom: 3,
  },
  installerPhone: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Times-Roman",
  },
  installerTagline: {
    fontSize: 10,
    color: "#9CA3AF",
    fontFamily: "Times-Roman",
    fontStyle: "italic",
  },
  coverGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, #FF8C00 0%, #FFD700 100%)",
  },
  coverContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 60,
    zIndex: 1,
  },
  coverTitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontFamily: "Times-Roman",
  },
  coverSubtitle: {
    fontSize: 24,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 40,
    fontWeight: "bold",
    fontFamily: "Times-Roman",
  },
  coverDate: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 40,
    fontFamily: "Times-Roman",
  },
  coverCompany: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
  },
  coverCompanyName: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
    fontFamily: "Times-Roman",
  },
  header: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: "center",
    color: "#1F2937",
    fontWeight: "bold",
    borderBottom: "3 solid #FF8C00",
    paddingBottom: 10,
    fontFamily: "Times-Roman",
  },
  subHeader: {
    fontSize: 20,
    marginBottom: 15,
    color: "#374151",
    fontWeight: "bold",
    fontFamily: "Times-Roman",
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
    color: "#4B5563",
    lineHeight: 1.5,
    fontFamily: "Times-Roman",
  },
  boldText: {
    fontSize: 12,
    marginBottom: 10,
    color: "#1F2937",
    fontWeight: "bold",
    fontFamily: "Times-Roman",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: "#E5E7EB",
    marginBottom: 20,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#E5E7EB",
    backgroundColor: "#F3F4F6",
    padding: 8,
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#E5E7EB",
    padding: 8,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1F2937",
    fontFamily: "Times-Roman",
  },
  tableCell: {
    fontSize: 10,
    color: "#4B5563",
    fontFamily: "Times-Roman",
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  metricBox: {
    width: "22%",
    backgroundColor: "#F9FAFB",
    padding: 15,
    borderRadius: 8,
    borderLeft: "4 solid #FF8C00",
    alignItems: "center",
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 5,
    fontFamily: "Times-Roman",
  },
  metricLabel: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
    fontFamily: "Times-Roman",
  },
  environmentalQuote: {
    backgroundColor: "#ECFDF5",
    padding: 20,
    borderRadius: 8,
    borderLeft: "4 solid #10B981",
    marginBottom: 30,
  },
  quoteText: {
    fontSize: 14,
    color: "#065F46",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 1.6,
    fontFamily: "Cursive",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 10,
    color: "#6B7280",
    fontFamily: "Times-Roman",
  },
  summaryContainer: {
    marginBottom: 30,
  },
  chartContainer: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Times-Roman",
  },
  summaryMetric: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    borderLeft: "3 solid #FF8C00",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#374151",
    fontFamily: "Times-Roman",
    fontWeight: "bold",
  },
  summaryValue: {
    fontSize: 12,
    color: "#1F2937",
    fontFamily: "Times-Roman",
    fontWeight: "bold",
  },
})

interface PDFReportProps {
  formData: FormData
  companyInfo: CompanyInfo
  currency: "INR" | "USD"
}

export function PDFReport({ formData, companyInfo, currency }: PDFReportProps) {
  const currencySymbol = currency === "INR" ? "₹" : "$"

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
      })
    }
    return data
  }

  const yearlyData = generateYearlyData()
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverContent}>
          <Text style={styles.coverTitle}>Solar Report</Text>
          <Text style={styles.coverSubtitle}>{companyInfo.name}</Text>
          <Text style={styles.coverDate}>{currentDate}</Text>
        </View>
        <View style={styles.coverCompany}>
          <Text style={styles.coverCompanyName}>Professional Breakeven Analysis</Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.installerHeader}>
          {companyInfo.logo && (
            <Text style={styles.installerLogo}>Logo Placeholder</Text> // Placeholder for Image component
          )}
          <View style={styles.installerInfo}>
            <Text style={styles.installerName}>{companyInfo.name}</Text>
            <Text style={styles.installerPhone}>Phone: {companyInfo.phone}</Text>
            <Text style={styles.installerTagline}>Professional Solar Installation Services</Text>
          </View>
        </View>

        <Text style={styles.header}>Executive Summary</Text>

        <View style={styles.summaryContainer}>
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Key Financial Metrics</Text>

            <View style={styles.summaryMetric}>
              <Text style={styles.summaryLabel}>Average Grid Electricity Cost</Text>
              <Text style={styles.summaryValue}>
                {currencySymbol}
                {avgGridCost.toFixed(2)}/kWh
              </Text>
            </View>

            <View style={styles.summaryMetric}>
              <Text style={styles.summaryLabel}>Average Solar Electricity Cost</Text>
              <Text style={styles.summaryValue}>
                {currencySymbol}
                {avgSolarCost.toFixed(2)}/kWh
              </Text>
            </View>

            <View style={styles.summaryMetric}>
              <Text style={styles.summaryLabel}>Return On Investment (ROI)</Text>
              <Text style={styles.summaryValue}>{roi.toFixed(1)}% annually</Text>
            </View>

            <View style={styles.summaryMetric}>
              <Text style={styles.summaryLabel}>Payback Period</Text>
              <Text style={styles.summaryValue}>{paybackPeriod.toFixed(1)} years</Text>
            </View>

            <View style={styles.summaryMetric}>
              <Text style={styles.summaryLabel}>Internal Rate of Return (IRR)</Text>
              <Text style={styles.summaryValue}>{irr.toFixed(1)}%</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Environmental Impact</Text>

            <View style={styles.summaryMetric}>
              <Text style={styles.summaryLabel}>System Capacity</Text>
              <Text style={styles.summaryValue}>{formData.projectCapacity} kW</Text>
            </View>

            <View style={styles.summaryMetric}>
              <Text style={styles.summaryLabel}>Trees Equivalent (25 years)</Text>
              <Text style={styles.summaryValue}>{treesEquivalent}</Text>
            </View>

            <View style={styles.summaryMetric}>
              <Text style={styles.summaryLabel}>Annual Energy Generation</Text>
              <Text style={styles.summaryValue}>{annualGeneration.toLocaleString()} kWh</Text>
            </View>

            <View style={styles.summaryMetric}>
              <Text style={styles.summaryLabel}>25-Year Total Savings</Text>
              <Text style={styles.summaryValue}>
                {currencySymbol}
                {Math.round(yearlyData[24].cumulativeSavings).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.environmentalQuote}>
          <Text style={styles.quoteText}>
            "Your decision to install {formData.projectCapacity}kW solar power plant over 25 years will absorb CO₂
            equivalent to planting {treesEquivalent} trees over 25 years - that's like creating a big forest! Yes, you
            took the best decision for our planet."
          </Text>
        </View>

        <Text style={styles.footer}>
          Generated by {companyInfo.name} | {companyInfo.phone} | Page 1
        </Text>
      </Page>

      {/* Executive Summary */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Project Details</Text>

        <View style={styles.metricsContainer}>
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>{roi.toFixed(1)}%</Text>
            <Text style={styles.metricLabel}>Annual ROI</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>{paybackPeriod.toFixed(1)}</Text>
            <Text style={styles.metricLabel}>Payback Period (Years)</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>
              {currencySymbol}
              {Math.round(yearlyData[24].cumulativeSavings).toLocaleString()}
            </Text>
            <Text style={styles.metricLabel}>25-Year Savings</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>{treesEquivalent}</Text>
            <Text style={styles.metricLabel}>Trees Equivalent</Text>
          </View>
        </View>

        <Text style={styles.subHeader}>Project Information</Text>
        <Text style={styles.text}>Customer Name: {formData.customerName}</Text>
        <Text style={styles.text}>Project Address: {formData.customerAddress}</Text>
        <Text style={styles.text}>Project Type: {formData.projectType}</Text>
        <Text style={styles.text}>System Capacity: {formData.projectCapacity} kW</Text>
        <Text style={styles.text}>
          Total Investment: {currencySymbol}
          {formData.projectInvestment.toLocaleString()}
        </Text>
        <Text style={styles.text}>Monthly Energy Usage: {formData.monthlyUsage} kWh</Text>
        <Text style={styles.text}>
          Current Electricity Tariff: {currencySymbol}
          {formData.currentTariff}/kWh
        </Text>

        <Text style={styles.footer}>
          Generated by {companyInfo.name} | {companyInfo.phone} | Page 2
        </Text>
      </Page>

      {/* Financial Analysis */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>25-Year Financial Analysis</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Year</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Solar Energy (kWh)</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Grid Price ({currencySymbol}/kWh)</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Annual Savings ({currencySymbol})</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Cumulative Savings ({currencySymbol})</Text>
            </View>
          </View>

          {yearlyData.slice(0, 15).map((row) => (
            <View style={styles.tableRow} key={row.year}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{row.year}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{row.solarGeneration.toLocaleString()}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{row.gridPrice}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{row.annualSavings.toLocaleString()}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{row.cumulativeSavings.toLocaleString()}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.text}>* Analysis continues for remaining 10 years with similar projections</Text>
        <Text style={styles.text}>
          * Assumes 0.7% annual solar panel degradation and 6% annual electricity price increase
        </Text>

        <Text style={styles.footer}>
          Generated by {companyInfo.name} | {companyInfo.phone} | Page 3
        </Text>
      </Page>

      {/* Environmental Impact */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Environmental Impact Analysis</Text>

        <Text style={styles.subHeader}>Carbon Footprint Reduction</Text>
        <Text style={styles.text}>
          Your {formData.projectCapacity}kW solar installation will generate approximately{" "}
          {annualGeneration.toLocaleString()} kWh of clean energy annually, reducing your carbon footprint
          significantly.
        </Text>

        <Text style={styles.subHeader}>Environmental Benefits</Text>
        <Text style={styles.boldText}>Trees Planted: {treesEquivalent} trees over 25 years</Text>
        <Text style={styles.boldText}>
          Cars Off Road: Equivalent to removing {Math.round(formData.projectCapacity * 2.5)} cars from the road annually
        </Text>
        <Text style={styles.boldText}>
          Homes Powered: Can power {Math.round(formData.projectCapacity * 1.2)} average homes
        </Text>

        <Text style={styles.subHeader}>Long-term Impact</Text>
        <Text style={styles.text}>Over the 25-year lifespan of your solar system, you will have contributed to:</Text>
        <Text style={styles.text}>• Reduced dependency on fossil fuels</Text>
        <Text style={styles.text}>• Lower greenhouse gas emissions</Text>
        <Text style={styles.text}>• Cleaner air quality in your community</Text>
        <Text style={styles.text}>• Sustainable energy future for next generations</Text>

        <Text style={styles.footer}>
          Generated by {companyInfo.name} | {companyInfo.phone} | Page 4
        </Text>
      </Page>
    </Document>
  )
}

interface PDFDownloadButtonProps {
  formData: FormData
  companyInfo: CompanyInfo
  currency: "INR" | "USD"
  className?: string
  children: React.ReactNode
}

export function PDFDownloadButton({ formData, companyInfo, currency, className, children }: PDFDownloadButtonProps) {
  console.log("[v0] PDFDownloadButton rendered with data:", {
    customerName: formData.customerName,
    companyName: companyInfo.name,
    currency,
  })

  return (
    <PDFDownloadLink
      document={<PDFReport formData={formData} companyInfo={companyInfo} currency={currency} />}
      fileName={`Solar_Report_${formData.customerName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`}
      className={className}
    >
      {({ blob, url, loading, error }) => {
        console.log("[v0] PDF Download state:", { loading, error: error?.message, hasBlob: !!blob, hasUrl: !!url })

        if (loading) return "Generating PDF..."
        if (error) {
          console.error("[v0] PDF Generation Error:", error)
          return "Error generating PDF - Please try again"
        }
        return children
      }}
    </PDFDownloadLink>
  )
}

export { PDFReport as SolarReportPDF }
