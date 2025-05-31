import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { ThreadList } from './thread-list'

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        Your chats
      </SidebarHeader>
      <SidebarContent>
        <ThreadList />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
