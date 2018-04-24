# @start/plugin

Start plugin "creator".

## Install

```sh
$ yarn add @start/plugin
```

## Usage

```ts
type StartFile = {
  path: string,
  data: null | string,
  map: null | {}
}

type StartFiles = StartFile[]

type StartPluginProps = {
  files: StartFiles,
  reporter: NodeJS.EventEmitter,
  logFile: (file: string) => void,
  logMessage: (message: string) => void
}

type StartPluginOut = StartFiles | Promise<StartFiles>

type StartPlugin = (props: StartPluginProps) => StartPluginOut
```

```js
import plugin from '@start/plugin'

export default plugin('noop', ({ files }) => files)
```

```js
import plugin from '@start/plugin'

export default plugin('foo', async ({ files, logFile }) => {
  const { default: fooTransform } = await import('foo-lib')

  return Promise.all(
    files.map((file) =>
      fooTransform(file.data).then(({ transformedData, sourceMap }) => {
        logFile(file.path)

        return {
          path: file.path,
          data: transformedData,
          map: sourceMap
        }
      })
    )
  )
})
```

```js
import plugin from '@start/plugin'

export default (barOptions) =>
  plugin('bar', async ({ files, logMessage }) => {
    const { default: barCheck } = await import('bar-lib')

    const barResult = barCheck(files, barOptions)

    if (barResult.issues.length === 0) {
      logMessage('¯\\_(ツ)_/¯')
    }

    return files
  })
```

## Notes

* Dynamic imports – [it's a good idea](https://github.com/gulpjs/gulp/issues/632) to "lazyload" dependencies inside of a plugin function instead of importing them at top.