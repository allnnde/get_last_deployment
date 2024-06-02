import * as core from "@actions/core";
import { context } from "@actions/github";
import { Inputs, Outputs } from "./constants";

type DeploymentState =
  | 'error'
  | 'failure'
  | 'inactive'
  | 'in_progress'
  | 'queued'
  | 'pending'
  | 'success'

export interface DeploymentInputs {
  state: DeploymentState;
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
    environment:"",
    state: 'pending'
  };

  result.owner = core.getInput(Inputs.Owner, { required: false }) || context.repo.owner;

  result.repo = core.getInput(Inputs.Repo, { required: false }) || context.repo.repo;

  result.state = core.getInput(Inputs.State, { required: false }) as  DeploymentState || 'pending';

  result.environment = core.getInput(Inputs.Environment, { required: true });

  return result;
}

export function setOutputs(response: any) {
  // Get the outputs for the created deployment from the response
    core.info(`set deployment id ${response.id}`);
    core.setOutput(Outputs.DeploymentId, response.id);

}
