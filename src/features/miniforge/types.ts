export interface SchemaEntry {
  id: string
  name: string
  version: string
  isLatest: boolean
  code: string
  createdAt: string
}

export interface HtmlEntry {
  id: string
  filename: string
  html: string
  createdAt: string
}
