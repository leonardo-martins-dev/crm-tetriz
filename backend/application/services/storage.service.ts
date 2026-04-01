export interface StorageService {
  uploadFile(params: {
    bucket: string
    path: string
    file: Buffer | Blob | ArrayBuffer
    contentType?: string
  }): Promise<{ publicUrl: string }>

  deleteFile(params: {
    bucket: string
    path: string
  }): Promise<void>
}
