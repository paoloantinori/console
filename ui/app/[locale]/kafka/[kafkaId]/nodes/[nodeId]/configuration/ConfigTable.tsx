"use client";
import { NodeConfig } from "@/api/nodes";
import { Number } from "@/components/Number";
import { TableView } from "@/components/table";
import { Label, LabelGroup, List, ListItem } from "@patternfly/react-core";
import { TableVariant } from "@patternfly/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { NoResultsEmptyState } from "./NoResultsEmptyState";

export function ConfigTable({ config }: { config: NodeConfig }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (params: { name: string; value: string }[]) => {
      const sp = new URLSearchParams(searchParams);
      params.forEach(({ name, value }) => sp.set(name, value));

      return sp.toString();
    },
    [searchParams],
  );

  const allData = Object.entries(config.attributes);

  // derive the available data sources from the config values
  const dataSources = Array.from(
    new Set(allData.map(([_, property]) => property.source)),
  );

  // read filters from the search params
  const propertyFilter = searchParams.get("filter");
  const rawSelectedDataSources = searchParams.get("data-source");
  const selectedDataSources =
    rawSelectedDataSources == ""
      ? []
      : rawSelectedDataSources?.split(",") || dataSources;

  // prepare the filtered data
  const filteredData = allData
    .filter((e) => (propertyFilter ? e[0].includes(propertyFilter) : true))
    .filter((e) =>
      selectedDataSources ? selectedDataSources.includes(e[1].source) : true,
    )
    .sort((a, b) => a[0].localeCompare(b[0]));

  function onReset() {
    router.push(
      pathname +
        "?" +
        createQueryString([
          { name: "filter", value: "" },
          {
            name: "data-source",
            value: dataSources.join(","),
          },
        ]),
    );
  }

  function onRemoveDataSource(value: string) {
    const chips = selectedDataSources.includes(value)
      ? selectedDataSources.filter((v) => v !== value)
      : [...selectedDataSources, value];
    router.push(
      pathname +
        "?" +
        createQueryString([
          { name: "filter", value: propertyFilter || "" },
          {
            name: "data-source",
            value: chips.length > 0 ? chips.join(",") : "",
          },
        ]),
    );
  }

  return (
    <TableView
      ariaLabel={"Node configuration"}
      toolbarBreakpoint={"md"}
      columns={["property", "value"] as const}
      data={filteredData}
      isFiltered={filteredData.length !== allData.length}
      onClearAllFilters={onReset}
      filters={{
        Property: {
          type: "search",
          onSearch: (value) => {
            router.push(
              pathname +
                "?" +
                createQueryString([
                  { name: "filter", value },
                  {
                    name: "data-source",
                    value: selectedDataSources.join(","),
                  },
                ]),
            );
          },
          errorMessage: "",
          validate: () => true,
          onRemoveGroup: () => {
            router.push(
              pathname +
                "?" +
                createQueryString([
                  {
                    name: "data-source",
                    value: selectedDataSources.join(","),
                  },
                ]),
            );
          },
          chips: propertyFilter ? [propertyFilter] : [],
          onRemoveChip: () => {
            router.push(
              pathname +
                "?" +
                createQueryString([
                  {
                    name: "data-source",
                    value: selectedDataSources.join(","),
                  },
                ]),
            );
          },
        },
        "Data source": {
          type: "checkbox",
          options: Object.fromEntries(dataSources.map((s) => [s, s])),
          onRemoveChip: onRemoveDataSource,
          chips: selectedDataSources,
          onRemoveGroup: () => {
            router.push(
              pathname +
                "?" +
                createQueryString([
                  { name: "filter", value: propertyFilter || "" },
                  {
                    name: "data-source",
                    value: "",
                  },
                ]),
            );
          },
          onToggle: onRemoveDataSource,
        },
      }}
      emptyStateNoData={<div></div>}
      emptyStateNoResults={<NoResultsEmptyState onReset={onReset} />}
      onPageChange={() => {}}
      renderHeader={({ column, Th }) => {
        switch (column) {
          case "property":
            return <Th>Property</Th>;
          case "value":
            return <Th>Value</Th>;
        }
        return <Th>{column}</Th>;
      }}
      renderCell={({ column, row: [key, property], Td }) => {
        function format(p: typeof property) {
          switch (p.type) {
            case "INT":
            case "LONG":
              return (
                <Number value={p.value ? parseInt(p.value, 10) : undefined} />
              );
            case "STRING":
              if (p.source !== "STATIC_BROKER_CONFIG") {
                return p.value || "-";
              }
            // pass through as this is a list in disguise
            case "LIST":
              return (
                <List isPlain={true} isBordered={true}>
                  {p.value
                    ?.split(",")
                    .map((v, idx) => <ListItem key={idx}>{v || "-"}</ListItem>)}
                </List>
              );
            default:
              if (p.sensitive) {
                return "******";
              }
              return p.value || "-";
          }
        }

        switch (column) {
          case "property":
            return (
              <Td>
                <div>{key}</div>
                <LabelGroup>
                  <Label isCompact={true} color={"cyan"}>
                    source={property.source}
                  </Label>
                  {property.readOnly && (
                    <Label isCompact={true} color={"grey"}>
                      Read only
                    </Label>
                  )}
                </LabelGroup>
              </Td>
            );
          case "value":
            return <Td>{format(property)}</Td>;
        }
      }}
      variant={TableVariant.compact}
    />
  );
}