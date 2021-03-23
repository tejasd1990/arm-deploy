import * as core from '@actions/core';
import fs from 'fs';

export type Outputs = { [index: string]: { value: string } }
export function ParseOutputs(commandOutput: string): Outputs {
    // parse the result and save the outputs
    fs.appendFileSync("loggingggg", "1111111111111", 'utf8')
    var result = JSON.parse(commandOutput) as { properties: { outputs: Outputs } }
    fs.appendFileSync("loggingggg", "2222222222222", 'utf8')
    var object = result.properties.outputs
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            core.setOutput(key, object[key].value)
        }
    }

    return object
}