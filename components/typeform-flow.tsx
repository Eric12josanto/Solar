"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Home, Building, X, Check } from "lucide-react"
import { ReportPreview } from "@/components/report-preview"

interface CompanyInfo {
  name: string
  phone: string
  logo: string | null
}

interface FormData {
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

interface TypeformFlowProps {
  companyInfo: CompanyInfo
  currency: "INR" | "USD"
}

const questions = [
  { id: "customerName", title: "What's your customer's name (as per agreement)?", progress: 8 },
  { id: "customerAddress", title: "Customer's complete address (as per agreement)?", progress: 15 },
  { id: "projectType", title: "What type of solar project is this?", progress: 23 },
  { id: "hasSubsidy", title: "Will this project receive any government subsidy?", progress: 31 },
  { id: "subsidyAmount", title: "Enter the subsidy amount", progress: 38 },
  { id: "projectCapacity", title: "What's the total project capacity?", progress: 46 },
  { id: "projectInvestment", title: "Total project investment amount", progress: 54 },
  { id: "monthlyUsage", title: "Customer's current monthly electricity usage", progress: 62 },
  { id: "currentTariff", title: "Current electricity tariff rate", progress: 69 },
  { id: "needsLoan", title: "Does the customer need financing/loan?", progress: 77 },
  { id: "downPayment", title: "Down payment percentage of total project cost", progress: 85 },
  { id: "interestRate", title: "Expected interest rate per year", progress: 92 },
  { id: "loanTenure", title: "Loan repayment period", progress: 100 },
]

export function TypeformFlow({ companyInfo, currency }: TypeformFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showReport, setShowReport] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    customerAddress: "",
    projectType: "",
    hasSubsidy: false,
    subsidyAmount: 0,
    projectCapacity: 0,
    projectInvestment: 0,
    monthlyUsage: 0,
    currentTariff: 0,
    needsLoan: false,
    downPayment: 0,
    interestRate: 0,
    loanTenure: 0,
  })

  const currencySymbol = currency === "INR" ? "₹" : "$"
  const currentQuestion = questions[currentStep]

  const handleNext = () => {
    // Skip subsidy amount if no subsidy
    if (currentStep === 3 && !formData.hasSubsidy) {
      setCurrentStep(5)
    }
    // Skip loan details if no loan needed
    else if (currentStep === 9 && !formData.needsLoan) {
      setShowReport(true)
    }
    // Normal progression
    else if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowReport(true)
    }
  }

  const handleBack = () => {
    if (currentStep === 5 && !formData.hasSubsidy) {
      setCurrentStep(3)
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (showReport) {
    return <ReportPreview formData={formData} companyInfo={companyInfo} currency={currency} />
  }

  const renderQuestion = () => {
    const questionId = currentQuestion.id as keyof FormData

    switch (questionId) {
      case "customerName":
        return (
          <Input
            type="text"
            placeholder="Enter customer name"
            value={formData.customerName}
            onChange={(e) => updateFormData("customerName", e.target.value)}
            className="h-16 text-xl text-center border-2 border-blue-200 focus:border-blue-400"
            autoFocus
          />
        )

      case "customerAddress":
        return (
          <Textarea
            placeholder="Enter complete address"
            value={formData.customerAddress}
            onChange={(e) => updateFormData("customerAddress", e.target.value)}
            className="min-h-32 text-lg text-center border-2 border-blue-200 focus:border-blue-400 resize-none"
            autoFocus
          />
        )

      case "projectType":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                formData.projectType === "residential" ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => updateFormData("projectType", "residential")}
            >
              <CardContent className="p-8 text-center">
                <Home className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                <h3 className="text-2xl font-semibold">Residential</h3>
              </CardContent>
            </Card>
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                formData.projectType === "commercial" ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => updateFormData("projectType", "commercial")}
            >
              <CardContent className="p-8 text-center">
                <Building className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                <h3 className="text-2xl font-semibold">Commercial</h3>
              </CardContent>
            </Card>
          </div>
        )

      case "hasSubsidy":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                !formData.hasSubsidy ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => updateFormData("hasSubsidy", false)}
            >
              <CardContent className="p-8 text-center">
                <X className="h-16 w-16 mx-auto mb-4 text-red-500" />
                <h3 className="text-2xl font-semibold">No Subsidy</h3>
              </CardContent>
            </Card>
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                formData.hasSubsidy ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => updateFormData("hasSubsidy", true)}
            >
              <CardContent className="p-8 text-center">
                <Check className="h-16 w-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-2xl font-semibold">Yes, Enter Subsidy Amount</h3>
              </CardContent>
            </Card>
          </div>
        )

      case "subsidyAmount":
        return (
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-500">
              {currencySymbol}
            </span>
            <Input
              type="number"
              placeholder="0"
              value={formData.subsidyAmount || ""}
              onChange={(e) => updateFormData("subsidyAmount", Number.parseFloat(e.target.value) || 0)}
              className="h-16 text-xl text-center pl-12 border-2 border-blue-200 focus:border-blue-400"
              autoFocus
            />
          </div>
        )

      case "projectCapacity":
        return (
          <div className="relative">
            <Input
              type="number"
              placeholder="0"
              value={formData.projectCapacity || ""}
              onChange={(e) => updateFormData("projectCapacity", Number.parseFloat(e.target.value) || 0)}
              className="h-16 text-xl text-center pr-16 border-2 border-blue-200 focus:border-blue-400"
              autoFocus
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-500">kW</span>
          </div>
        )

      case "projectInvestment":
        return (
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-500">
              {currencySymbol}
            </span>
            <Input
              type="number"
              placeholder="0"
              value={formData.projectInvestment || ""}
              onChange={(e) => updateFormData("projectInvestment", Number.parseFloat(e.target.value) || 0)}
              className="h-16 text-xl text-center pl-12 border-2 border-blue-200 focus:border-blue-400"
              autoFocus
            />
          </div>
        )

      case "monthlyUsage":
        return (
          <div className="relative">
            <Input
              type="number"
              placeholder="0"
              value={formData.monthlyUsage || ""}
              onChange={(e) => updateFormData("monthlyUsage", Number.parseFloat(e.target.value) || 0)}
              className="h-16 text-xl text-center pr-32 border-2 border-blue-200 focus:border-blue-400"
              autoFocus
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-500">
              Units/Month
            </span>
          </div>
        )

      case "currentTariff":
        return (
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-500">
              {currencySymbol}
            </span>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.currentTariff || ""}
              onChange={(e) => updateFormData("currentTariff", Number.parseFloat(e.target.value) || 0)}
              className="h-16 text-xl text-center pl-12 pr-20 border-2 border-blue-200 focus:border-blue-400"
              autoFocus
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-500">/Unit</span>
          </div>
        )

      case "needsLoan":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                !formData.needsLoan ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => updateFormData("needsLoan", false)}
            >
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-2xl font-semibold">No Loan Required</h3>
              </CardContent>
            </Card>
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                formData.needsLoan ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => updateFormData("needsLoan", true)}
            >
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🏦</div>
                <h3 className="text-2xl font-semibold">Yes, Need Loan Details</h3>
              </CardContent>
            </Card>
          </div>
        )

      case "downPayment":
        return (
          <div className="relative">
            <Input
              type="number"
              placeholder="0"
              value={formData.downPayment || ""}
              onChange={(e) => updateFormData("downPayment", Number.parseFloat(e.target.value) || 0)}
              className="h-16 text-xl text-center pr-12 border-2 border-blue-200 focus:border-blue-400"
              autoFocus
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-500">%</span>
          </div>
        )

      case "interestRate":
        return (
          <div className="relative">
            <Input
              type="number"
              step="0.1"
              placeholder="0.0"
              value={formData.interestRate || ""}
              onChange={(e) => updateFormData("interestRate", Number.parseFloat(e.target.value) || 0)}
              className="h-16 text-xl text-center pr-24 border-2 border-blue-200 focus:border-blue-400"
              autoFocus
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-500">
              % per year
            </span>
          </div>
        )

      case "loanTenure":
        return (
          <div className="relative">
            <Input
              type="number"
              placeholder="0"
              value={formData.loanTenure || ""}
              onChange={(e) => updateFormData("loanTenure", Number.parseFloat(e.target.value) || 0)}
              className="h-16 text-xl text-center pr-20 border-2 border-blue-200 focus:border-blue-400"
              autoFocus
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-500">Years</span>
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentQuestion.id) {
      case "customerName":
        return formData.customerName.length >= 2
      case "customerAddress":
        return formData.customerAddress.length >= 10
      case "projectType":
        return formData.projectType !== ""
      case "hasSubsidy":
        return true // Always can proceed from this question
      case "subsidyAmount":
        return formData.subsidyAmount > 0
      case "projectCapacity":
        return formData.projectCapacity > 0 && formData.projectCapacity <= 1000
      case "projectInvestment":
        return formData.projectInvestment > 0
      case "monthlyUsage":
        return formData.monthlyUsage > 0
      case "currentTariff":
        return formData.currentTariff > 0
      case "needsLoan":
        return true // Always can proceed from this question
      case "downPayment":
        return formData.downPayment >= 0 && formData.downPayment <= 100
      case "interestRate":
        return formData.interestRate >= 0 && formData.interestRate <= 30
      case "loanTenure":
        return formData.loanTenure >= 1 && formData.loanTenure <= 25
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <Progress value={currentQuestion.progress} className="h-2 rounded-none" />
      </div>

      <div className="pt-8 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Question */}
          <div className="typeform-slide">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-balance">
                {currentQuestion.title}
              </h1>

              <div className="max-w-lg mx-auto">{renderQuestion()}</div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-16">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              <div className="text-sm text-gray-500">
                {currentStep + 1} of {questions.length}
              </div>

              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                {currentStep === questions.length - 1 || (currentStep === 9 && !formData.needsLoan)
                  ? "Generate Report"
                  : "Next"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
