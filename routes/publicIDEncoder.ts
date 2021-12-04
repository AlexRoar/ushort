export function publicIdEncode(id: number, uuid: string): string {
    return id.toString(36) + uuid.substring(0, 5);
}

export function publicIdDecode(publicId: string): { id: number, uuid: string } {
    const len = publicId.length;
    const uuid = publicId.substring(len - 5);
    const id = publicId.substring(0, len - 5);
    return {
        id: parseInt(id, 36),
        uuid
    }
}

export const UUIDPrefixLen = 5;