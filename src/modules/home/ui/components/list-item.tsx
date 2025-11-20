import Image from "next/image"
import { FaPlay } from "react-icons/fa6"
import { useRouter } from "next/navigation"

interface Props {
  href: string
  name: string
  image: string
}

export const ListItem = ({ href, name, image }: Props) => {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push(href)}
      className="relative group flex items-center rounded-md overflow-hidden gap-x-4 bg-primary/10 hover:bg-primary/20 transition pr-4"
    >
      <div className="size-[64px] relative">
        <Image fill sizes="100%" src={image} alt="Icon" className="object-cover" />
      </div>
      <p className="font-medium truncate">
        {name}
      </p>
      <div className="absolute right-5 transition opacity-0 rounded-full flex items-center justify-center bg-primary p-4 drop-shadow-md group-hover:opacity-100 hover:scale-110">
        <FaPlay className="text-white" />
      </div>
    </button>
  )
}
