import { toast } from "sonner"
import { useRef, useState } from "react"
import { LoaderIcon } from "lucide-react"

import { fetcher } from "@/lib/fetcher"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { useUploadThing } from "@/lib/uploadthing"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Props {
  name: string
  image?: string | null
}

export const ChangeAvatar = ({ name, image }: Props) => {
  const [imageUrl, setImageUrl] = useState(image ?? "")
  const [file, setFile] = useState<File | undefined>(undefined)
  const [isPending, setIsPending] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const { startUpload } = useUploadThing("imageUploader")

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      if (imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl)
      }

      setFile(file)
      setImageUrl(URL.createObjectURL(file))
    }

    // Clear value
    event.target.value = ""
  }

  const onUpload = async () => {
    if (!file) {
      inputRef.current?.click()
    } else {
      if (!file) return
      setIsPending(true)
      const result = await startUpload([file])

      if (result) {
        // Delete avatar
        if (image?.includes("9b2fomoly8.ufs.sh")) {
          await fetcher(`/api/uploadthing?fileId=${image.split("/").pop() ?? ""}`, {
            method: "DELETE"
          })
        }

        // Update avatar
        await authClient.updateUser({ image: result[0].ufsUrl }, {
          onSuccess: () => {
            setFile(undefined)
            if (imageUrl.startsWith("blob:")) {
              URL.revokeObjectURL(imageUrl)
            }

            toast.success("Changed avatar successfully")
          },
          onError: ({ error }) => {
            toast.error(error.message)
          }
        })
      }

      setIsPending(false)
    }
  }

  const onRemoveImage = () => {
    if (imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrl)
      setImageUrl(image ?? "")
    }

    setFile(undefined)
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Avatar className="size-[240px] lg:size-[300px]">
        <AvatarImage src={imageUrl!} />
        <AvatarFallback className="bg-primary text-white text-9xl">
          {name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <Button
        size="sm"
        onClick={onUpload}
        className="w-full"
        disabled={isPending}
        variant={file ? "default" : "outline"}
      >
        {isPending && <LoaderIcon className="animate-spin text-white" />}
        {!isPending && (file ? "Save changes" : "Select image")}
      </Button>
      {file && (
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          disabled={isPending}
          onClick={onRemoveImage}
        >
          Remove image
        </Button>
      )}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        disabled={isPending}
        onChange={handleInputChange}
        ref={inputRef}
      />
    </div>
  )
}
