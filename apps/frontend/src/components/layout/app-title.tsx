
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function AppTitle() {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='group-data-[state=collapsed]:bg-red-500'
          asChild
        >
          <div>
            <div className="text-2xl font-bold group-data-[state=expanded]:hidden">B</div>

            <a
              href='/'
              onClick={() => setOpenMobile(false)}
              className='grid flex-1 text-start text-sm leading-tight group-data-[state=collapsed]:hidden border'
            >
              <span className='truncate font-bold'>Blogify</span>
              <span className='truncate text-xs'>Admin Panel</span>
            </a>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
