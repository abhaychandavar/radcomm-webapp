import * as React from "react"

import {
  Select as ShadcnSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormControl, FormItem, FormMessage } from "./ui/form";

function Select({ title, items, placeholder, onSelect, defaultValue, spread, isFormItem }: {
  placeholder?: string,
  title: string,
  items: { id: string, title: string, icon?: string | JSX.Element }[],
  onSelect?: (value: string) => void,
  defaultValue?: string,
  spread?: boolean,
  isFormItem?: boolean,
}) {
  if (isFormItem) {
      <ShadcnSelect value={defaultValue} onValueChange={onSelect}>
        <FormControl>
          <SelectTrigger className={spread ? 'w-full' : "w-[180px]"} >
            <SelectValue placeholder={placeholder || 'select'} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{title}</SelectLabel>
            {
              items.map((item: { id: string, icon?: string | JSX.Element, title: string }) => (
                <SelectItem value={item.id} className="flex flex-row items-center justify-start gap-2">{item.icon ? <span className="w-fit">{item.icon}</span> : <></>} <span className="w-fit">{item.title}</span></SelectItem>
              ))
            }
          </SelectGroup>
        </SelectContent>
      </ShadcnSelect>
  }
  return (
    <ShadcnSelect value={defaultValue} onValueChange={onSelect}>

      <SelectTrigger className={spread ? 'w-full' : "w-[180px]"} >
        <SelectValue placeholder={placeholder || 'select'} />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>{title}</SelectLabel>
          {
            items.map((item: { id: string, icon?: string | JSX.Element, title: string }) => (
              <SelectItem value={item.id} className="flex flex-row items-center justify-start gap-2">{item.icon ? <span className="w-fit">{item.icon}</span> : <></>} <span className="w-fit">{item.title}</span></SelectItem>
            ))
          }
        </SelectGroup>
      </SelectContent>
    </ShadcnSelect>
  )
}

export default Select;