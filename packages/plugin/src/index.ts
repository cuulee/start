export type StartFile = {
  path: string,
  data: null | string,
  map: null | {}
}

export type StartFiles = StartFile[]

export type StartPluginFnProps = {
  files: StartFiles,
  reporter: NodeJS.EventEmitter,
  logFile: (file: string) => void,
  logMessage: (message: string) => void
}

export type StartPluginProps = {
  files: StartFiles,
  reporter: NodeJS.EventEmitter
}

export type StartPluginOut = StartFiles | Promise<StartFiles>

export type StartPluginFn = (props: StartPluginFnProps) => StartPluginOut

export type StartPluginSync = (props: StartPluginProps) => StartPluginOut

export type StartPlugin = StartPluginSync | Promise<StartPluginSync>

export default (name: string, pluginFn: StartPluginFn): StartPluginSync => async ({ reporter, files }) => {
  try {
    reporter.emit('start', name)

    const result = await pluginFn({
      files,
      reporter,
      logFile: (file) => reporter.emit('file', name, file),
      logMessage: (message) => reporter.emit('message', name, message)
    })

    reporter.emit('done', name)

    return result
  } catch (error) {
    reporter.emit('error', name, error)

    throw null
  }
}
