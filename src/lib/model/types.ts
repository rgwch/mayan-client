/**
 * Some Mayan EDMS API types needed here.
 */
export type Cabinet = {
    children?: Array<Cabinet>
    documents_url?: string
    full_path: string
    id: number
    label: string
    parent_id: number | null
    parent_url?: string
    url?: string
}

export type Favorite = {
    id: number
    document: Document
    user: User,
    datetime_added: string,
    url: string


}
export type Document = {
    datetime_created: string
    description: string
    document_change_type_url: string
    document_type: DocumentType
    file_latest: DocumentFile
    file_list_url: string
    id: number
    label: string
    language: string
    url: string
    uuid: string
    version_active: DocumentVersion
    version_list_url: string
}

export type DocumentVersion = {
    active: boolean
    comment: string
    document_id: string
    document_url: string
    export_url: string
    id: number
    page_list_url: string
    pages_first: DocumentVersionPage
    timestamp: string
    url: string
}

export type DocumentVersionPage = {
    content_type: string
    content_type_id: number
    document_version_id: string
    document_version_url: string
    id: number
    image_url: string
    object_id: number
    page_number: number
    url: string
}
export type DocumentFilePage = {
    document_file_id: number
    document_file_url: string
    id: number
    image_url: string
    page_number: number
    url: string
}

export type DocumentType = {
    id: number
    label: string
    url: string
    quick_label_list_url: string
    delete_time_period: number
    delete_time_unit: string

}

export type DocumentFile = {
    checksum: string
    comment: string
    document_id: number
    document_url: string
    download_url: string
    encoding: string
    filename: string
    file: string
    id: number
    mimetype: string
    page_list_url: string
    pages_first: DocumentFilePage
    size: number
    timestamp: string
    url: string
}

export type Tag = {
    id: number
    label: string
    color: string
    documents_url: string
    url: string
}

export type PageList = {
    count: number
    next: string
    previous: string
    results: Array<DocumentVersionPage>
}

export type User = {
    username: string
    first_name: string
    last_name: string
    date_joined: string
    email: string
    groups_url: string
    id: number
    is_active: boolean
    last_login: string
    url: string

}