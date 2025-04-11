import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";

export function MainLayout() {
  return (
    <NavigationMenu onValueChange={console.log}>
      <NavigationMenuList>
          <NavigationMenuItem value="acceuil">
            <NavigationMenuLink to="/dashboard">
              dada
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem value="pasacceuil">
            <NavigationMenuLink to="/pasdashboard">
              test
            </NavigationMenuLink>
          </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
