/// <reference path="./.sst/platform/config.d.ts" />


export default $config({
  app: () => ({
    name: "template",
    home: "aws",
    removal: "remove",
    providers: { aws: { region: "eu-central-1" } },
  }),
  run: async () => {
    const isMain = $app.stage === "main";
    const environment = {
      ADMIN_AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
      ADMIN_AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
    };

    new sst.aws.Astro("Client", {
      path: "packages/client",
      environment,
      // domain: $dev
      //   ? undefined
      //   : {
      //       domainName: isMain ? DOMAIN : `${$app.stage}.${DOMAIN}`,
      //       hostedZone: DOMAIN,
      //       aliases: isMain ? [`www.${DOMAIN}`] : [],
      //     },
    });

   
  },
});
