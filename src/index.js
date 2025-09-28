const core = require('@actions/core')
const exec = require('@actions/exec')

;(async () => {
    try {
        const stage = core.getState('STAGE') || 'main'

        if (stage === 'main') {
            core.info('🏳️ Starting - Test Exec Action')

            if (core.getInput('pass') || core.getInput('ssh_key')) {
                console.log('▶️ Running step: src/ssh.sh')
                const ssh = await exec.getExecOutput('bash src/ssh.sh')
                console.log('ssh.exitCode:', ssh.exitCode)
            }

            console.log('▶️ Running step: src/context.sh')
            const context = await exec.getExecOutput('bash src/context.sh')
            console.log('context.exitCode:', context.exitCode)

            core.saveState('STAGE', 'cleanup')
        } else if (stage === 'cleanup') {
            core.info('🏁 Post - Test Exec Action')
            if (core.getState('SSH_CLEANUP')) {
                console.log('▶️ Running step: src/cleanup.sh')
                const cleanup = await exec.getExecOutput('bash src/cleanup.sh')
                console.log('cleanup.exitCode:', cleanup.exitCode)
            }
        }
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.setFailed(e.message)
    }
})()

/**
 * Check Command Output
 * @param {String} commandLine
 * @param {String[]} [args]
 * @param {Boolean} [error]
 * @return {Promise<String|String[]>}
 */
async function checkOutput(commandLine, args = [], error = false) {
    // options = { ...{ ignoreReturnCode: true }, ...options }
    // console.log('options:', options)
    const options = { ignoreReturnCode: true }
    let myOutput = ''
    let myError = ''
    // noinspection JSUnusedGlobalSymbols
    options.listeners = {
        stdout: (data) => {
            myOutput += data.toString()
        },
        stderr: (data) => {
            myError += data.toString()
        },
    }
    await exec.exec(commandLine, args, options)
    // console.log('myError:', myError)
    return [myOutput.trim(), myError.trim()]
    // if (error) {
    //     return [myOutput.trim(), myError.trim()]
    // } else {
    //     return myOutput.trim()
    // }
}
