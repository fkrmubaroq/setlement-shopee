
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar'
import * as React from 'react'

type TeamSwitcherProps = {
    teams: {
        name: string
        logo: React.ElementType
        plan: string
    }[]
}

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
    const team = teams[0]
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size='lg'
                    className='group-data-[state=collapsed]:p-0! group-data-[state=collapsed]:ml-1'
                >
                    <div className='bg-sidebar-primary dark:text-background text-sidebar-primary-foreground flex shrink-0 aspect-square group-data-[state=expanded]:size-8 group-data-[state=collapsed]:size-7 items-center justify-center rounded-md'>
                        B
                    </div>
                    <div className='grid flex-1 text-start text-sm leading-tight'>
                        <span className='truncate font-semibold'>
                            {team.name}
                        </span>
                        <span className='truncate text-xs'>{team.plan}</span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
