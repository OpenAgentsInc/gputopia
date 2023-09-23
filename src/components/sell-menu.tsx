import {
    Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarMenu,
    MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut,
    MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger
} from "@/components/ui/menubar"

export function SellMenu() {
  return (
    <Menubar>


      <MenubarMenu>
        <MenubarTrigger>Buy</MenubarTrigger>
        <MenubarContent>
          <MenubarItem disabled>
            AI Chat
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem disabled>
            Run a Job
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Sell</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Load model
          </MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Set model</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarRadioGroup value="vicuna">
                <MenubarRadioItem value="vicuna">Vicuna 7B</MenubarRadioItem>
                <MenubarRadioItem value="Luis">Llama2 7B</MenubarRadioItem>
                <MenubarRadioItem value="Luis">Llama2 13B</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem disabled>
            Connect workerbee...
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

    </Menubar>
  )
}
