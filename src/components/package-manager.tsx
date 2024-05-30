import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

export const Exec: React.FC<{ command: string }> = ({ command }) => {
  return (
    <Tabs groupId="package-manager">
      <TabItem value="npm" label="npm" default>
        <CodeBlock language="sh">{`npx ${command}`}</CodeBlock>
      </TabItem>
      <TabItem value="yarn" label="yarn">
        <CodeBlock language="sh">{`yarn dlx ${command}`}</CodeBlock>
      </TabItem>
      <TabItem value="pnpm" label="pnpm">
        <CodeBlock language="sh">{`pnpm dlx ${command}`}</CodeBlock>
      </TabItem>
    </Tabs>
  );
};

export const Install: React.FC<{ package: string } | { packages: string[] }> = (
  props
) => {
  const packages =
    "packages" in props ? props.packages.join(" ") : props.package;

  return (
    <Tabs groupId="package-manager">
      <TabItem value="npm" label="npm" default>
        <CodeBlock language="sh">{`npm install ${packages}`}</CodeBlock>
      </TabItem>
      <TabItem value="yarn" label="yarn">
        <CodeBlock language="sh">{`yarn add ${packages}`}</CodeBlock>
      </TabItem>
      <TabItem value="pnpm" label="pnpm">
        <CodeBlock language="sh">{`pnpm add ${packages}`}</CodeBlock>
      </TabItem>
    </Tabs>
  );
};

export const Run: React.FC<{ script: string }> = ({ script }) => {
  return (
    <Tabs groupId="package-manager">
      <TabItem value="npm" label="npm" default>
        <CodeBlock language="sh">{`npm run ${script}`}</CodeBlock>
      </TabItem>
      <TabItem value="yarn" label="yarn">
        <CodeBlock language="sh">{`yarn ${script}`}</CodeBlock>
      </TabItem>
      <TabItem value="pnpm" label="pnpm">
        <CodeBlock language="sh">{`pnpm run ${script}`}</CodeBlock>
      </TabItem>
    </Tabs>
  );
};
