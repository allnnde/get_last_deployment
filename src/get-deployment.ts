import * as core from "@actions/core";
import { getOctokit } from "@actions/github";
import { getInputs, DeploymentInputs, setOutputs } from "./io-helper";

export function isSuccessStatusCode(statusCode?: number): boolean {
  if (!statusCode) return false;
  return statusCode >= 200 && statusCode < 300;
}

export function findLatestDeployment(deployments: any[]): any {
  core.info(JSON.stringify(deployments))
  const result = deployments[0];
  return result;
}

(async function run() {
  try {
    const inputs: DeploymentInputs = getInputs();
    const github = getOctokit(process.env.GITHUB_TOKEN as string);

    core.info(
      `Start get deployment with:\n  owner: ${inputs.owner}\n  repo: ${inputs.repo}`,
    );

    const deployments = await github.rest.repos.listDeployments({
      owner: inputs.owner,
      repo: inputs.repo,
      environment: inputs.environment,
    });

    if (isSuccessStatusCode(deployments.status)) {
      const deploymentsActives = deployments.data;

      const latestDeployment = findLatestDeployment(deploymentsActives);
      if (latestDeployment) {
        setOutputs(latestDeployment);
      }else{
        core.warning("Not found deployments");
      }
    } else
      throw new Error(
        `Unexpected http ${deployments.status} during get deployments list`,
      );

    core.info("Get deployment has finished successfully");
  } catch (err: any) {
    core.setFailed(err.message);
  }
})();
