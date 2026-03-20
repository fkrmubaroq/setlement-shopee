import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { useLayout } from "@/context/layout-provider"
import { sidebarData } from "./data/sidebar-data"
import { TeamSwitcher } from "./team-switcher"


export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  return (
    <Sidebar variant={variant} collapsible={collapsible}>
      <SidebarHeader >
        <TeamSwitcher teams={[sidebarData.sidebarLogo]} />
        {/* <SearchForm /> */}
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.sidebarMenu.map((menu) => (
          <SidebarGroup key={menu.section}>
            <SidebarGroupLabel>{menu.section}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menu.menus.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild variant="default">
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))
        }
      </SidebarContent>
      <SidebarFooter />
    </Sidebar >
  )
}