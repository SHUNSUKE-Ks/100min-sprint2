export interface ValidationResult<T = unknown> {
  ok: boolean
  error?: string
  data?: T
}

export interface JsonSchemaConfig {
  schemaLabel: string
  schemaExample: unknown
  importPlaceholder?: string
  importButtonLabel?: string
  exportButtonLabel?: string
}

export interface JsonImportExportProps {
  config: JsonSchemaConfig
  validator: (raw: string) => ValidationResult
  onImport?: (data: unknown) => void | Promise<void>
  onExport?: () => string | Promise<string>
  isLoading?: boolean
}

export interface JsonSchemaDisplayProps {
  label: string
  example: unknown
  showCodeBlock?: boolean
}
