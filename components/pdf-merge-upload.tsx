"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Merge, X, Check } from "lucide-react"

interface PDFMergeUploadProps {
  onMergeComplete: (mergedPreview: string) => void
}

export function PDFMergeUpload({ onMergeComplete }: PDFMergeUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isMerging, setIsMerging] = useState(false)
  const [mergeComplete, setMergeComplete] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setIsUploading(true)
      // Simulate upload process
      setTimeout(() => {
        setUploadedFile(file)
        setIsUploading(false)
      }, 1500)
    } else {
      alert("Please upload a PDF file only")
    }
  }

  const handleMerge = () => {
    if (!uploadedFile) return

    setIsMerging(true)
    setTimeout(() => {
      setIsMerging(false)
      setMergeComplete(true)
      // Create a preview URL for the merged document with correct order
      const mergedPreview = `Merged Document: Original Quotation (${uploadedFile.name}) + Solar Breakeven Report`
      onMergeComplete(mergedPreview)
    }, 2000)
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    setMergeComplete(false)
  }

  return (
    <Card className="shadow-lg border-2 border-dashed border-orange-300 bg-orange-50">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-times text-orange-800">Add Your Original Bill Quotation</CardTitle>
        <p className="text-orange-700 font-times">
          Upload your original quotation to merge with the solar report for installer presentation
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!uploadedFile ? (
          <div className="text-center">
            <label className="cursor-pointer">
              <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
              <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 hover:border-orange-400 transition-colors">
                <Upload className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-orange-800 font-times">
                  {isUploading ? "Uploading..." : "Click to upload PDF"}
                </p>
                <p className="text-sm text-orange-600 font-times">Drag and drop your original quotation PDF here</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-red-500" />
                <div>
                  <p className="font-medium font-times">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500 font-times">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRemoveFile} className="text-red-500 hover:text-red-700">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {!mergeComplete ? (
              <Button
                onClick={handleMerge}
                disabled={isMerging}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-times"
              >
                {isMerging ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Merging Documents...
                  </>
                ) : (
                  <>
                    <Merge className="h-4 w-4 mr-2" />
                    Merge with Solar Report
                  </>
                )}
              </Button>
            ) : (
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-800 font-times">Documents merged successfully!</p>
                <p className="text-sm text-green-600 font-times">
                  Your original quotation + solar report is ready for download
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
