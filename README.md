
# Get Last Deployment Action

## Usage

```yaml
job:
  name: Get last active deployment
  runs-on: ubuntu-latest
  steps:
    - name: Get lastdeployment
      uses: allnnde/get_last_deployment@v0.1.3
      with:
        environment: testing
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Inputs

| Name           | Description                      | Required | Default                             |
| -------------- | -------------------------------- | -------- | ----------------------------------- |
| `environment`  | Deployment environment           | true     |                                     |
| `owner`        | GitHub owner                     | false    | Defaults to curret owner            |
| `repo`         | Repository name                  | false    | Defaults to current repository      |
| `state`        | find by status for the deployment. Must be one of the [accepted strings](https://developer.github.com/v3/repos/deployments/#create-a-deployment-status) | false | Defaults to current 'pending' |

## Outputs

| Name             | Description                                                                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `deployment_id`  | Deployment ID (numeric)                                                                                                                            |

## License

See [LICENSE](./LICENSE) for information on the license for this project. In
short, this project is licensed under the MIT license.
