import * as core from "@actions/core";
import { getOctokit } from "@actions/github";
import { getInputs, DeploymentInputs, setOutputs } from "./io-helper";

export function isSuccessStatusCode(statusCode?: number): boolean {
  if (!statusCode) return false;
  return statusCode >= 200 && statusCode < 300;
}

(async function run() {
  try {
    const inputs: DeploymentInputs = getInputs();
    const github = getOctokit(process.env.GITHUB_TOKEN as string);

    core.info(`Start get deployment for ${inputs.owner}/${inputs.repo}}`);

    const deployments = await github.rest.repos.listDeployments({
      owner: inputs.owner,
      repo: inputs.repo,
      environment: inputs.environment,
    });

    if (isSuccessStatusCode(deployments.status)) {
      const allDeployments = deployments.data;
      core.info(`Finded a ${allDeployments.length} deployment for: ${inputs.owner}/${inputs.repo}`);
      let latestDeployment = null;
      const deploymentSorted = allDeployments.toSorted((a, b) => {
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      });

      for (const deployment of deploymentSorted) {
        const deploymentStatuses =
          await github.rest.repos.listDeploymentStatuses({
            deployment_id: deployment.id,
            owner: inputs.owner,
            repo: inputs.repo,
          });

        const statusSorted = deploymentStatuses.data.toSorted((a, b) => {
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        });
        if (statusSorted && statusSorted.length > 0) {
          const lastStatus = statusSorted[0];
          if (lastStatus.state == inputs.state) {
            latestDeployment = deployment;
            break;
          }
        }
      }

      if (latestDeployment) {
        setOutputs(latestDeployment);
      } else {
        core.warning("Not found deployments");
      }
    } else
      throw new Error(`Unexpected http ${deployments.status} during get deployments list`);

    core.info("Get deployment has finished successfully");
  } catch (err: any) {
    core.setFailed(err.message);
  }
})();
