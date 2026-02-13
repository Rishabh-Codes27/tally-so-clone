import {
  AlignLeft,
  AlignJustify,
  CircleCheck,
  SquareCheck,
  ChevronDown,
  CheckCheck,
  Hash,
  AtSign,
  Phone,
  Link2,
  Upload,
  Calendar,
  Clock,
  MoreHorizontal,
  Grid3X3,
  Star,
  CreditCard,
  PenTool,
  ListOrdered,
  Wallet,
  FileText,
  Minus,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Image,
  Scissors,
} from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "short-answer": AlignLeft,
  "long-answer": AlignJustify,
  "multiple-choice": CircleCheck,
  checkboxes: SquareCheck,
  dropdown: ChevronDown,
  "multi-select": CheckCheck,
  number: Hash,
  email: AtSign,
  phone: Phone,
  url: Link2,
  "file-upload": Upload,
  date: Calendar,
  time: Clock,
  "linear-scale": MoreHorizontal,
  matrix: Grid3X3,
  rating: Star,
  payment: CreditCard,
  signature: PenTool,
  ranking: ListOrdered,
  "wallet-connect": Wallet,
  "new-page": FileText,
  divider: Minus,
  heading1: Heading1,
  heading2: Heading2,
  heading3: Heading3,
  paragraph: Type,
  image: Image,
  "page-break": Scissors,
}

export function BlockIcon({
  icon,
  className = "h-4 w-4",
}: {
  icon: string
  className?: string
}) {
  const IconComponent = iconMap[icon]
  if (!IconComponent) return null
  return <IconComponent className={className} />
}
