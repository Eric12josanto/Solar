"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface RazorpayPaymentProps {
  amount: number
  currency: "INR" | "USD"
  customerName: string
  customerEmail?: string
  onSuccess: (paymentId: string) => void
  onError: (error: string) => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export function RazorpayPayment({
  amount,
  currency,
  customerName,
  customerEmail = "test@example.com",
  onSuccess,
  onError,
}: RazorpayPaymentProps) {
  const [loading, setLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    setLoading(true)
    setPaymentStatus("processing")

    const res = await loadRazorpayScript()
    if (!res) {
      onError("Razorpay SDK failed to load")
      setPaymentStatus("error")
      setLoading(false)
      return
    }

    // Convert amount to paise for INR or cents for USD
    const razorpayAmount = currency === "INR" ? amount * 100 : amount * 100

    const options = {
      key: "rzp_test_9999999999", // Test key - replace with your actual test key
      amount: razorpayAmount,
      currency: currency,
      name: "Solar Report Generator",
      description: "Professional Solar Breakeven Analysis Report",
      image: "/solar-logo.jpg",
      handler: (response: any) => {
        console.log("[v0] Payment successful:", response)
        setPaymentStatus("success")
        onSuccess(response.razorpay_payment_id)
        setLoading(false)
      },
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: "9999999999",
      },
      notes: {
        address: "Solar Report Generator",
      },
      theme: {
        color: "#16a34a",
      },
      modal: {
        ondismiss: () => {
          console.log("[v0] Payment modal dismissed")
          setPaymentStatus("idle")
          setLoading(false)
        },
      },
    }

    const paymentObject = new window.Razorpay(options)

    paymentObject.on("payment.failed", (response: any) => {
      console.log("[v0] Payment failed:", response.error)
      setPaymentStatus("error")
      onError(response.error.description || "Payment failed")
      setLoading(false)
    })

    paymentObject.open()
  }

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "processing":
        return <Loader2 className="h-5 w-5 animate-spin" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  const getButtonText = () => {
    switch (paymentStatus) {
      case "processing":
        return "Processing..."
      case "success":
        return "Payment Successful"
      case "error":
        return "Retry Payment"
      default:
        return `Pay ${currency === "INR" ? "₹" : "$"}${amount}`
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-sm text-green-800">
            <CheckCircle className="h-4 w-4" />
            <span>Test Mode: Use test cards for payment testing</span>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handlePayment}
        disabled={loading || paymentStatus === "success"}
        className={`w-full h-16 text-lg ${
          paymentStatus === "success"
            ? "bg-green-600 hover:bg-green-600"
            : paymentStatus === "error"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {getStatusIcon()}
        <span className="ml-2">{getButtonText()}</span>
      </Button>

      {/* Test Card Information */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Test Payment Cards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-green-600">✅ Success Cards:</p>
              <p>4111 1111 1111 1111 (Visa)</p>
              <p>5555 5555 5555 4444 (Mastercard)</p>
              <p>4000 0000 0000 0002 (Visa)</p>
            </div>
            <div>
              <p className="font-medium text-red-600">❌ Failure Cards:</p>
              <p>4000 0000 0000 0002 (Generic failure)</p>
              <p>4000 0000 0000 9995 (Insufficient funds)</p>
              <p>4000 0000 0000 9987 (Lost card)</p>
            </div>
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-600">
              <strong>CVV:</strong> Any 3 digits | <strong>Expiry:</strong> Any future date | <strong>Name:</strong> Any
              name
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
