import * as core from "@actions/core";
import { context } from "@actions/github";
import { Inputs, Outputs } from "./constants";

export interface DeploymentInputs {
  environment: string;
  owner: string;
  repo: string;
}
/**
 * Helper to get all the inputs for the action
 */
export function getInputs(): DeploymentInputs {
  const result: DeploymentInputs = {
    owner: "",
    repo: "",
    environment:""
  };

  result.owner = core.getInput(Inputs.Owner, { required: false });
  if (!result.owner) result.owner = context.repo.owner;

  result.repo = core.getInput(Inputs.Repo, { required: false });
  if (!result.repo) result.repo = context.repo.repo;

  result.environment = core.getInput(Inputs.Environment, { required: true });

  return result;
}

export function setOutputs(response: any) {
  // Get the outputs for the created deployment from the response
    core.info(`set deployment id ${response.id}`);
    core.setOutput(Outputs.DeploymentId, response.id);

}
