import { getTools } from "@/api/tools";
import { AppMasthead } from "@/components/appMasthead";
import { ToolNavItem } from "@/components/toolNavItem";
import {
  Nav,
  NavList,
  Page,
  PageSidebar,
  PageSidebarBody,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@/libs/patternfly/react-core";
import { getUser } from "@/utils/session";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  authProfile: ReactNode;
  breadcrumbs: ReactNode;
};

export default async function ToolsLayout({
  children,
  authProfile,
  breadcrumbs,
}: Props) {
  const user = await getUser();

  const tools = await getTools(user.username === "admin"); // for demo purposes

  return (
    <Page
      header={
        <AppMasthead
          username={user.username}
          content={
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem>{authProfile}</ToolbarItem>
              </ToolbarContent>
            </Toolbar>
          }
        />
      }
      sidebar={
        <PageSidebar>
          <PageSidebarBody>
            <Nav aria-label="Nav">
              <NavList>
                {tools.map((t, idx) => (
                  <ToolNavItem key={idx} {...t} />
                ))}
              </NavList>
            </Nav>
          </PageSidebarBody>
        </PageSidebar>
      }
      breadcrumb={breadcrumbs}
    >
      {children}
    </Page>
  );
}
