import { getKafkaCluster } from "@/api/kafka";
import { KafkaNodeParams } from "@/app/[locale]/kafka/[kafkaId]/nodes/kafkaNode.params";
import { AppHeader } from "@/components/AppHeader";
import { NavItemLink } from "@/components/NavItemLink";
import { Nav, NavList, PageNavigation } from "@/libs/patternfly/react-core";
import { notFound } from "next/navigation";

export async function NodeHeader({
  params: { kafkaId, nodeId },
}: {
  params: KafkaNodeParams;
}) {
  const cluster = await getKafkaCluster(kafkaId);
  if (!cluster) {
    notFound();
  }

  const node = cluster.attributes.nodes.find((n) => `${n.id}` === nodeId);
  if (!node) {
    notFound();
  }
  return (
    <AppHeader
      title={`Node ${node.id}`}
      navigation={
        <PageNavigation>
          <Nav aria-label="Group section navigation" variant="tertiary">
            <NavList>
              <NavItemLink
                url={`/kafka/${kafkaId}/nodes/${nodeId}/configuration`}
              >
                Configuration
              </NavItemLink>
            </NavList>
          </Nav>
        </PageNavigation>
      }
    />
  );
}