/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app: () => ({
    name: "actionbar",
    home: "aws",
    removal: "remove",
    providers: { aws: { region: "eu-central-1" } },
  }),
  run: async () => {
    new sst.aws.Astro("Client", {
      path: "packages/client",
      domain: process.env.EXAMPLE_DOMAIN,
    });
  },
});
