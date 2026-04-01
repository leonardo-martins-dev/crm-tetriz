import { SupabaseClient } from '@supabase/supabase-js'
import { StorageService } from '../../application/services/storage.service'

export class SupabaseStorageServiceImpl implements StorageService {
  constructor(private supabase: SupabaseClient) {}

  async uploadFile(params: {
    bucket: string
    path: string
    file: Buffer | Blob | ArrayBuffer
    contentType?: string
  }): Promise<{ publicUrl: string }> {
    const { data, error } = await this.supabase
      .storage
      .from(params.bucket)
      .upload(params.path, params.file, {
        contentType: params.contentType,
        upsert: true
      })

    if (error) {
      throw new Error(`Erro ao fazer upload para o Supabase Storage: ${error.message}`)
    }

    const { data: { publicUrl } } = this.supabase
      .storage
      .from(params.bucket)
      .getPublicUrl(params.path)

    return { publicUrl }
  }

  async deleteFile(params: {
    bucket: string
    path: string
  }): Promise<void> {
    const { error } = await this.supabase
      .storage
      .from(params.bucket)
      .remove([params.path])

    if (error) {
      throw new Error(`Erro ao deletar arquivo do Supabase Storage: ${error.message}`)
    }
  }
}
