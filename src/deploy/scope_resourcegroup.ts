import * as core from '@actions/core';
import { exec } from '@actions/exec';
import { ExecOptions } from '@actions/exec/lib/interfaces';
import { ParseOutputs, Outputs } from '../utils/utils';
import fs from 'fs';

export async function DeployResourceGroupScope(azPath: string, resourceGroupName: string, template: string, deploymentMode: string, deploymentName: string, parameters: string): Promise<Outputs> {
    // Check if resourceGroupName is set
    if (!resourceGroupName) {
        throw Error("ResourceGroup name must be set.")
    }

    // Check if the resourceGroup exists
    var result = await exec(`"${azPath}" group show --resource-group ${resourceGroupName}`, [], { silent: true, ignoreReturnCode: true });
    if (result != 0) {
        throw Error(`Resource Group ${resourceGroupName} could not be found.`)
    }

    // create the parameter list
    const azDeployParameters = [
        resourceGroupName ? `--resource-group ${resourceGroupName}` : undefined,
        template ?
            template.startsWith("http") ? `--template-uri ${template}` : `--template-file ${template}`
            : undefined,
        deploymentMode && deploymentMode != "validate" ? `--mode ${deploymentMode}` : "--mode Incremental",
        deploymentName ? `--name "${deploymentName}"` : undefined,
        parameters ? `--parameters ${parameters}` : undefined
    ].filter(Boolean).join(' ');

    // configure exec to write the json output to a buffer
    let commandOutput = '';
    const deployOptions: ExecOptions = {
        silent: true,
        ignoreReturnCode: true,
        failOnStdErr: true,
        listeners: {
            stderr: (data: BufferSource) => {
                core.error(data.toString());
            },
            stdout: (data: BufferSource) => {
                fs.appendFileSync("loggingggg1", "appendingggggggg", 'utf8')
                fs.appendFileSync("loggingggg1", data, 'utf8')
                commandOutput += data.toString();
                // console.log(data);
            },
            /*stdline: (data: string) => {
                if (!data.startsWith("[command]"))
                {
                    commandOutput += data;
                    fs.appendFileSync("loggingggg", data, 'utf8')
                    // console.log(data);
                }
                else
                {
                    fs.appendFileSync("commandddd", data, 'utf8')
                }
            },*/
            debug: (data: string) => {
                fs.appendFileSync("debugggg1", data, 'utf8')
                core.debug(data);
            }
        }
    }
    const validateOptions: ExecOptions = {
        silent: true,
        ignoreReturnCode: true,
        listeners: {
            stderr: (data: BufferSource) => {
                core.warning(data.toString());
            },
        }
    }

    // validate the deployment
    core.info("Validating template...")
    core.info("Validating template...")
    core.info("Validating template...")
    core.info("Validating template...")
    core.info("Validating template...")
    var code = await exec(`"${azPath}" deployment group validate ${azDeployParameters} -o json`, [], validateOptions);
    if (deploymentMode === "validate" && code != 0) {
        throw new Error("Template validation failed.")
    } else if (code != 0) {
        core.warning("Template validation failed.")
    }

    if (deploymentMode != "validate") {
        // execute the deployment
        core.info("Creating deployment...")
        var deploymentCode = await exec(`"${azPath}" deployment group create ${azDeployParameters} -o json`, [], deployOptions);
        if (deploymentCode != 0) {
            core.error("Deployment failed.")
        }
        core.debug(commandOutput);

        // Parse the Outputs
        core.info("Parsing outputs...")
        return ParseOutputs(commandOutput)
    }
    return {}
}
