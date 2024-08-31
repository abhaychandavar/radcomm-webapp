import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "./ui/dropdown-menu"

const Dropdown = ({triggerElement, items, menuLabel}: {triggerElement: JSX.Element, items: Array<{
    icon?: JSX.Element,
    title: string,
    key: string | number,
    shortcut?: string,
    variant?: 'default' | 'destructive'
}>, menuLabel: string}) => {
    return (<DropdownMenu>
        <DropdownMenuTrigger asChild>
            {triggerElement}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                {
                    items.map((item) => {
                        return (
                            <DropdownMenuItem key={item.key} className={`w-full flex items-center cursor-pointer ring-0 focus:ring-0 p-1 ${item.variant === 'destructive' ? 'text-destructive hover:!bg-destructive-background hover:!text-destructive' : 'text-muted-foreground'}`}>
                                {item.icon && <span className="mr-2 h-4 w-4">{item.icon}</span>}
                                <span>{item.title}</span>
                                {item.shortcut && <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>}
                            </DropdownMenuItem>
                        )
                    })
                }
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>);
}

export default Dropdown;