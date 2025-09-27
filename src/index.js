const core = require('@actions/core')
const exec = require('@actions/exec')
const github = require('@actions/github')

;(async () => {
    try {
        core.info(`🏳️ Starting Test Exec Action`)

        // Debug
        core.startGroup('Debug: github.context')
        console.log(github.context)
        core.endGroup() // Debug github.context
        core.startGroup('Debug: process.env')
        console.log(process.env)
        core.endGroup() // Debug process.env

        const stage = core.getState('STAGE') || 'main'
        console.log('stage:', stage)

        if (stage === 'main') {
            console.log('Running step: src/ssh.sh')

            const ssh = await exec.getExecOutput('bash src/ssh.sh')
            console.log('ssh.stdout:', ssh.stdout)
            console.log('ssh.stdout:', ssh.stderr)
            const context = await exec.getExecOutput('bash src/context.sh')
            console.log('context.stdout:', context.stdout)
            console.log('context.stdout:', context.stderr)

            // await exec.exec('bash src/context.sh')
            // const [output, error] = await checkOutput('bash src/ssh.sh')
            // console.log('----------------------------------------')
            // console.log('output:', output)
            // console.log('----------------------------------------')
            // console.log('error:', error)
            // console.log('----------------------------------------')
            // console.log('Running step: src/context.sh')
            // const [output2, error2] = await checkOutput('bash src/context.sh')
            // console.log('----------------------------------------')
            // console.log('output:', output2)
            // console.log('----------------------------------------')
            // console.log('error:', error2)
            // console.log('----------------------------------------')
            core.saveState('STAGE', 'cleanup')
        } else if (stage === 'cleanup') {
            console.log('Running step: src/cleanup.sh')
            const [output, error] = await checkOutput('bash src/cleanup.sh')
            console.log('----------------------------------------')
            console.log('output:', output)
            console.log('----------------------------------------')
            console.log('error:', error)
            console.log('----------------------------------------')
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
