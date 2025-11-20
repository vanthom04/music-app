import { Readable } from "stream"
import { MutableFile, Storage } from "megajs"

let storagePromise: Promise<InstanceType<typeof Storage>> | null = null

export const getMegaStorage = async () => {
  if (!storagePromise) {
    const email = process.env.MEGA_EMAIL
    const password = process.env.MEGA_PASSWORD

    if (!email || !password) {
      throw new Error("MEGA_EMAIL and MEGA_PASSWORD must be set in environment variables")
    }

    storagePromise = new Storage({ email, password }).ready
  }

  return storagePromise
}

export const ensureTargetFolder = async (folderName: string): Promise<MutableFile> => {
  const storage = await getMegaStorage()

  const rootFolder =
    storage.root.children?.find(
      (child) => child.name === process.env.MEGA_ROOT_FOLDER && child.directory
    ) || storage.root

  const existingFolder = rootFolder?.children?.find(
    (child) => child.name === folderName && child.directory
  )

  if (existingFolder) {
    return existingFolder
  }

  return await rootFolder.mkdir(folderName)
}

export const uploadStreamToMega = async (options: {
  folder: string
  name: string
  size?: number
  stream: Readable
}) => {
  const folder = await ensureTargetFolder(options.folder)

  const audioUploader = folder.upload(
    { name: options.name, size: options.size },
    options.stream as any
  )

  return await audioUploader.complete
}

export async function deleteMegaNodesSafely(nodeIds: string[]) {
  if (!nodeIds.length) return
  const storage = await getMegaStorage()

  for (const nodeId of nodeIds) {
    try {
      const node = storage.files[nodeId]
      if (node) {
        await new Promise<void>((resolve, reject) => {
          ;(node as any).delete((err: any) => (err ? reject(err) : resolve()))
        })
      }
    } catch (error) {
      console.error("[MEGA_DELETE_ERROR]: ", error)
    }
  }
}
