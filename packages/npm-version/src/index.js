// @flow
import type { StartPlugin } from '@start/task/src/'

export default (version: string, packagePath: string = '.') => {
  const npmVersion: StartPlugin = ({ input }) => {
    const path = require('path')
    const execa = require('execa')

    return execa('npm', ['version', version], {
      cwd: path.resolve(packagePath),
      stdout: process.stdout,
      stderr: process.stderr,
      stripEof: false,
      env: {
        FORCE_COLOR: true,
      },
    }).catch(() => Promise.reject())
  }

  return npmVersion
}