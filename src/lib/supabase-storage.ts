// Supabase storage - File storage utilities
// Upload files to Supabase Storage
import { supabaseAdmin } from './supabase';

export async function uploadFile(
    bucket: string,
    path: string,
    file: File
): Promise<string> {
    const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(path, file);

    if (error) throw error;

    const { data: urlData } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

export async function deleteFile(bucket: string, path: string) {
    const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);
    if (error) throw error;
}
