'use client'

import React, { ErrorInfo, ReactNode } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { AlertCircle } from "lucide-react"

interface ErrorBoundaryProps {
  fallback?: ReactNode
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try again later.
          </AlertDescription>
        </Alert>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary